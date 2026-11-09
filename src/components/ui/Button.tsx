import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'ink' | 'danger' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-soft ' +
  'active:scale-[0.98] disabled:cursor-not-allowed aria-disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg shadow-xs hover:bg-accent-hover disabled:bg-sunken disabled:text-faint disabled:shadow-none aria-disabled:bg-sunken aria-disabled:text-faint',
  secondary:
    'bg-surface text-fg border border-line-strong hover:border-accent hover:text-accent-text disabled:text-faint disabled:border-line',
  ghost: 'text-muted hover:text-fg hover:bg-sunken disabled:text-faint',
  ink: 'bg-ink text-ink-fg hover:brightness-110 dark:bg-elevated dark:border dark:border-line-strong',
  danger: 'bg-danger text-danger-fg hover:brightness-95',
  soft: 'bg-accent-soft text-accent-text hover:bg-accent-line/50',
}

const sizes: Record<Size, string> = {
  sm: 'h-11 px-4 text-sm', // 44px : cible tactile minimale
  md: 'h-12 px-5 text-[0.9375rem]',
  lg: 'h-14 px-6 text-base',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  block?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, iconRight, block, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, cn(block && 'w-full', className))}
      {...rest}
    >
      {loading ? <LoaderCircle className="size-[1.15em] animate-spin" aria-hidden /> : icon}
      <span className={cn(loading && 'opacity-80')}>{children}</span>
      {iconRight}
    </button>
  )
})

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  block?: boolean
}

export function LinkButton({ variant = 'primary', size = 'md', icon, block, className, children, ...rest }: LinkButtonProps) {
  return (
    <a className={buttonClass(variant, size, cn(block && 'w-full', className))} {...rest}>
      {icon}
      <span>{children}</span>
    </a>
  )
}
