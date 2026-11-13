import { Check, ChevronRight, TriangleAlert, CircleCheck, RotateCcw, BookOpen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { Mission } from '../../data/types'
import type { MissionProgress } from '../../state/AppState'
import { cn } from '../../lib/utils'
import { Tag } from '../ui/misc'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

const EMPTY: MissionProgress = { status: 'todo', steps: [] }

export function statusLabel(p: MissionProgress, total: number) {
  if (p.status === 'done') return { text: 'Fait', tone: 'success' as const }
  if (p.status === 'active') return { text: `En cours · ${p.steps.filter(Boolean).length}/${total}`, tone: 'accent' as const }
  return { text: 'À faire', tone: 'neutral' as const }
}

/* Nœud du chemin : numéro → anneau partiel → coche. Forme + texte, pas seulement couleur. */
export function MissionNode({ index, progress, total, size = 'md' }: { index: number; progress: MissionProgress; total: number; size?: 'md' | 'lg' }) {
  const ratio = progress.steps.filter(Boolean).length / total
  const dim = size === 'lg' ? 44 : 36
  const r = dim / 2 - 2.5
  const c = 2 * Math.PI * r
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: dim, height: dim }} aria-hidden>
      <svg width={dim} height={dim} className="absolute inset-0 -rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
        {progress.status === 'active' && (
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={false}
            animate={{ strokeDashoffset: c * (1 - ratio) }}
            transition={{ duration: 0.4 }}
          />
        )}
      </svg>
      <AnimatePresence mode="wait" initial={false}>
        {progress.status === 'done' ? (
          <motion.span
            key="done"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 grid place-items-center rounded-full bg-success text-white"
          >
            <Check className="size-[45%]" strokeWidth={3} />
          </motion.span>
        ) : (
          <motion.span key="n" className="relative text-[0.8125rem] font-bold text-fg tabular-nums">
            {index + 1}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

/* ---------- MissionItem : ligne sur le chemin (mobile/tablette) ---------- */
export function MissionItem({ mission, index, progress = EMPTY, last, onOpen }: { mission: Mission; index: number; progress?: MissionProgress; last?: boolean; onOpen: () => void }) {
  const status = statusLabel(progress, mission.steps.length)
  return (
    <li className="relative flex gap-3.5">
      {/* le lien entre les missions */}
      {!last && (
        <span
          className={cn('absolute top-11 bottom-[-0.5rem] left-[17px] w-0.5 rounded-full', progress.status === 'done' ? 'bg-success/60' : 'bg-line')}
          aria-hidden
        />
      )}
      <div className="pt-3">
        <MissionNode index={index} progress={progress} total={mission.steps.length} />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          'group mb-2.5 flex min-h-[4.5rem] flex-1 items-center gap-3 rounded-2xl border p-3.5 pr-3 text-left transition-[border-color,background-color,transform] duration-200',
          progress.status === 'active' ? 'border-accent-line bg-surface' : 'border-line bg-surface hover:border-line-strong',
          'hover:-translate-y-px',
        )}
      >
        <span className="min-w-0 flex-1">
          <span className={cn('block leading-snug font-semibold', progress.status === 'done' ? 'text-muted' : 'text-fg')}>{mission.title}</span>
          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">{mission.summary}</span>
          <span className="mt-2 block">
            <Tag tone={status.tone}>{status.text}</Tag>
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
        <span className="sr-only">Ouvrir la mission</span>
      </button>
    </li>
  )
}

/* ---------- MissionCard : carte en grille (desktop) ---------------------- */
export function MissionCard({ mission, index, progress = EMPTY, onOpen }: { mission: Mission; index: number; progress?: MissionProgress; onOpen: () => void }) {
  const status = statusLabel(progress, mission.steps.length)
  const done = progress.steps.filter(Boolean).length
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          'group flex h-full w-full flex-col rounded-[1.375rem] border bg-surface p-5 text-left shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-raised',
          progress.status === 'active' ? 'border-accent-line' : 'border-line hover:border-line-strong',
        )}
      >
        <span className="flex items-center justify-between">
          <MissionNode index={index} progress={progress} total={mission.steps.length} size="lg" />
          <Tag tone={status.tone}>{status.text}</Tag>
        </span>
        <span className={cn('mt-5 block font-display text-[1.25rem] leading-tight', progress.status === 'done' ? 'text-muted' : 'text-fg')}>
          {mission.title}
        </span>
        <span className="mt-1.5 block flex-1 text-sm text-muted">{mission.summary}</span>
        <span className="mt-5 flex items-center gap-1.5" aria-hidden>
          {mission.steps.map((_, i) => (
            <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i < done ? 'bg-accent' : 'bg-line')} />
          ))}
        </span>
        <span className="mt-3 flex items-center justify-between text-[0.8125rem] font-semibold text-muted group-hover:text-fg">
          {progress.status === 'done' ? 'Revoir' : progress.status === 'active' ? 'Continuer' : 'Commencer'}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </button>
    </li>
  )
}

