import { createContext, lazy, Suspense, useCallback, useContext, useState, type ReactNode } from 'react'
import { Wind } from 'lucide-react'
import { useApp } from '../../state/AppState'
import { cn } from '../../lib/utils'

const BreatheSheet = lazy(() => import('./BreatheSheet'))

const BreatheContext = createContext<() => void>(() => {})

/**
 * « J’ai besoin de souffler » : accessible depuis n’importe quel écran.
 * Rien n’est enregistré : chaque ouverture repart de zéro.
 */
export function BreatheProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  // Incrémenté à chaque ouverture : l’exercice repart toujours de zéro.
  const [session, setSession] = useState(0)
  const show = useCallback(() => {
    setSession((s) => s + 1)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  return (
    <BreatheContext.Provider value={show}>
      {children}
      {session > 0 && (
        <Suspense fallback={null}>
          <BreatheSheet key={session} open={open} onClose={close} />
        </Suspense>
      )}
    </BreatheContext.Provider>
  )
}

export const useBreathe = () => useContext(BreatheContext)

export function BreatheButton({ variant = 'bar' }: { variant?: 'bar' | 'side' }) {
  const open = useBreathe()
  const { config } = useApp()
  const label = config.address === 'tu' ? 'J’ai besoin de souffler' : 'Prendre une pause'
  return (
    <button
      type="button"
      onClick={open}
      aria-label={variant === 'bar' ? label : undefined}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition-colors',
        variant === 'bar'
          ? 'size-11 justify-center text-muted hover:bg-sunken hover:text-fg'
          : 'h-11 w-full justify-center bg-accent-soft text-sm text-accent-text hover:bg-accent-line/50',
      )}
    >
      <Wind className="size-[1.1rem]" aria-hidden />
      {variant === 'side' && <span>{label}</span>}
    </button>
  )
}
