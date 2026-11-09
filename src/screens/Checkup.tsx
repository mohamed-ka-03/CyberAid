import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, CircleAlert, Lightbulb, Lock, X, PencilLine, HeartHandshake, Eye, CircleCheck, RotateCcw } from 'lucide-react'
import { useApp } from '../state/AppState'
import { navigate } from '../lib/router'
import { cn } from '../lib/utils'
import type { Question } from '../data/types'
import { StepProgress } from '../components/art/Signal'
import { QuestionOption } from '../components/checkup/QuestionOption'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Card } from '../components/ui/misc'
import { HelpLineCard } from '../components/ui/shared'

const LETTERS = 'ABCDEFG'

export default function Checkup() {
  const { config, ps, dispatch } = useApp()
  const { questions } = config.checkup
  const { step, dir } = ps.checkup
  const [error, setError] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const tu = config.address === 'tu'
  const total = questions.length
  const isIntro = step < 0
  const isSummary = step >= total
  const q = !isIntro && !isSummary ? questions[step] : null

  const go = (s: number) => {
    setError(false)
    dispatch({ type: 'checkup-go', step: s })
  }

  const leave = () => {
    setConfirmLeave(false)
    dispatch({ type: 'checkup-reset' })
    navigate('accueil')
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* En-tête persistant : position + sortie */}
      <div className="mb-6 flex items-center gap-3">
        <p className="eyebrow">Check-up</p>
        {!isIntro && !isSummary && (
          <p className="text-[0.8125rem] font-semibold text-muted tabular-nums" aria-hidden>
            {step + 1} / {total}
          </p>
        )}
        {!isIntro && (
          <Button variant="ghost" size="sm" className="-mr-2 ml-auto" icon={<X className="size-4" aria-hidden />} onClick={() => setConfirmLeave(true)}>
            {config.labels.leave}
          </Button>
        )}
      </div>
      {!isIntro && (
        <div className="mb-8 max-w-xl">
          <StepProgress total={total} current={isSummary ? total : step} label="Avancement du check-up" />
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={isIntro ? 'intro' : isSummary ? 'summary' : q!.id}
          custom={dir}
          initial={{ opacity: 0, x: dir * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -16 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {isIntro && <Intro onStart={() => go(0)} />}
          {q && (
            <QuestionStep
              key={q.id}
              question={q}
              index={step}
              error={error}
              setError={setError}
              onBack={() => (step === 0 ? go(-1) : go(step - 1))}
              onNext={() => go(step + 1)}
            />
          )}
          {isSummary && <Summary onEdit={go} onRestart={() => dispatch({ type: 'checkup-reset' })} />}
        </motion.div>
      </AnimatePresence>

      <Modal
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        role="alertdialog"
        size="sm"
        title={tu ? 'Quitter le check-up ?' : 'Quitter le check-up ?'}
        description={
          tu
            ? 'Tes réponses seront effacées de cet écran. Tu pourras recommencer quand tu veux.'
            : 'Vos réponses seront effacées de cet écran. Vous pourrez recommencer à tout moment.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmLeave(false)} data-autofocus>
              Continuer le check-up
            </Button>
            <Button variant="ink" onClick={leave}>
              Quitter et effacer
            </Button>
          </>
        }
      />
    </div>
  )
}

/* ---------- Introduction ------------------------------------------------- */
function Intro({ onStart }: { onStart: () => void }) {
  const { config, ps } = useApp()
  const entry = config.home.entries.find((e) => e.context === ps.context)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
      <div>
        <h1 className="max-w-[16ch] font-display text-title text-balance text-fg">{config.checkup.title}</h1>
        <p className="mt-3 max-w-lg text-[1.0625rem] text-muted">{config.checkup.intro}</p>
        {entry && (
          <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-1.5 pl-3.5 text-sm text-muted">
            Point de départ : <strong className="font-semibold text-fg">{entry.title}</strong>
            <a href="#/accueil" className="rounded-full px-2.5 py-1 font-semibold text-accent-text hover:bg-accent-soft">
              Changer
            </a>
          </p>
        )}
        <div className="mt-8">
          <Button size="lg" onClick={onStart} iconRight={<ArrowRight className="size-5" aria-hidden />}>
            Commencer
          </Button>
        </div>
      </div>
      <Card className="p-5">
        <ul className="space-y-3 text-sm text-fg">
          <li className="flex gap-3">
            <Lock className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
            {config.checkup.privacy}
          </li>
          <li className="flex gap-3">
            <PencilLine className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
            {config.address === 'tu' ? 'Tu peux revenir en arrière et modifier chaque réponse.' : 'Chaque réponse peut être modifiée avant le résumé.'}
          </li>
          <li className="flex gap-3">
            <X className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
            {config.address === 'tu' ? 'Tu peux quitter à tout moment.' : 'Vous pouvez quitter à tout moment.'}
          </li>
        </ul>
      </Card>
    </div>
  )
}

/* ---------- Question ----------------------------------------------------- */
function QuestionStep({
  question,
  index,
  error,
  setError,
  onBack,
  onNext,
}: {
  question: Question
  index: number
  error: boolean
  setError: (v: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  const { config, ps, dispatch } = useApp()
  const selected = ps.checkup.answers[question.id] ?? []
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const heading = useRef<HTMLHeadingElement>(null)
  const title = (ps.context && question.titleByContext?.[ps.context]) || question.title
  const answered = selected.length > 0
  const tu = config.address === 'tu'

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [])

  const toggle = (id: string) => {
    setError(false)
    const opt = question.options.find((o) => o.id === id)!
    let next: string[]
    if (!question.multi) next = [id]
    else if (opt.exclusive) next = selected.includes(id) ? [] : [id]
    else {
      const exclusive = new Set(question.options.filter((o) => o.exclusive).map((o) => o.id))
      const base = selected.filter((s) => !exclusive.has(s))
      next = base.includes(id) ? base.filter((s) => s !== id) : [...base, id]
    }
    dispatch({ type: 'answer', question: question.id, values: next })
  }

  const submit = () => {
    if (!answered) {
      setError(true)
      return
    }
    onNext()
  }

  // Raccourcis : flèches pour se déplacer, lettres pour choisir, Entrée pour continuer
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + question.options.length) % question.options.length
      refs.current[n]?.focus()
    }
  }
  useEffect(() => {
    const on = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector('[role="dialog"],[role="alertdialog"]')) return
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      const idx = LETTERS.indexOf(e.key.toUpperCase())
      if (idx >= 0 && idx < question.options.length) toggle(question.options[idx].id)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="min-w-0"
        noValidate
      >
        <fieldset aria-labelledby={`q-${question.id}`} aria-describedby={error ? `err-${question.id}` : undefined}>
          <p className="mb-2 text-sm font-semibold text-accent-text">
            Question {index + 1} sur {config.checkup.questions.length}
          </p>
          <h1 id={`q-${question.id}`} ref={heading} tabIndex={-1} className="max-w-[20ch] font-display text-title text-balance text-fg outline-none">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">{question.helper ?? (tu ? 'Choisis une réponse.' : 'Choisissez une réponse.')}</p>

          <div role={question.multi ? 'group' : 'radiogroup'} aria-label={title} className="mt-6 grid max-w-xl gap-2.5">
            {question.options.map((o, i) => (
              <QuestionOption
                key={o.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                letter={LETTERS[i]}
                label={o.label}
                hint={o.hint}
                multi={question.multi}
                selected={selected.includes(o.id)}
                onSelect={() => toggle(o.id)}
                onKeyDown={(e) => onKey(e, i)}
              />
            ))}
          </div>
        </fieldset>

        <AnimatePresence>
          {error && (
            <motion.p
              id={`err-${question.id}`}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex max-w-xl items-start gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger-text"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {tu
                ? 'Choisis au moins une réponse pour continuer. Tu peux aussi choisir de ne pas répondre.'
                : 'Choisissez au moins une réponse pour continuer.'}
            </motion.p>
          )}
        </AnimatePresence>

        <div aria-live="polite" className="mt-5 max-w-xl lg:hidden">
          <AnimatePresence mode="wait">
          {answered ? (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border-l-4 border-accent bg-surface p-4 shadow-card"
            >
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-accent-text uppercase">
                <Lightbulb className="size-4" aria-hidden /> {question.tip.title}
              </p>
              <p className="mt-2 text-[0.9375rem] text-fg">{question.tip.text}</p>
            </motion.div>
          ) : (
            <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden text-sm text-faint lg:block">
              {tu ? 'Un conseil apparaîtra ici après ta réponse.' : 'Un éclairage apparaîtra ici après votre réponse.'}
            </motion.p>
          )}
        </AnimatePresence>
        </div>

        {/* Barre d’actions : collée au-dessus de la navigation sur mobile, à portée de pouce */}
        <div className="sticky bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom))] z-10 -mx-4 mt-6 bg-gradient-to-t from-bg via-bg to-bg/0 px-4 pt-6 pb-3 xs:-mx-5 xs:px-5 md:static md:mx-0 md:bg-none md:p-0 md:pt-2">
          <div className="flex max-w-xl gap-2">
            <Button variant="secondary" size="lg" onClick={onBack} icon={<ArrowLeft className="size-5" aria-hidden />} aria-label={config.labels.back}>
              <span className="hidden sm:inline">{config.labels.back}</span>
            </Button>
            <Button
              type="submit"
              size="lg"
              block
              aria-disabled={!answered}
              className={cn('flex-1', !answered && 'opacity-90')}
              iconRight={<ArrowRight className="size-5" aria-hidden />}
            >
              {index === config.checkup.questions.length - 1 ? 'Voir le résumé' : config.labels.continue}
            </Button>
          </div>
        </div>
      </form>

      {/* Feedback explicatif : révélé après une réponse (progressive disclosure) — colonne dédiée sur desktop */}
      <aside aria-live="polite" className="hidden lg:block lg:pt-24">
        <AnimatePresence mode="wait">
          {answered ? (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border-l-4 border-accent bg-surface p-4 shadow-card"
            >
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-accent-text uppercase">
                <Lightbulb className="size-4" aria-hidden /> {question.tip.title}
              </p>
              <p className="mt-2 text-[0.9375rem] text-fg">{question.tip.text}</p>
            </motion.div>
          ) : (
            <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden text-sm text-faint lg:block">
              {tu ? 'Un conseil apparaîtra ici après ta réponse.' : 'Un éclairage apparaîtra ici après votre réponse.'}
            </motion.p>
          )}
        </AnimatePresence>
      </aside>
    </div>
  )
}

