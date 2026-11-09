import { House, ClipboardCheck, Waypoints, MessageSquareText, UserRound, X, Phone } from 'lucide-react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { useApp, useProgress } from '../../state/AppState'
import { navigate, type Route } from '../../lib/router'
import { cn, quickExit } from '../../lib/utils'
import { Logo } from '../art/Signal'
import { SegmentedControl } from '../ui/SegmentedControl'
import { useToast } from '../ui/Toast'
import type { ProfileId } from '../../data/types'

type NavKey = 'home' | 'checkup' | 'missions' | 'message' | 'profile'
const items: { key: NavKey; route: Route; icon: LucideIcon }[] = [
  { key: 'home', route: 'accueil', icon: House },
  { key: 'checkup', route: 'check-up', icon: ClipboardCheck },
  { key: 'missions', route: 'missions', icon: Waypoints },
  { key: 'message', route: 'message', icon: MessageSquareText },
  { key: 'profile', route: 'profil', icon: UserRound },
]

/* ---------- ProfileSwitcher --------------------------------------------- */
export function ProfileSwitcher({ size = 'sm', block }: { size?: 'sm' | 'md'; block?: boolean }) {
  const { state, dispatch } = useApp()
  const toast = useToast()
  const change = (p: ProfileId) => {
    if (p === state.profile) return
    dispatch({ type: 'profile', profile: p })
    toast({
      tone: 'info',
      title: p === 'parent' ? 'Espace Parent' : 'Espace Jeune',
      text: 'Chaque espace garde sa propre progression. Les réponses ne sont jamais partagées.',
    })
  }
  return (
    <SegmentedControl
      label="Choisir l’espace"
      value={state.profile}
      onChange={change}
      size={size}
      block={block}
      options={[
        { value: 'young', label: 'Jeune', dot: 'var(--brand-coral)' },
        { value: 'parent', label: 'Parent', dot: 'var(--brand-parent)' },
      ]}
    />
  )
}

/* ---------- Sortie rapide ------------------------------------------------ */
export function QuickExitButton({ variant = 'bar' }: { variant?: 'bar' | 'side' }) {
  const { config } = useApp()
  return (
    <button
      type="button"
      onClick={quickExit}
      aria-label={`${config.labels.quickExit} : ouvre une page neutre`}
      title="Ouvre immédiatement une page neutre"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition-colors',
        variant === 'bar'
          ? 'h-11 min-w-11 justify-center px-2.5 text-[0.8125rem] text-muted hover:bg-sunken hover:text-fg xs:px-3'
          : 'h-11 w-full justify-center border border-line text-sm text-muted hover:border-line-strong hover:text-fg',
      )}
    >
      <X className="size-4" aria-hidden />
      <span className={variant === "bar" ? "hidden sm:inline" : ""}>{config.labels.quickExit}</span>
    </button>
  )
}

/* ---------- TopBar (mobile + tablette) ----------------------------------- */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/85 pt-[var(--safe-top)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center gap-2 px-4 md:px-8">
        <button type="button" onClick={() => navigate('accueil')} className="-ml-1 rounded-xl p-1" aria-label="CyberAid, retour à l’accueil">
          <Logo wordmarkClass="hidden sm:inline" />
        </button>
        <div className="ml-auto flex min-w-0 items-center gap-0.5 xs:gap-1">
          <ProfileSwitcher />
          <QuickExitButton />
        </div>
      </div>
    </header>
  )
}

/* ---------- BottomNavigation (mobile) ------------------------------------ */
export function BottomNavigation({ route, hidden }: { route: Route; hidden?: boolean }) {
  const { config } = useApp()
  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/92 pb-[var(--safe-bottom)] backdrop-blur-md transition-transform duration-200 md:hidden',
        hidden && 'translate-y-full',
      )}
    >
      <ul className="mx-auto grid h-[var(--bottom-nav-h)] max-w-lg grid-cols-5 px-1">
        {items.map(({ key, route: r, icon: Icon }) => {
          const active = r === route
          return (
            <li key={key} className="flex">
              <a
                href={`#/${r}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[0.6875rem] font-semibold transition-colors',
                  active ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-active"
                    className="absolute top-0 h-[3px] w-8 rounded-b-full bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className={cn('grid h-8 w-12 place-items-center rounded-full transition-colors', active && 'bg-accent-soft text-accent-text')}>
                  <Icon className="size-[1.3rem]" strokeWidth={active ? 2.3 : 1.9} aria-hidden />
                </span>
                {config.labels.nav[key]}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ---------- Sidebar (rail tablette → barre latérale desktop) ------------- */
export function Sidebar({ route }: { route: Route }) {
  const { config } = useApp()
  const { current } = useProgress()
  const line = config.helpLines[0]
  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[var(--rail-w)] flex-col border-r border-line bg-surface md:top-16 md:flex lg:top-0 lg:w-[var(--sidebar-w)]"
      aria-label="Barre latérale"
    >
      <div className="hidden px-6 pt-7 pb-6 lg:block">
        <button type="button" onClick={() => navigate('accueil')} className="rounded-xl" aria-label="CyberAid, retour à l’accueil">
          <Logo />
        </button>
        <div className="mt-6">
          <ProfileSwitcher block />
        </div>
      </div>

      <nav aria-label="Navigation principale" className="px-2 pt-3 lg:px-4 lg:pt-0">
        <ul className="space-y-1">
          {items.map(({ key, route: r, icon: Icon }) => {
            const active = r === route
            return (
              <li key={key}>
                <a
                  href={`#/${r}`}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex flex-col items-center gap-1 rounded-2xl px-1 py-2.5 text-[0.6875rem] font-semibold transition-colors',
                    'lg:h-12 lg:flex-row lg:gap-3 lg:px-3.5 lg:py-0 lg:text-[0.9375rem]',
                    active ? 'bg-accent-soft text-accent-text' : 'text-muted hover:bg-sunken hover:text-fg',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="side-active"
                      className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent lg:-left-4"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon className="size-5" strokeWidth={active ? 2.3 : 1.9} aria-hidden />
                  <span>{config.labels.nav[key]}</span>
                  {key === 'missions' && (
                    <span className="ml-auto hidden text-xs font-semibold tabular-nums text-muted lg:inline">
                      {current.done}/{current.total}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto hidden space-y-3 p-4 lg:block">
        <a
          href={line.tel}
          className="group block rounded-2xl border border-line bg-bg p-4 transition-colors hover:border-accent-line"
        >
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <Phone className="size-3.5" aria-hidden /> Besoin de parler ?
          </span>
          <span className="mt-1.5 block font-display text-2xl text-fg">{line.number}</span>
          <span className="block text-[0.8125rem] leading-snug text-muted">Gratuit, anonyme · {line.hours.split('·')[1]?.trim() ?? line.hours}</span>
        </a>
        <QuickExitButton variant="side" />
      </div>
    </aside>
  )
}
