import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Ear, Eye, Hand, Flower, Heart, Pause, Play, RotateCcw, Check, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../../state/AppState'
import { cn } from '../../lib/utils'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SegmentedControl } from '../ui/SegmentedControl'
import { HelpLineCard } from '../ui/shared'

type Mode = 'breathe' | 'ground'

export default function BreatheSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const [mode, setMode] = useState<Mode>('breathe')

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={tu ? 'Souffler' : 'Faire une pause'}
      title={tu ? 'Prends un moment pour toi' : 'Prenez un moment pour vous'}
      size="md"
    >
      <div className="space-y-5 pt-2 pb-2">
        <SegmentedControl<Mode>
          label="Exercice"
          value={mode}
          onChange={setMode}
          block
          options={[
            { value: 'breathe', label: 'Respirer' },
            { value: 'ground', label: 'Ancrage 5-4-3-2-1' },
          ]}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {mode === 'breathe' ? <Breathing onClose={onClose} onSwitch={() => setMode('ground')} /> : <Grounding onClose={onClose} />}
          </motion.div>
        </AnimatePresence>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <Lock className="size-3" aria-hidden /> Rien n’est enregistré.
        </p>
      </div>
    </Modal>
  )
}

/* ---------- Respiration guidée ------------------------------------------- */
/* Expirer plus longtemps qu’on inspire aide le corps à se calmer : 4 s / 6 s, soit 6 respirations par minute. */

const INHALE = 4000
const EXHALE = 6000
const CYCLE = INHALE + EXHALE

type Status = 'setup' | 'running' | 'paused' | 'done'