/* ---------- Résumé ------------------------------------------------------- */
function Summary({ onEdit, onRestart }: { onEdit: (s: number) => void; onRestart: () => void }) {
  const { config, ps, dispatch } = useApp()
  const { questions, outcome, disclaimer } = config.checkup
  const tu = config.address === 'tu'
  const result = outcome(ps.checkup.answers, ps.context)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus({ preventScroll: true }), [])

  const levels = {
    support: { icon: HeartHandshake, cls: 'bg-accent-soft ring-accent-line', iconCls: 'bg-accent text-accent-fg', tag: tu ? 'On est là' : 'Soutien' },
    attention: { icon: Eye, cls: 'bg-warning-soft ring-warning/40', iconCls: 'bg-warning text-[#172a46]', tag: 'À prendre au sérieux' },
    calm: { icon: CircleCheck, cls: 'bg-success-soft ring-success/30', iconCls: 'bg-success text-white', tag: 'Peu de signaux' },
  }[result.level]
  const Icon = levels.icon

  const toMissions = () => {
    dispatch({ type: 'track', track: ps.context === 'witness' ? 'witness' : 'target' })
    navigate('missions')
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
      <div className="min-w-0">
        <h1 ref={heading} tabIndex={-1} className="font-display text-title text-fg outline-none">
          {tu ? 'Merci d’avoir pris ce temps.' : 'Merci pour ces réponses.'}
        </h1>

        {/* Orientation — jamais un diagnostic, jamais d’alarme visuelle */}
        <section className={cn('mt-6 rounded-[1.375rem] p-5 ring-1 md:p-6', levels.cls)} aria-labelledby="outcome">
          <div className="flex items-start gap-4">
            <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', levels.iconCls)}>
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{levels.tag}</p>
              <h2 id="outcome" className="mt-1 font-display text-[1.375rem] leading-tight text-fg">
                {result.title}
              </h2>
              <p className="mt-2 text-[0.9375rem] text-fg/85">{result.text}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button onClick={toMissions} iconRight={<ArrowRight className="size-4" aria-hidden />}>
              {tu ? 'Voir mes missions' : 'Voir les réflexes'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('message')}>
              {tu ? 'Préparer un message' : 'Préparer un message'}
            </Button>
          </div>
        </section>

        {result.level === 'support' && (
          <div className="mt-4">
            <HelpLineCard line={config.helpLines[0]} emphasis />
          </div>
        )}

        <p className="mt-5 flex items-start gap-2 text-[0.8125rem] text-muted">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {disclaimer} {config.checkup.privacy}
        </p>
      </div>

      <aside aria-labelledby="answers-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="answers-title" className="eyebrow">
            {tu ? 'Tes réponses' : 'Vos réponses'}
          </h2>
          <Button variant="ghost" size="sm" className="-mr-3" icon={<RotateCcw className="size-4" aria-hidden />} onClick={onRestart}>
            Effacer
          </Button>
        </div>
        <ol className="divide-y divide-line rounded-[1.375rem] border border-line bg-surface">
          {questions.map((q, i) => {
            const labels = (ps.checkup.answers[q.id] ?? []).map((id) => q.options.find((o) => o.id === id)?.label).filter(Boolean)
            return (
              <li key={q.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8125rem] text-muted">{(ps.context && q.titleByContext?.[ps.context]) || q.title}</p>
                  <p className="mt-0.5 text-[0.9375rem] font-semibold text-fg">{labels.length ? labels.join(', ') : '—'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(i)}
                  className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg"
                  aria-label={`Modifier la réponse ${i + 1}`}
                >
                  <PencilLine className="size-4" aria-hidden />
                </button>
              </li>
            )
          })}
        </ol>
      </aside>
    </div>
  )
}
