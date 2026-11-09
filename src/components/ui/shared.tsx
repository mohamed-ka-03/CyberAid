import type { ReactNode } from 'react'
import { Check, Phone, Monitor, Sun, Moon, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { HelpLine } from '../../data/types'
import { cn } from '../../lib/utils'
import { useApp, type ThemePref } from '../../state/AppState'
import { SegmentedControl } from './SegmentedControl'

/* ---------- PageHeader --------------------------------------------------- */
export function PageHeader({ eyebrow, title, intro, aside, squiggle }: { eyebrow: string; title: string; intro?: string; aside?: ReactNode; squiggle?: boolean }) {
  return (
    <header className="mb-7 md:mb-9">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="eyebrow">{eyebrow}</p>
        {aside}
      </div>
      <h1 className="max-w-[18ch] text-balance font-display text-title text-fg">
        {title}
        {squiggle && <Squiggle />}
      </h1>
      {intro && <p className="mt-3 max-w-[var(--container-prose)] text-[1.0625rem] text-pretty text-muted">{intro}</p>}
    </header>
  )
}

/** Trait expressif sous les titres (Jeune uniquement). */
export function Squiggle({ className }: { className?: string }) {
  const { config } = useApp()
  if (config.id !== 'young') return null
  return (
    <svg viewBox="0 0 120 12" className={cn('mt-1 block h-3 w-24 text-accent md:w-28', className)} aria-hidden fill="none">
      <motion.path
        d="M2 8c12-6 22-6 30 0s18 6 28 0 20-6 30 0 18 5 28-1"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </svg>
  )
}

/* ---------- ContactCard (destinataire sélectionnable) -------------------- */
export function ContactCard({ icon: Icon, label, description, selected, onSelect }: { icon: LucideIcon; label: string; description: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'group relative flex min-h-[6.5rem] flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-[border-color,background-color,box-shadow] duration-200',
        selected ? 'border-accent bg-accent-soft shadow-[0_0_0_1px_var(--accent)]' : 'border-line bg-surface hover:border-line-strong hover:bg-sunken/40',
      )}
    >
      <span className={cn('grid size-9 place-items-center rounded-xl transition-colors', selected ? 'bg-accent text-accent-fg' : 'bg-sunken text-muted group-hover:text-fg')}>
        <Icon className="size-[1.1rem]" aria-hidden />
      </span>
      <span>
        <span className="block text-[0.9375rem] leading-tight font-semibold text-fg">{label}</span>
        <span className="block text-[0.8125rem] leading-snug text-muted">{description}</span>
      </span>
      <span
        className={cn(
          'absolute top-3 right-3 grid size-5 place-items-center rounded-full border transition-all',
          selected ? 'border-accent bg-accent text-accent-fg' : 'border-line-strong',
        )}
        aria-hidden
      >
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  )
}

/* ---------- HelpLineCard ------------------------------------------------- */
export function HelpLineCard({ line, emphasis }: { line: HelpLine; emphasis?: boolean }) {
  return (
    <a
      href={line.tel}
      className={cn(
        'group flex items-center gap-3 rounded-2xl border p-3.5 transition-colors xs:gap-4 xs:p-4',
        emphasis ? 'border-accent-line bg-accent-soft hover:border-accent' : 'border-line bg-surface hover:border-line-strong',
      )}
    >
      <span
        className={cn(
          'grid h-12 min-w-14 place-items-center rounded-xl px-2 font-display text-lg tabular-nums',
          line.urgent ? 'bg-danger-soft text-danger-text' : emphasis ? 'bg-accent text-accent-fg' : 'bg-sunken text-fg',
        )}
      >
        {line.number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-fg">{line.label}</span>
        <span className="block text-[0.8125rem] leading-snug text-muted">{line.description}</span>
        <span className="mt-1 block text-xs font-medium text-faint">{line.hours}</span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:text-accent-text">
        <Phone className="size-4" aria-hidden />
        <span className="sr-only">Appeler le {line.number}</span>
      </span>
    </a>
  )
}

/** Bandeau d’aide compact (accueil mobile). */
export function HelpStrip({ line, label }: { line: HelpLine; label: string }) {
  return (
    <a
      href={line.tel}
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-4 transition-colors hover:border-accent-line"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-text">
        <Phone className="size-[1.1rem]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-sm">
        <span className="block font-semibold text-fg">{label}</span>
        <span className="block text-[0.8125rem] text-muted">Gratuit · anonyme · {line.hours.split('·')[1]?.trim()}</span>
      </span>
      <ArrowUpRight className="size-4 text-muted" aria-hidden />
    </a>
  )
}

/* ---------- ThemeSelector ------------------------------------------------ */
export function ThemeSelector() {
  const { state, dispatch } = useApp()
  return (
    <SegmentedControl<ThemePref>
      label="Apparence"
      value={state.themePref}
      onChange={(pref) => dispatch({ type: 'theme', pref })}
      block
      options={[
        { value: 'system', label: 'Auto', icon: <Monitor className="size-4" aria-hidden /> },
        { value: 'light', label: 'Clair', icon: <Sun className="size-4" aria-hidden /> },
        { value: 'dark', label: 'Sombre', icon: <Moon className="size-4" aria-hidden /> },
      ]}
    />
  )
}
