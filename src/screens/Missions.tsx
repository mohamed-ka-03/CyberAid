import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Waves } from 'lucide-react'
import { useApp, useProgress, type MissionStatus } from '../state/AppState'
import { navigate } from '../lib/router'
import { useMediaQuery } from '../lib/utils'
import type { MissionTrack } from '../data/types'
import { SignalArcs } from '../components/art/Signal'
import { MissionCard, MissionItem, MissionSheet } from '../components/missions/MissionParts'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { PageHeader } from '../components/ui/shared'
import { Card, EmptyState } from '../components/ui/misc'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

type Filter = 'all' | 'todo' | 'done'

export default function Missions() {
  const { config, ps, dispatch } = useApp()
  const { current } = useProgress()
  const toast = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const grid = useMediaQuery('(min-width: 1280px)')
  const tu = config.address === 'tu'

  const track = config.missions.tracks[ps.track]
  const list = track.missions
  const visible = list.filter((m) => {
    const st = ps.missions[m.id]?.status ?? 'todo'
    return filter === 'all' || (filter === 'done' ? st === 'done' : st !== 'done')
  })
  const openIndex = list.findIndex((m) => m.id === openId)
  const open = openIndex >= 0 ? list[openIndex] : null
  const activeArcs = list.map((m, i) => (ps.missions[m.id]?.status === 'active' ? i : -1)).filter((i) => i >= current.done)
  const nextTodo = list.find((m) => ps.missions[m.id]?.status !== 'done')

  const setStatus = (id: string, status: MissionStatus, total: number) => {
    const wasDone = ps.missions[id]?.status === 'done'
    dispatch({ type: 'mission', id, status, total })
    if (status === 'done' && !wasDone && current.done + 1 === current.total) {
      toast({ tone: 'success', title: tu ? 'Tous tes réflexes sont en place' : 'Votre plan est complet', text: config.missions.doneAll })
    }
  }

  const nextAfter = (i: number) => {
    const rest = [...list.slice(i + 1), ...list.slice(0, i)]
    return rest.find((m) => ps.missions[m.id]?.status !== 'done')
  }

  return (
    <div>
      <PageHeader eyebrow={config.missions.eyebrow} title={config.missions.title} intro={config.missions.intro} squiggle />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-14">
        {/* Panneau signal : compact en haut sur mobile, colonne collante sur desktop */}
        <aside className="lg:sticky lg:top-12 lg:self-start" aria-label="Progression">
          <Card className="flex items-center gap-4 p-4 lg:flex-col lg:items-stretch lg:p-6">
            <SignalArcs
              total={current.total}
              done={current.done}
              active={activeArcs}
              className="w-24 shrink-0 xs:w-28 lg:mx-auto lg:w-full lg:max-w-52"
              label={`${current.done} ${config.missions.unit} sur ${current.total}`}
            />
            <div className="min-w-0 flex-1 lg:text-center">
              <p className="font-display text-[1.375rem] leading-tight text-fg tabular-nums">
                {current.done} / {current.total} <span className="text-base text-muted">{config.missions.unit}</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {current.done === current.total
                  ? config.missions.doneAll
                  : current.done === 0
                    ? tu
                      ? 'Chaque arc s’allume quand tu avances.'
                      : 'Chaque arc s’allume à chaque étape.'
                    : tu
                      ? 'Le signal porte plus loin à chaque réflexe.'
                      : 'Votre plan avance, à votre rythme.'}
              </p>
            </div>
            <div className="hidden lg:block">
              <Button block onClick={() => navigate('message')} iconRight={<ArrowRight className="size-4" aria-hidden />}>
                {tu ? 'Préparer mon message' : 'Préparer le message'}
              </Button>
              {nextTodo && (
                <Button variant="ghost" size="sm" block className="mt-1" onClick={() => setOpenId(nextTodo.id)}>
                  {tu ? 'Ouvrir la prochaine' : 'Ouvrir la prochaine étape'}
                </Button>
              )}
            </div>
          </Card>
        </aside>

        <section aria-labelledby="mission-list" className="min-w-0">
          <h2 id="mission-list" className="sr-only">
            Liste des missions
          </h2>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SegmentedControl<MissionTrack>
              label="Situation"
              value={ps.track}
              onChange={(t) => dispatch({ type: 'track', track: t })}
              options={(Object.keys(config.missions.tracks) as MissionTrack[]).map((k) => ({ value: k, label: config.missions.tracks[k].label }))}
              className="flex w-full sm:inline-flex sm:w-auto"
            />
            <SegmentedControl<Filter>
              label="Filtrer"
              size="sm"
              value={filter}
              onChange={setFilter}
              className="flex w-full sm:inline-flex sm:w-auto"
              options={[
                { value: 'all', label: 'Toutes' },
                { value: 'todo', label: 'À faire' },
                { value: 'done', label: 'Faites' },
              ]}
            />
          </div>

          {current.done === current.total && filter !== 'todo' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-3 rounded-2xl bg-success-soft p-4 text-sm text-fg">
              <Waves className="size-5 shrink-0 text-success-text" aria-hidden />
              {config.missions.doneAll}
            </motion.div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${ps.track}-${filter}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {visible.length === 0 ? (
                filter === 'done' ? (
                  <EmptyState
                    title={tu ? 'Rien de terminé pour l’instant' : 'Aucune étape terminée'}
                    text={tu ? 'Chaque mission compte, même la plus petite. Commence par celle qui te paraît la plus simple.' : 'Commencez par l’étape qui vous semble la plus accessible.'}
                    action={
                      <Button variant="secondary" size="sm" onClick={() => setFilter('all')}>
                        Voir toutes les missions
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    title={tu ? 'Tout est fait' : 'Tout est réalisé'}
                    text={config.missions.doneAll}
                    action={
                      <Button variant="secondary" size="sm" onClick={() => navigate('message')}>
                        {tu ? 'Préparer mon message' : 'Préparer le message'}
                      </Button>
                    }
                  />
                )
              ) : grid ? (
                <ul className="grid grid-cols-2 gap-4 2xl:grid-cols-3">
                  {visible.map((m) => (
                    <MissionCard key={m.id} mission={m} index={list.indexOf(m)} progress={ps.missions[m.id]} onOpen={() => setOpenId(m.id)} />
                  ))}
                </ul>
              ) : (
                <ol>
                  {visible.map((m, i) => (
                    <MissionItem
                      key={m.id}
                      mission={m}
                      index={list.indexOf(m)}
                      progress={ps.missions[m.id]}
                      last={i === visible.length - 1}
                      onOpen={() => setOpenId(m.id)}
                    />
                  ))}
                </ol>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 lg:hidden">
            <Button size="lg" block onClick={() => navigate('message')} iconRight={<ArrowRight className="size-5" aria-hidden />}>
              {tu ? 'Préparer mon message d’aide' : 'Préparer le message à l’école'}
            </Button>
          </div>
        </section>
      </div>

      <MissionSheet
        open={!!open}
        onClose={() => setOpenId(null)}
        mission={open}
        index={openIndex}
        total={list.length}
        progress={open ? ps.missions[open.id] : undefined}
        address={config.address}
        onToggleStep={(i) => open && dispatch({ type: 'step', id: open.id, index: i, total: open.steps.length })}
        onGuide={() => {
          setOpenId(null)
          navigate('guides')
        }}
        onSetStatus={(s) => open && setStatus(open.id, s, open.steps.length)}
        onNext={(() => {
          const n = openIndex >= 0 ? nextAfter(openIndex) : undefined
          return n ? () => setOpenId(n.id) : undefined
        })()}
      />
    </div>
  )
}