function Breathing({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const [minutes, setMinutes] = useState<'1' | '2' | '3'>('1')
  const [status, setStatus] = useState<Status>('setup')
  const [elapsed, setElapsedState] = useState(0)
  // Copie lue au démarrage / à la reprise, sans relancer l’intervalle à chaque tick.
  const elapsedRef = useRef(0)
  const setElapsed = (v: number) => {
    elapsedRef.current = v
    setElapsedState(v)
  }
  const total = Number(minutes) * 60_000

  useEffect(() => {
    if (status !== 'running') return
    const origin = performance.now() - elapsedRef.current
    const id = window.setInterval(() => {
      const e = performance.now() - origin
      elapsedRef.current = Math.min(e, total)
      setElapsedState(elapsedRef.current)
      if (e >= total) setStatus('done')
    }, 100)
    return () => window.clearInterval(id)
  }, [status, total])

  const t = elapsed % CYCLE
  const inhale = t < INHALE
  const left = Math.ceil((inhale ? INHALE - t : CYCLE - t) / 1000)
  const breaths = Math.floor(elapsed / CYCLE)

  if (status === 'done') {
    return (
      <FeelingCheck
        title={tu ? `Bravo, ${breaths} respirations.` : `${breaths} respirations, bravo.`}
        onClose={onClose}
        alternative={{ label: 'Essayer l’ancrage', onClick: onSwitch }}
        onRestart={() => {
          setElapsed(0)
          setStatus('setup')
        }}
      />
    )
  }

  const active = status === 'running'
  const phase = status === 'setup' ? 'Prêt·e ?' : inhale ? 'Inspire' : 'Expire'
  const phaseVous = status === 'setup' ? 'Prêt·e ?' : inhale ? 'Inspirez' : 'Expirez'

  return (
    <div className="flex flex-col items-center">
      <p className="max-w-sm text-center text-[0.9375rem] text-muted">
        {tu
          ? 'Suis le cercle : il grandit quand tu inspires par le nez, il rétrécit quand tu souffles doucement par la bouche.'
          : 'Suivez le cercle : il grandit à l’inspiration par le nez, il rétrécit quand vous soufflez doucement par la bouche.'}
      </p>

      <div className="relative my-6 grid size-56 place-items-center xs:size-64">
        <span className="absolute inset-0 rounded-full border border-dashed border-accent-line" aria-hidden />
        <motion.span
          className="absolute inset-3 rounded-full bg-accent-soft"
          aria-hidden
          initial={false}
          animate={{ scale: active ? (inhale ? 1 : 0.55) : 0.7, opacity: active ? 1 : 0.7 }}
          transition={{ duration: active ? (inhale ? INHALE - t : CYCLE - t) / 1000 : 0.6, ease: [0.45, 0, 0.55, 1] }}
        />
        <motion.span
          className="absolute inset-[30%] rounded-full bg-accent/25"
          aria-hidden
          initial={false}
          animate={{ scale: active ? (inhale ? 1.15 : 0.8) : 1 }}
          transition={{ duration: active ? (inhale ? INHALE - t : CYCLE - t) / 1000 : 0.6, ease: [0.45, 0, 0.55, 1] }}
        />
        {/* Le texte suffit à suivre l’exercice, même sans animation */}
        <div className="relative text-center">
          <p aria-live="polite" className="font-display text-[1.75rem] leading-none text-fg">
            {tu ? phase : phaseVous}
          </p>
          <p className="mt-1 h-6 text-lg font-semibold text-accent-text tabular-nums" aria-hidden>
            {status === 'setup' ? '' : left}
          </p>
        </div>
      </div>

      {status === 'setup' ? (
        <div className="w-full space-y-4">
          <SegmentedControl<'1' | '2' | '3'>
            label="Durée"
            value={minutes}
            onChange={setMinutes}
            block
            size="sm"
            options={[
              { value: '1', label: '1 min' },
              { value: '2', label: '2 min' },
              { value: '3', label: '3 min' },
            ]}
          />
          <Button block size="lg" icon={<Play className="size-4" aria-hidden />} onClick={() => setStatus('running')} data-autofocus>
            Commencer
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-label="Avancement" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((elapsed / total) * 100)}>
            <div className="h-full rounded-full bg-accent" style={{ width: `${(elapsed / total) * 100}%` }} />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" block onClick={() => setStatus('done')}>
              Terminer
            </Button>
            {active ? (
              <Button variant="secondary" block icon={<Pause className="size-4" aria-hidden />} onClick={() => setStatus('paused')}>
                Pause
              </Button>
            ) : (
              <Button block icon={<Play className="size-4" aria-hidden />} onClick={() => setStatus('running')}>
                Reprendre
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Ancrage 5-4-3-2-1 ------------------------------------------- */
/* On ne tape rien : on compte sur ses doigts, l’appli ne fait que guider. */

interface Sense {
  n: number
  icon: LucideIcon
  tu: string
  vous: string
}

const senses: Sense[] = [
  { n: 5, icon: Eye, tu: 'choses que tu vois autour de toi', vous: 'choses que vous voyez autour de vous' },
  { n: 4, icon: Hand, tu: 'choses que tu peux toucher', vous: 'choses que vous pouvez toucher' },
  { n: 3, icon: Ear, tu: 'sons que tu entends', vous: 'sons que vous entendez' },
  { n: 2, icon: Flower, tu: 'odeurs que tu sens', vous: 'odeurs que vous sentez' },
  { n: 1, icon: Heart, tu: 'goût dans ta bouche, ou une pensée qui te fait du bien', vous: 'goût, ou une pensée qui vous fait du bien' },
]

function Grounding({ onClose }: { onClose: () => void }) {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const [index, setIndex] = useState(0)
  const [found, setFound] = useState(0)

  useEffect(() => {
    if (index >= senses.length || found < senses[index].n) return
    const id = window.setTimeout(() => {
      setIndex((i) => i + 1)
      setFound(0)
    }, 700)
    return () => window.clearTimeout(id)
  }, [found, index])

  if (index >= senses.length) {
    return (
      <FeelingCheck
        title={tu ? 'Ton attention est revenue ici, maintenant.' : 'Votre attention est revenue ici, maintenant.'}
        onClose={onClose}
        onRestart={() => {
          setIndex(0)
          setFound(0)
        }}
      />
    )
  }

  const sense = senses[index]
  const Icon = sense.icon
  const complete = found >= sense.n

  return (
    <div className="flex flex-col items-center text-center">
      <p className="max-w-sm text-[0.9375rem] text-muted">
        {tu
          ? 'Quand tout se bouscule dans ta tête, revenir à tes sens aide à te poser. Prends ton temps.'
          : 'Quand les pensées s’emballent, revenir à ses sens aide à se poser. Prenez votre temps.'}
      </p>

      <ol className="mt-5 flex gap-1.5" aria-label="Étapes">
        {senses.map((s, i) => (
          <li
            key={s.n}
            className={cn('h-1.5 w-8 rounded-full transition-colors', i < index ? 'bg-accent' : i === index ? 'bg-accent/50' : 'bg-line')}
            aria-current={i === index ? 'step' : undefined}
          >
            <span className="sr-only">
              Étape {i + 1} sur {senses.length}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-6 flex flex-col items-center"
        >
          <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent-text">
            <Icon className="size-7" aria-hidden />
          </span>
          <h3 className="mt-4 font-display text-[1.5rem] leading-tight text-fg" aria-live="polite">
            <span className="tabular-nums">{sense.n}</span> {tu ? sense.tu : sense.vous}
          </h3>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex gap-2" aria-hidden>
        {Array.from({ length: sense.n }, (_, i) => (
          <motion.span
            key={`${index}-${i}`}
            initial={false}
            animate={{ scale: i < found ? 1 : 0.8 }}
            className={cn('size-4 rounded-full border-2 transition-colors', i < found ? 'border-accent bg-accent' : 'border-line-strong')}
          />
        ))}
      </div>

      <Button
        size="lg"
        block
        className="mt-6"
        disabled={complete}
        icon={complete ? <Check className="size-4" aria-hidden /> : undefined}
        onClick={() => setFound((f) => Math.min(f + 1, sense.n))}
        data-autofocus
      >
        {complete ? 'C’est noté' : tu ? `J’en ai trouvé une (${found}/${sense.n})` : `Trouvé (${found}/${sense.n})`}
      </Button>
    </div>
  )
}

/* ---------- Après l’exercice : une question, rien n’est gardé ----------- */

function FeelingCheck({
  title,
  onClose,
  onRestart,
  alternative,
}: {
  title: string
  onClose: () => void
  onRestart: () => void
  alternative?: { label: string; onClick: () => void }
}) {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const [answer, setAnswer] = useState<'better' | 'not-yet' | null>(null)

  return (
    <div className="text-center">
      <p className="font-display text-[1.375rem] leading-tight text-fg">{title}</p>

      {answer === null && (
        <>
          <p className="mt-2 text-[0.9375rem] text-muted">{tu ? 'Comment tu te sens, là, maintenant ?' : 'Comment vous sentez-vous, là, maintenant ?'}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={() => setAnswer('better')} data-autofocus>
              Un peu mieux
            </Button>
            <Button variant="secondary" onClick={() => setAnswer('not-yet')}>
              {tu ? 'Toujours pas bien' : 'Pas vraiment mieux'}
            </Button>
          </div>
        </>
      )}

      <div aria-live="polite">
        {answer === 'better' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-5">
            <p className="text-[0.9375rem] text-muted">
              {tu
                ? 'Tant mieux. Tu peux revenir ici dès que tu en as besoin, aussi souvent que tu veux.'
                : 'Tant mieux. Revenez ici dès que vous en ressentez le besoin.'}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="ghost" icon={<RotateCcw className="size-4" aria-hidden />} onClick={onRestart}>
                Recommencer
              </Button>
              <Button onClick={onClose}>Fermer</Button>
            </div>
          </motion.div>
        )}

        {answer === 'not-yet' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4 text-left">
            <p className="text-center text-[0.9375rem] text-muted">
              {tu
                ? 'C’est ok de ne pas aller bien. Parler à quelqu’un peut vraiment aider, et tu peux le faire de façon anonyme.'
                : 'C’est normal. Être écouté·e peut aider : ces lignes conseillent aussi les parents, gratuitement.'}
            </p>
            <div className="space-y-2">
              {config.helpLines.slice(0, 2).map((l, i) => (
                <HelpLineCard key={l.id} line={l} emphasis={i === 0} />
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              {alternative && (
                <Button variant="secondary" onClick={alternative.onClick}>
                  {alternative.label}
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