/* ---------- MissionSheet : détail + actions ------------------------------ */
interface SheetProps {
  open: boolean
  onClose: () => void
  mission: Mission | null
  index: number
  total: number
  progress?: MissionProgress
  address: 'tu' | 'vous'
  onToggleStep: (i: number) => void
  onSetStatus: (s: MissionProgress['status']) => void
  onNext?: () => void
  /** Ouvre les guides par plateforme (missions « bloquer / signaler »). */
  onGuide?: () => void
}

export function MissionSheet({ open, onClose, mission, index, total, progress = EMPTY, address, onToggleStep, onSetStatus, onNext, onGuide }: SheetProps) {
  if (!mission) return null
  const tu = address === 'tu'
  const done = progress.status === 'done'
  const allChecked = mission.steps.every((_, i) => progress.steps[i])
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={`Mission ${index + 1} sur ${total}`}
      title={mission.title}
      description={mission.summary}
      footer={
        done ? (
          <>
            <Button variant="ghost" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => onSetStatus('active')}>
              Annuler « fait »
            </Button>
            {onNext ? (
              <Button onClick={onNext} iconRight={<ChevronRight className="size-4" aria-hidden />}>
                Mission suivante
              </Button>
            ) : (
              <Button onClick={onClose}>Fermer</Button>
            )}
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              Pas maintenant
            </Button>
            <Button onClick={() => onSetStatus('done')} icon={<Check className="size-4" aria-hidden />} data-autofocus>
              {tu ? 'C’est fait' : 'Étape réalisée'}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-5 pt-2">
        <div>
          <h3 className="eyebrow mb-2">Pourquoi c’est important</h3>
          <p className="text-[0.9375rem] text-fg">{mission.why}</p>
        </div>

        <fieldset>
          <legend className="eyebrow mb-2.5">{tu ? 'Ce que tu peux faire' : 'Concrètement'}</legend>
          <ul className="space-y-2">
            {mission.steps.map((s, i) => {
              const checked = !!progress.steps[i]
              return (
                <li key={s}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => onToggleStep(i)}
                    className={cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[0.9375rem] transition-colors',
                      checked ? 'border-accent-line bg-accent-soft/60' : 'border-line hover:border-line-strong',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors',
                        checked ? 'border-accent bg-accent text-accent-fg' : 'border-line-strong',
                      )}
                      aria-hidden
                    >
                      {checked && <Check className="size-3.5" strokeWidth={3.2} />}
                    </span>
                    <span className={cn('flex-1', checked ? 'text-muted line-through decoration-1' : 'text-fg')}>{s}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-xs text-muted">
            {tu ? 'Coche ce qui t’aide à suivre. Tu peux tout décocher à tout moment.' : 'Cochez pour garder le fil. Tout est réversible.'}
          </p>
        </fieldset>

        {mission.guide && onGuide && (
          <button
            type="button"
            onClick={onGuide}
            className="group flex w-full items-center gap-3 rounded-xl border border-accent-line bg-accent-soft/50 p-3.5 text-left transition-colors hover:border-accent"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg">
              <BookOpen className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-semibold text-fg">{tu ? 'Où appuyer dans ton appli ?' : 'Où trouver ces options ?'}</span>
              <span className="block text-[0.8125rem] text-muted">Instagram, Snapchat, TikTok, Discord, WhatsApp, Roblox</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        )}

        {mission.caution && (
          <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-3.5">
            <TriangleAlert className="mt-0.5 size-[1.1rem] shrink-0 text-warning-text" aria-hidden />
            <p className="text-[0.875rem] text-fg">
              <strong className="font-semibold">Attention : </strong>
              {mission.caution}
            </p>
          </div>
        )}

        <div aria-live="polite">
          <AnimatePresence initial={false}>
            {done ? (
              <motion.div
                key="fb"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 rounded-xl bg-success-soft p-4">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-success-text" aria-hidden />
                  <div>
                    <p className="font-semibold text-fg">Mission faite</p>
                    <p className="text-[0.9375rem] text-fg/80">{mission.feedback}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              allChecked && (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium text-accent-text">
                  {tu ? 'Tout est coché : tu peux marquer la mission comme faite.' : 'Tout est coché : vous pouvez valider cette étape.'}
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  )
}
