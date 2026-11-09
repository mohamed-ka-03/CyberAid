import { lazy, Suspense, useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { AppProvider, useApp } from './state/AppState'
import { ToastProvider } from './components/ui/Toast'
import { BottomNavigation, Sidebar, TopBar } from './components/layout/Navigation'
import { ScreenSkeleton } from './components/ui/misc'
import { useRoute, type Route } from './lib/router'
import { useKeyboardOpen } from './lib/utils'

// Chaque écran est chargé à la demande : un vrai état de chargement (squelette).
const screens: Record<Route, React.LazyExoticComponent<() => React.JSX.Element>> = {
  accueil: lazy(() => import('./screens/Home')),
  'check-up': lazy(() => import('./screens/Checkup')),
  missions: lazy(() => import('./screens/Missions')),
  message: lazy(() => import('./screens/Message')),
  profil: lazy(() => import('./screens/Profile')),
}

const titles: Record<Route, string> = {
  accueil: 'Accueil',
  'check-up': 'Check-up',
  missions: 'Missions',
  message: 'Message d’aide',
  profil: 'Profil',
}

function Shell() {
  const route = useRoute()
  const { state } = useApp()
  const keyboard = useKeyboardOpen()
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const Screen = screens[route]

  // Changement d’écran : retour en haut + focus sur la zone principale (lecteurs d’écran).
  useEffect(() => {
    document.title = `${titles[route]} · CyberAid`
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo({ top: 0 })
    main.current?.focus({ preventScroll: true })
  }, [route])

  return (
    <>
      <a href="#contenu" className="sr-only-focusable fixed top-3 left-3 z-[70] rounded-full bg-ink px-4 py-3 text-sm font-semibold text-ink-fg">
        Aller au contenu
      </a>
      <TopBar />
      <Sidebar route={route} />
      <main
        id="contenu"
        ref={main}
        tabIndex={-1}
        className="outline-none md:pl-[var(--rail-w)] lg:pl-[var(--sidebar-w)]"
      >
        <div className="mx-auto w-full max-w-[var(--container-content)] px-4 pt-6 pb-[calc(var(--bottom-nav-h)+var(--safe-bottom)+2.5rem)] xs:px-5 md:px-8 md:pt-8 md:pb-16 lg:px-12 lg:pt-12 xl:px-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${route}-${state.profile}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Suspense fallback={<ScreenSkeleton />}>
                <Screen />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <BottomNavigation route={route} hidden={keyboard} />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </AppProvider>
    </MotionConfig>
  )
}
