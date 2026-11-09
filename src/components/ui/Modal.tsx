import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn, useMediaQuery } from '../../lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** alertdialog pour les confirmations */
  role?: 'dialog' | 'alertdialog'
}

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

/**
 * Feuille montante sur mobile (atteignable au pouce), boîte centrée sur desktop.
 * Piège de focus, Échap, retour du focus à l’élément d’origine, scroll bloqué.
 */
export function Modal({ open, onClose, title, eyebrow, description, children, footer, size = 'md', role = 'dialog' }: ModalProps) {
  const titleId = useId()
  const descId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const desktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current
      first?.focus()
    }, 30)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab' && panel.current) {
        const els = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open, onClose])

  const widths = { sm: 'md:max-w-md', md: 'md:max-w-lg', lg: 'md:max-w-2xl' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role={role}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={desktop ? { opacity: 0, y: 12, scale: 0.98 } : { y: '100%' }}
            animate={desktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
            exit={desktop ? { opacity: 0, y: 8, scale: 0.98 } : { y: '100%' }}
            transition={{ duration: desktop ? 0.2 : 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              'relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-elevated shadow-overlay outline-none',
              'rounded-t-[1.75rem] md:rounded-[1.75rem] md:border md:border-line',
              widths[size],
            )}
          >
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line-strong md:hidden" aria-hidden />
            <header className="flex items-start gap-4 px-5 pt-4 pb-2 md:px-7 md:pt-6">
              <div className="min-w-0 flex-1">
                {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
                <h2 id={titleId} className="font-display text-[1.5rem] leading-tight text-fg md:text-[1.75rem]">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="mt-2 text-[0.9375rem] text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg"
                aria-label="Fermer"
              >
                <X className="size-5" aria-hidden />
              </button>
            </header>
            {children && <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 md:px-7">{children}</div>}
            {footer && (
              <footer className="flex flex-col-reverse gap-2 border-t border-line px-5 pt-3 pb-[calc(0.75rem+var(--safe-bottom))] sm:flex-row sm:justify-end md:px-7 md:pb-5">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
