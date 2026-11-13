import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleAlert, CircleCheck, Lock, RotateCcw, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../state/AppState'
import { navigate, useRouteParam } from '../lib/router'
import { cn } from '../lib/utils'
import type { ChoiceTone, Scenario } from '../data/types'
import { HelpLineCard, PageHeader } from '../components/ui/shared'
import { Card, Tag } from '../components/ui/misc'
import { Button } from '../components/ui/Button'

/** Jamais une note : un repère pour réfléchir (texte + icône + couleur). */
const tones: Record<ChoiceTone, { label: string; icon: LucideIcon; box: string; text: string }> = {
  good: { label: 'Bon réflexe', icon: CircleCheck, box: 'border-success/50 bg-success-soft', text: 'text-success-text' },
  mixed: { label: 'À nuancer', icon: CircleAlert, box: 'border-warning/50 bg-warning-soft', text: 'text-warning-text' },
  risky: { label: 'Risqué', icon: TriangleAlert, box: 'border-danger/40 bg-danger-soft', text: 'text-danger-text' },
}

export default function Situations() {
  const { config } = useApp()
  const param = useRouteParam()
  const scenario = config.situations.scenarios.find((s) => s.id === param)

  // Changer de situation (ou revenir à la liste) : retour en haut de page.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [param])

  return scenario ? <Player key={scenario.id} scenario={scenario} /> : <List />
}

/* ---------- Liste des situations ---------------------------------------- */

