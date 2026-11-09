import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CircleCheck, Info, CircleAlert, X } from 'lucide-react'
import { cn } from '../../lib/utils'

type Tone = 'success' | 'info' | 'error'
interface ToastItem {
  id: number
  tone: Tone
  title: string
  text?: string
}

const ToastContext = createContext<(t: Omit<ToastItem, 'id'>) => void>(() => {})

export const useToast = () => useContext(ToastContext)

const icons = { success: CircleCheck, info: Info, error: CircleAlert }
const tones = {
  success: 'text-success-text',
  info: 'text-accent-text',
  error: 'text-danger-text',
}

/** Toasts discrets, annoncés aux lecteurs d’écran (polite), jamais bloquants. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const seq = useRef(0)

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), [])

  const push = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = ++seq.current
      setItems((l) => [...l.slice(-2), { ...t, id }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2 px-4 bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom)+0.75rem)] lg:bottom-6 lg:left-[var(--sidebar-w)]"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const Icon = icons[t.tone]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-elevated p-3.5 pr-2 shadow-raised"
              >
                <Icon className={cn('mt-0.5 size-5 shrink-0', tones[t.tone])} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg">{t.title}</p>
                  {t.text && <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">{t.text}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-sunken hover:text-fg"
                  aria-label="Fermer la notification"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
