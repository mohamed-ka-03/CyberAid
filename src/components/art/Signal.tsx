import { motion, useReducedMotion } from 'motion/react'
import type { ArtKind } from '../../data/types'
import { cn } from '../../lib/utils'

/* ---------- Logo ---------------------------------------------------------- */
export function Logo({ className, compact, wordmarkClass }: { className?: string; compact?: boolean; wordmarkClass?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="9" fill="var(--brand-ink)" />
        <circle cx="10" cy="22" r="3" fill="var(--accent)" />
        <path d="M10 13a9 9 0 0 1 9 9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M10 6.5A15.5 15.5 0 0 1 25.5 22" fill="none" stroke="var(--brand-blue)" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      {!compact && <span className={cn(wordmarkClass, "font-display text-[1.1875rem] leading-none text-fg [font-weight:760] tracking-[-0.03em]")}>CyberAid</span>}
    </span>
  )
}

/* ---------- SignalArcs : indicateur de progression signature -------------
   Chaque mission accomplie allume un arc : le signal « porte » plus loin.
   L'arc suivant pulse doucement (mission en cours), sans urgence.        */
interface ArcsProps {
  total: number
  done: number
  active?: number[]
  className?: string
  label?: string
}

export function SignalArcs({ total, done, active = [], className, label }: ArcsProps) {
  const reduce = useReducedMotion()
  const W = 200
  const cx = W / 2
  const cy = 104
  const r0 = 22
  const gap = (86 - r0) / Math.max(1, total - 1)
  return (
    <svg
      viewBox={`0 0 ${W} 112`}
      className={cn('block', className ?? 'w-full')}
      role="img"
      aria-label={label ?? `${done} sur ${total} réalisés`}
    >
      {Array.from({ length: total }, (_, i) => {
        const r = r0 + i * gap
        const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
        const lit = i < done
        const pulse = !lit && active.includes(i)
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="var(--border)" strokeWidth="9" strokeLinecap="round" />
            {pulse && (
              <motion.path
                d={d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray="2 14"
                initial={{ opacity: 0.35 }}
                animate={reduce ? { opacity: 0.6 } : { opacity: [0.35, 0.8, 0.35] }}
                transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {lit && (
              <motion.path
                d={d}
                fill="none"
                stroke={i === total - 1 ? 'var(--signal)' : 'var(--accent)'}
                strokeWidth="9"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: reduce ? 0 : i * 0.06 }}
              />
            )}
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r="7" fill="var(--text)" />
      <circle cx={cx} cy={cy} r="3" fill="var(--accent)" />
    </svg>
  )
}

/* ---------- ProgressIndicator linéaire segmenté -------------------------- */
export function StepProgress({ total, current, label }: { total: number; current: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(current, total)}
      aria-valuetext={`Étape ${Math.min(current, total)} sur ${total}`}
      className="flex gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-accent"
            initial={false}
            animate={{ width: i < current ? '100%' : '0%' }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </span>
      ))}
    </div>
  )
}

/* ---------- Micro-illustrations abstraites des entrées ------------------- */
export function EntryArt({ kind, className }: { kind: ArtKind; className?: string }) {
  return (
    <span className={cn('grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent', className)} aria-hidden>
      <svg viewBox="0 0 56 56" className="size-12" fill="none" strokeLinecap="round">
        {kind === 'target' && (
          <>
            {/* des signaux qui arrivent vers un point */}
            <circle cx="16" cy="40" r="6" fill="var(--text)" />
            <path d="M16 26a14 14 0 0 1 14 14" stroke="currentColor" strokeWidth="3.5" />
            <path d="M16 15a25 25 0 0 1 25 25" stroke="currentColor" strokeWidth="3.5" opacity=".6" />
            <path d="M16 5a35 35 0 0 1 35 35" stroke="currentColor" strokeWidth="2.5" opacity=".3" strokeDasharray="2 6" />
          </>
        )}
        {kind === 'witness' && (
          <>
            {/* le lien : deux points reliés */}
            <path d="M16 40 L40 16" stroke="var(--text)" strokeWidth="2.5" strokeDasharray="1 6" />
            <circle cx="15" cy="41" r="6" fill="currentColor" />
            <circle cx="41" cy="15" r="5" stroke="currentColor" strokeWidth="3" />
            <circle cx="41" cy="15" r="11" stroke="currentColor" strokeWidth="2" opacity=".35" />
          </>
        )}
        {kind === 'understand' && (
          <>
            {/* l’onde : un signal qui devient lisible */}
            <path d="M6 30c5-12 9-12 14 0s9 12 14 0 9-12 14 0" stroke="currentColor" strokeWidth="3" />
            <path d="M6 42h44" stroke="var(--text)" strokeWidth="2.5" opacity=".25" />
            <circle cx="48" cy="30" r="3.5" fill="var(--text)" />
          </>
        )}
      </svg>
    </span>
  )
}

/* ---------- Composition éditoriale de l’accueil -------------------------- */
export function HeroSignal({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const arcs = [40, 78, 116, 154, 192]
  return (
    <svg viewBox="0 0 240 240" className={cn('pointer-events-none', className)} aria-hidden fill="none">
      {arcs.map((r, i) => (
        <motion.path
          key={r}
          d={`M ${240 - r} 240 A ${r} ${r} 0 0 1 240 ${240 - r}`}
          stroke={i === 1 ? 'var(--signal)' : i === 3 ? 'var(--text)' : 'var(--accent)'}
          strokeOpacity={i === 3 ? 0.12 : i === 4 ? 0.35 : 1}
          strokeWidth={i === 4 ? 2 : 14}
          strokeDasharray={i === 4 ? '2 10' : undefined}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}
      <circle cx="240" cy="240" r="18" fill="var(--text)" />
    </svg>
  )
}
