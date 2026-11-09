import { forwardRef, type KeyboardEvent } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

interface Props {
  letter: string
  label: string
  hint?: string
  selected: boolean
  multi?: boolean
  onSelect: () => void
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
}

/**
 * Option de questionnaire : lettre repère, libellé, indicateur de forme
 * (rond = choix unique, carré = choix multiple). L'état sélectionné est
 * signalé par la couleur ET par l'icône ✓ ET par aria-checked.
 */
export const QuestionOption = forwardRef<HTMLButtonElement, Props>(function QuestionOption(
  { letter, label, hint, selected, multi, onSelect, onKeyDown },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'group flex min-h-16 w-full items-center gap-3.5 rounded-2xl border px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow] duration-200',
        selected
          ? 'border-accent bg-accent-soft shadow-[0_0_0_1px_var(--accent)]'
          : 'border-line bg-surface hover:border-line-strong hover:bg-sunken/40',
      )}
    >
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-[0.6rem] text-[0.8125rem] font-bold transition-colors',
          selected ? 'bg-accent text-accent-fg' : 'bg-sunken text-muted group-hover:text-fg',
        )}
        aria-hidden
      >
        {letter}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1rem] leading-snug font-semibold text-fg">{label}</span>
        {hint && selected && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">{hint}</span>}
      </span>
      <span
        className={cn(
          'grid size-6 shrink-0 place-items-center border-2 transition-colors',
          multi ? 'rounded-md' : 'rounded-full',
          selected ? 'border-accent bg-accent text-accent-fg' : 'border-line-strong',
        )}
        aria-hidden
      >
        {selected && (
          <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }}>
            <Check className="size-3.5" strokeWidth={3.2} />
          </motion.span>
        )}
      </span>
    </motion.button>
  )
})
