import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

/* ---------- Card ---------------------------------------------------------- */
export function Card({ className, children, as: Tag = 'section' }: { className?: string; children: ReactNode; as?: 'section' | 'div' | 'article' | 'aside' }) {
  return <Tag className={cn('rounded-[1.375rem] border border-line bg-surface shadow-card', className)}>{children}</Tag>
}

/* ---------- Section heading ---------------------------------------------- */
export function SectionTitle({ children, action, id }: { children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 id={id} className="eyebrow">
        {children}
      </h2>
      {action}
    </div>
  )
}

/* ---------- Badge (médaille discrète) ------------------------------------ */
export function Badge({ icon: Icon, label, description, earned }: { icon: LucideIcon; label: string; description: string; earned: boolean }) {
  return (
    <li
      className={cn(
        'flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors',
        earned ? 'border-accent-line bg-accent-soft/60' : 'border-dashed border-line-strong bg-transparent',
      )}
    >
      <span
        className={cn(
          'relative grid size-12 place-items-center rounded-full',
          earned ? 'bg-accent text-accent-fg' : 'bg-sunken text-faint',
        )}
      >
        {earned ? <Icon className="size-5" aria-hidden /> : <Lock className="size-4" aria-hidden />}
        {earned && <span className="absolute -inset-1 rounded-full border border-accent-line" aria-hidden />}
      </span>
      <span className="text-[0.8125rem] leading-tight font-semibold text-fg">{label}</span>
      <span className="text-xs leading-snug text-muted">{description}</span>
      <span className={cn('text-[0.6875rem] font-semibold tracking-wide uppercase', earned ? 'text-accent-text' : 'text-faint')}>
        {earned ? 'Obtenu' : 'À venir'}
      </span>
    </li>
  )
}

/* ---------- EmptyState --------------------------------------------------- */
export function EmptyState({ title, text, action, art }: { title: string; text: string; action?: ReactNode; art?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[1.375rem] border border-dashed border-line-strong px-6 py-10 text-center">
      <div className="mb-4 text-accent" aria-hidden>
        {art ?? (
          <svg width="72" height="44" viewBox="0 0 72 44" fill="none">
            <circle cx="36" cy="38" r="4" fill="currentColor" />
            <path d="M24 34a12 12 0 0 1 24 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".55" />
            <path d="M14 34a22 22 0 0 1 44 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".25" strokeDasharray="2 7" />
          </svg>
        )}
      </div>
      <p className="font-display text-lg text-fg">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ---------- Switch ------------------------------------------------------- */
export function Switch({ checked, onChange, label, description, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; id: string }) {
  return (
    <div className="flex min-h-14 items-center gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block cursor-pointer text-[0.9375rem] font-medium text-fg">
          {label}
        </label>
        {description && (
          <p id={`${id}-desc`} className="text-[0.8125rem] leading-snug text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full p-1 transition-colors duration-200',
          checked ? 'bg-accent' : 'bg-line-strong',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 36 }}
          className={cn('grid size-6 place-items-center rounded-full bg-white shadow-sm', checked ? 'ml-auto' : 'ml-0')}
        >
          {/* indicateur non-coloré de l’état */}
          <span className={cn('block rounded-full transition-all', checked ? 'h-2.5 w-0.5 bg-[#172a46]' : 'size-2 border-[1.5px] border-[#8792a5]')} aria-hidden />
        </motion.span>
      </button>
    </div>
  )
}

/* ---------- Skeleton (chargement des écrans) ----------------------------- */
export function ScreenSkeleton() {
  return (
    <div className="space-y-6 pt-2" aria-busy="true" aria-label="Chargement">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-10 w-3/4 max-w-md" />
      <div className="skeleton h-4 w-2/3 max-w-sm" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
    </div>
  )
}

/* ---------- Tag ---------------------------------------------------------- */
export function Tag({ children, tone = 'neutral', icon }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'success' | 'warning'; icon?: ReactNode }) {
  const tones = {
    neutral: 'bg-sunken text-muted',
    accent: 'bg-accent-soft text-accent-text',
    success: 'bg-success-soft text-success-text',
    warning: 'bg-warning-soft text-warning-text',
  }
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap', tones[tone])}>
      {icon}
      {children}
    </span>
  )
}
