import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

export interface Segment<T extends string> {
  value: T
  label: string
  icon?: ReactNode
  /** Pastille de couleur (ex. ProfileSwitcher) */
  dot?: string
}

interface Props<T extends string> {
  label: string
  value: T
  options: Segment<T>[]
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  block?: boolean
  className?: string
  hideLabelsBelow?: boolean
}

/** Groupe radio accessible (flèches clavier) avec indicateur qui glisse. */
export function SegmentedControl<T extends string>({ label, value, options, onChange, size = 'md', block, className }: Props<T>) {
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (i + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('relative inline-flex rounded-full bg-sunken p-1 ring-1 ring-line ring-inset', block && 'flex w-full', className)}
    >
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'relative z-0 inline-flex flex-1 items-center justify-center gap-1.5 rounded-full font-semibold transition-colors duration-200',
              size === 'sm' ? 'h-9 min-w-9 px-2.5 text-[0.8125rem] whitespace-nowrap xs:px-3' : 'min-h-11 px-4 py-1.5 text-sm leading-tight text-center sm:whitespace-nowrap',
              active ? 'text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-full bg-surface shadow-card ring-1 ring-line dark:bg-elevated"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
            {o.dot && <span aria-hidden className="size-2 rounded-full" style={{ background: o.dot }} />}
            {o.icon}
            <span>{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
