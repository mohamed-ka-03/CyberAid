import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, BookOpen, ChevronRight, Drama, Lightbulb, Lock, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp, useProgress } from '../state/AppState'
import { navigate } from '../lib/router'
import type { Entry, LearnSheet } from '../data/types'
import { EntryArt, HeroSignal, SignalArcs } from '../components/art/Signal'
import { HelpLineCard, HelpStrip, Squiggle } from '../components/ui/shared'
import { Card } from '../components/ui/misc'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useBreathe } from '../components/breathe/Breathe'

export default function Home() {
  const { config, dispatch, ps } = useApp()
  const { current } = useProgress()
  const [learn, setLearn] = useState<LearnSheet | null>(null)
  const tu = config.address === 'tu'
  const home = config.home
  const line = config.helpLines[0]

  const open = (e: Entry) => {
    dispatch({ type: 'context', context: e.context })
    if (e.action === 'learn') {
      setLearn(home.learn.find((l) => l.context === e.context) ?? null)
      return
    }
    // Nouveau contexte → on repart d’un check-up vierge ; même contexte → on reprend où on en était.
    if (ps.context !== e.context) dispatch({ type: 'checkup-reset' })
    navigate('check-up')
  }

  const follow = (to: LearnSheet['primary']) => {
    setLearn(null)
    if (to.to === 'missions') {
      if (to.track) dispatch({ type: 'track', track: to.track })
      navigate('missions')
    } else {
      dispatch({ type: 'checkup-reset' })
      navigate('check-up')
    }
  }

  // Typographie française : espace insécable avant « ? », pas de coupure dans les mots composés.
  const title = home.title.replace(' ?', ' ?').replace(/-/g, '‑')

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-16">
      <div className="min-w-0">
        {/* Hero éditorial */}
        <section className="relative" aria-labelledby="home-title">
          <HeroSignal className="absolute -top-6 -right-4 size-32 opacity-90 xs:size-36 md:-top-8 md:size-48 lg:-right-2" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <p className="eyebrow">{home.eyebrow}</p>
              {current.done > 0 && (
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-text">
                  {current.done}/{current.total} {config.missions.unit}
                </span>
              )}
            </div>
            <h1 id="home-title" className={`font-display text-display text-balance text-fg ${tu ? 'max-w-[11ch]' : 'max-w-[13ch] pr-16 sm:pr-0'}`}>
              {title}
            </h1>
            <Squiggle className="mt-2 w-28 md:w-36" />
            <p className="mt-4 max-w-[34rem] text-[1.0625rem] text-pretty text-muted md:text-lg">{home.intro}</p>
          </div>
        </section>

        {/* Trois entrées */}
        <nav aria-label="Par où commencer" className="mt-8">
          <ul className="grid gap-3 xl:grid-cols-3">
            {home.entries.map((e, i) => (
              <motion.li
                key={e.context}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button
                  type="button"
                  onClick={() => open(e)}
                  className="group flex h-full w-full items-center gap-4 rounded-[1.375rem] border border-line bg-surface p-4 text-left shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-raised xl:flex-col xl:items-start xl:p-5"
                >
                  <EntryArt kind={e.art} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.0625rem] leading-snug font-semibold text-fg xl:text-lg">{e.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{e.description}</span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunken text-muted transition-colors group-hover:bg-accent group-hover:text-accent-fg xl:self-end">
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
          <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-muted">
            <Lock className="size-3.5" aria-hidden />
            {tu ? 'Rien n’est enregistré. Rien n’est envoyé.' : 'Aucune réponse n’est enregistrée ni envoyée.'}
          </p>
        </nav>

        <div className="mt-6 lg:hidden">
          <HelpStrip line={line} label={tu ? `Besoin de parler ? Appelle le ${line.number}` : `Besoin de conseils ? Le ${line.number}`} />
        </div>

        <Toolbox />

        {/* Promesse + fonctionnement */}
        <section className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-ink p-6 text-ink-fg md:p-8" aria-labelledby="promise">
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -bottom-16 size-56 opacity-[0.16]" aria-hidden fill="none">
            {[30, 60, 90, 120].map((r) => (
              <path key={r} d={`M ${200 - r} 200 A ${r} ${r} 0 0 1 200 ${200 - r}`} stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
            ))}
          </svg>
          <h2 id="promise" className="max-w-md font-display text-[1.5rem] leading-tight md:text-[1.75rem]">
            {home.promise.title}
          </h2>
          <p className="mt-2 max-w-lg text-[0.9375rem] opacity-80">{home.promise.text}</p>
          <ol className="relative mt-6 grid gap-4 sm:grid-cols-3">
            {home.steps.map((s, i) => (
              <li key={s.title} className="flex gap-3 sm:flex-col sm:gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/25 text-sm font-bold tabular-nums">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-sm opacity-75">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Colonne contextuelle */}
      <aside className="space-y-4 lg:pt-2" aria-label="En un coup d’œil">
        <Card className="p-5">
          <p className="eyebrow">{tu ? 'Ta progression' : 'Votre plan'}</p>
          <div className="mt-3 flex items-center gap-4 lg:flex-col lg:items-stretch">
            <SignalArcs
              total={current.total}
              done={current.done}
              className="w-28 shrink-0 lg:mx-auto lg:w-44"
              label={`${current.done} ${config.missions.unit} sur ${current.total}`}
            />
            <div className="min-w-0 lg:text-center">
              <p className="font-display text-xl text-fg">
                {current.done} sur {current.total} {config.missions.unit}
              </p>
              <p className="text-sm text-muted">
                {current.done === 0 ? (tu ? 'Rien ne presse. Commence quand tu veux.' : 'Aucune étape commencée, à votre rythme.') : current.label}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" block className="mt-4" onClick={() => navigate('missions')} iconRight={<ArrowRight className="size-4" aria-hidden />}>
            {current.done === 0 ? 'Découvrir' : 'Reprendre'}
          </Button>
        </Card>

        <div className="hidden lg:block">
          <p className="eyebrow mb-3">{tu ? 'Parler à quelqu’un' : 'Être conseillé'}</p>
          <HelpLineCard line={line} emphasis />
        </div>

        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-accent-text">
            <Lightbulb className="size-4" aria-hidden /> {home.tip.title}
          </p>
          <p className="mt-2 text-[0.9375rem] text-fg">{home.tip.text}</p>
        </Card>
      </aside>

      <Modal
        open={!!learn}
        onClose={() => setLearn(null)}
        eyebrow={learn?.eyebrow}
        title={learn?.title ?? ''}
        size="lg"
        footer={
          learn && (
            <>
              {learn.secondary && (
                <Button variant="secondary" onClick={() => follow(learn.secondary!)}>
                  {learn.secondary.label}
                </Button>
              )}
              <Button onClick={() => follow(learn.primary)} iconRight={<ArrowRight className="size-4" aria-hidden />} data-autofocus>
                {learn.primary.label}
              </Button>
            </>
          )
        }
      >
        <ol className="space-y-4 pt-3">
          {learn?.points.map((p, i) => (
            <li key={p.title} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-text tabular-nums">{i + 1}</span>
              <div>
                <h3 className="font-semibold text-fg">{p.title}</h3>
                <p className="mt-0.5 text-[0.9375rem] text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Modal>
    </div>
  )
}

/* ---------- Boîte à outils : accès aux outils depuis tous les écrans ------- */
function Toolbox() {
  const { config } = useApp()
  const breathe = useBreathe()
  const tu = config.address === 'tu'
  const tools: { icon: LucideIcon; title: string; text: string; onClick: () => void }[] = [
    {
      icon: Drama,
      title: tu ? 'Et toi, tu ferais quoi ?' : 'Mises en situation',
      text: tu ? 'Des situations à jouer pour t’entraîner' : 'S’entraîner à réagir, sans jugement',
      onClick: () => navigate('situations'),
    },
    {
      icon: BookOpen,
      title: 'Guides des applis',
      text: tu ? 'Bloquer, signaler, protéger ton compte' : 'Bloquer, signaler, protéger le compte',
      onClick: () => navigate('guides'),
    },
    {
      icon: Wind,
      title: tu ? 'J’ai besoin de souffler' : 'Prendre une pause',
      text: tu ? 'Respirer et se poser, en 1 minute' : 'Respiration guidée, en 1 minute',
      onClick: breathe,
    },
  ]
  return (
    <section className="mt-10" aria-labelledby="toolbox">
      <h2 id="toolbox" className="eyebrow mb-3">
        Boîte à outils
      </h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {tools.map(({ icon: Icon, title, text, onClick }) => (
          <li key={title}>
            <button
              type="button"
              onClick={onClick}
              className="group flex h-full w-full items-center gap-3.5 rounded-[1.375rem] border border-line bg-surface p-4 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent-line sm:flex-col sm:items-start"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block leading-snug font-semibold text-fg">{title}</span>
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">{text}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 sm:hidden" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