function List() {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const s = config.situations
  return (
    <div>
      <PageHeader eyebrow={s.eyebrow} title={s.title} intro={s.intro} squiggle />
      <ul className="grid gap-4 md:grid-cols-2">
        {s.scenarios.map((sc, i) => {
          const Icon = sc.icon
          return (
            <motion.li
              key={sc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <a
                href={`#/situations/${sc.id}`}
                className="group flex h-full flex-col rounded-[1.375rem] border border-line bg-surface p-5 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-raised"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <Tag>{sc.place}</Tag>
                </span>
                <span className="mt-4 block font-display text-[1.25rem] leading-tight text-fg">{sc.title}</span>
                <span className="mt-1.5 block flex-1 text-[0.9375rem] text-muted">{sc.summary}</span>
                <span className="mt-4 flex items-center justify-between text-[0.8125rem] font-semibold text-muted group-hover:text-fg">
                  {sc.steps.length} choix · 2 min
                  <span className="inline-flex items-center gap-1">
                    {tu ? 'Jouer' : 'Commencer'}
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </span>
              </a>
            </motion.li>
          )
        })}
      </ul>
      <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-muted">
        <Lock className="size-3.5" aria-hidden />
        {tu ? 'Tes choix ne sont ni enregistrés ni envoyés.' : 'Vos choix ne sont ni enregistrés ni envoyés.'}
      </p>
    </div>
  )
}

/* ---------- Déroulé d’une situation ------------------------------------- */

function Player({ scenario }: { scenario: Scenario }) {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const [step, setStep] = useState(0)
  // Les choix vivent ici et disparaissent quand on quitte l’écran.
  const [picks, setPicks] = useState<(string | null)[]>(() => scenario.steps.map(() => null))
  const recap = step >= scenario.steps.length

  const pick = (id: string) => setPicks((p) => p.map((v, i) => (i === step ? id : v)))
  const go = (n: number) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const restart = () => {
    setPicks(scenario.steps.map(() => null))
    go(0)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <a
        href="#/situations"
        className="-ml-2 inline-flex h-11 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" aria-hidden /> Toutes les situations
      </a>

      <header className="mt-2 mb-6">
        <div className="mb-3 flex items-center gap-3">
          <p className="eyebrow">{scenario.place}</p>
          <span className="text-xs font-semibold text-muted tabular-nums">
            {recap ? 'Bilan' : `Étape ${step + 1} sur ${scenario.steps.length}`}
          </span>
        </div>
        <h1 className="font-display text-title text-balance text-fg">{scenario.title}</h1>
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {[...scenario.steps, null].map((_, i) => (
            <span key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', i <= step ? 'bg-accent' : 'bg-line')} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {recap ? (
            <Recap scenario={scenario} picks={picks} onRestart={restart} />
          ) : (
            <StepView
              scenario={scenario}
              index={step}
              picked={picks[step]}
              onPick={pick}
              onNext={() => go(step + 1)}
              onBack={step > 0 ? () => go(step - 1) : undefined}
              tu={tu}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StepView({
  scenario,
  index,
  picked,
  onPick,
  onNext,
  onBack,
  tu,
}: {
  scenario: Scenario
  index: number
  picked: string | null
  onPick: (id: string) => void
  onNext: () => void
  onBack?: () => void
  tu: boolean
}) {
  const s = scenario.steps[index]
  const choice = s.choices.find((c) => c.id === picked)
  const last = index === scenario.steps.length - 1

  return (
    <div className="space-y-6">
      <Card className="p-5 md:p-6">
        <p className="text-[1.0625rem] text-fg">{s.narration}</p>
        {s.chat && (
          <div className="dot-grid mt-4 space-y-2.5 rounded-2xl border border-line bg-bg p-3.5" role="group" aria-label="Messages de la situation (fictifs)">
            {s.chat.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 + i * 0.35 }}
                className="max-w-[85%]"
              >
                <p className="mb-0.5 pl-3 text-xs font-semibold text-muted">{m.from}</p>
                <p className="rounded-2xl rounded-tl-md bg-surface px-3.5 py-2 text-[0.9375rem] text-fg shadow-xs">{m.text}</p>
                {m.meta && <p className="mt-0.5 pl-3 text-xs text-muted">{m.meta}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <fieldset>
        <legend className="mb-3 font-display text-[1.375rem] leading-tight text-fg">{s.question}</legend>
        <ul className="space-y-2.5">
          {s.choices.map((c) => {
            const selected = c.id === picked
            const tone = tones[c.tone]
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onPick(c.id)}
                  className={cn(
                    'flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[0.9375rem] font-medium transition-[border-color,background-color,opacity] duration-200',
                    selected
                      ? cn(tone.box, 'text-fg')
                      : picked
                        ? 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg'
                        : 'border-line bg-surface text-fg hover:border-accent-line hover:bg-accent-soft/40',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors',
                      selected ? cn('border-current', tone.text) : 'border-line-strong',
                    )}
                    aria-hidden
                  >
                    {selected && <span className="size-2.5 rounded-full bg-current" />}
                  </span>
                  <span className="flex-1">{c.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {choice && (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn('rounded-2xl border p-4 md:p-5', tones[choice.tone].box)}
            >
              <p className={cn('flex items-center gap-2 font-semibold', tones[choice.tone].text)}>
                {(() => {
                  const Icon = tones[choice.tone].icon
                  return <Icon className="size-5" aria-hidden />
                })()}
                {tones[choice.tone].label}
              </p>
              <p className="mt-1.5 text-[0.9375rem] text-fg">{choice.outcome}</p>
              {choice.tone !== 'good' && (
                <p className="mt-2 text-[0.8125rem] text-muted">
                  {tu ? 'Tu peux choisir une autre réponse pour voir la différence.' : 'Vous pouvez choisir une autre réponse pour comparer.'}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        {onBack ? (
          <Button variant="ghost" icon={<ArrowLeft className="size-4" aria-hidden />} onClick={onBack}>
            Étape précédente
          </Button>
        ) : (
          <span />
        )}
        <Button size="lg" disabled={!choice} onClick={onNext} iconRight={<ArrowRight className="size-4" aria-hidden />}>
          {last ? 'Voir ce qu’on retient' : 'La suite'}
        </Button>
      </div>
    </div>
  )
}

function Recap({ scenario, picks, onRestart }: { scenario: Scenario; picks: (string | null)[]; onRestart: () => void }) {
  const { config, dispatch } = useApp()
  const tu = config.address === 'tu'

  const follow = () => {
    const n = scenario.next
    if (n.to === 'missions' && n.track) dispatch({ type: 'track', track: n.track })
    navigate(n.to)
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-ink-fg md:p-7" aria-labelledby="takeaways">
        <h2 id="takeaways" className="font-display text-[1.5rem] leading-tight">
          Ce qu’on retient
        </h2>
        <ul className="mt-4 space-y-3">
          {scenario.takeaways.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/15">
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
              <span className="text-[0.9375rem] opacity-90">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <Card className="p-5">
        <h2 className="eyebrow mb-3">{tu ? 'Tes choix' : 'Vos choix'}</h2>
        <ol className="space-y-4">
          {scenario.steps.map((s, i) => {
            const c = s.choices.find((x) => x.id === picks[i])
            if (!c) return null
            const tone = tones[c.tone]
            const Icon = tone.icon
            return (
              <li key={i} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold text-fg tabular-nums">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[0.8125rem] text-muted">{s.question}</p>
                  <p className="mt-0.5 text-[0.9375rem] font-medium text-fg">{c.label}</p>
                  <p className={cn('mt-1 inline-flex items-center gap-1.5 text-xs font-semibold', tone.text)}>
                    <Icon className="size-3.5" aria-hidden />
                    {tone.label}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      {scenario.sensitive && (
        <div>
          <p className="eyebrow mb-3">{tu ? 'Si ça t’arrive pour de vrai' : 'Si cela arrive pour de vrai'}</p>
          <HelpLineCard line={config.helpLines[0]} emphasis />
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <Button variant="ghost" icon={<RotateCcw className="size-4" aria-hidden />} onClick={onRestart}>
          Rejouer
        </Button>
        <Button variant="secondary" onClick={() => navigate('situations')}>
          Une autre situation
        </Button>
        <Button onClick={follow} iconRight={<ArrowRight className="size-4" aria-hidden />}>
          {scenario.next.label}
        </Button>
      </div>
    </div>
  )
}
