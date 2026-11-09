import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { EntryContext, MissionTrack, ProfileId } from '../data/types'
import { profiles } from '../data/profiles'
import { storage } from '../lib/storage'

export type MissionStatus = 'todo' | 'active' | 'done'
export type ThemePref = 'system' | 'light' | 'dark'

export interface MissionProgress {
  status: MissionStatus
  steps: boolean[]
}

/** Le check-up vit uniquement en mémoire : jamais persisté. */
export interface CheckupState {
  /** -1 = introduction · 0..n-1 = questions · n = résumé */
  step: number
  dir: 1 | -1
  answers: Record<string, string[]>
}

export interface ProfileState {
  context: EntryContext | null
  track: MissionTrack
  missions: Record<string, MissionProgress>
  checkup: CheckupState
  messageCopied: boolean
  reminders: { enabled: boolean; cadence: '3d' | '7d' }
}

export interface AppState {
  profile: ProfileId
  themePref: ThemePref
  remember: boolean
  byProfile: Record<ProfileId, ProfileState>
}

type Action =
  | { type: 'profile'; profile: ProfileId }
  | { type: 'theme'; pref: ThemePref }
  | { type: 'remember'; value: boolean }
  | { type: 'context'; context: EntryContext }
  | { type: 'track'; track: MissionTrack }
  | { type: 'step'; id: string; index: number; total: number }
  | { type: 'mission'; id: string; status: MissionStatus; total: number }
  | { type: 'answer'; question: string; values: string[] }
  | { type: 'checkup-go'; step: number }
  | { type: 'checkup-reset' }
  | { type: 'message-copied' }
  | { type: 'reminders'; value: Partial<ProfileState['reminders']> }
  | { type: 'reset' }

const freshCheckup = (): CheckupState => ({ step: -1, dir: 1, answers: {} })

const freshProfile = (): ProfileState => ({
  context: null,
  track: 'target',
  missions: {},
  checkup: freshCheckup(),
  messageCopied: false,
  reminders: { enabled: false, cadence: '3d' },
})

const initial = (): AppState => {
  const base: AppState = {
    profile: 'young',
    themePref: 'system',
    remember: true,
    byProfile: { young: freshProfile(), parent: freshProfile() },
  }
  const saved = storage.read()
  if (!saved) return base
  const merge = (id: ProfileId): ProfileState => ({ ...base.byProfile[id], ...(saved.byProfile?.[id] ?? {}), checkup: freshCheckup() })
  return {
    profile: saved.profile === 'parent' ? 'parent' : 'young',
    themePref: saved.themePref ?? 'system',
    remember: saved.remember ?? true,
    byProfile: { young: merge('young'), parent: merge('parent') },
  }
}

/** Toutes les mises à jour ne touchent QUE le profil actif : aucune fuite entre espaces. */
const patch = (s: AppState, fn: (p: ProfileState) => ProfileState): AppState => ({
  ...s,
  byProfile: { ...s.byProfile, [s.profile]: fn(s.byProfile[s.profile]) },
})

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'profile':
      return { ...s, profile: a.profile }
    case 'theme':
      return { ...s, themePref: a.pref }
    case 'remember':
      return { ...s, remember: a.value }
    case 'context':
      return patch(s, (p) => ({
        ...p,
        context: a.context,
        track: a.context === 'witness' ? 'witness' : a.context === 'target' ? 'target' : p.track,
      }))
    case 'track':
      return patch(s, (p) => ({ ...p, track: a.track }))
    case 'step':
      return patch(s, (p) => {
        const prev = p.missions[a.id] ?? { status: 'todo', steps: [] }
        const steps = Array.from({ length: a.total }, (_, i) => (i === a.index ? !prev.steps[i] : !!prev.steps[i]))
        const any = steps.some(Boolean)
        const status: MissionStatus = prev.status === 'done' && steps.every(Boolean) ? 'done' : any ? 'active' : 'todo'
        return { ...p, missions: { ...p.missions, [a.id]: { status, steps } } }
      })
    case 'mission':
      return patch(s, (p) => {
        const prev = p.missions[a.id] ?? { status: 'todo', steps: [] }
        const steps =
          a.status === 'done'
            ? Array(a.total).fill(true)
            : a.status === 'todo'
              ? Array(a.total).fill(false)
              : Array.from({ length: a.total }, (_, i) => !!prev.steps[i])
        return { ...p, missions: { ...p.missions, [a.id]: { status: a.status, steps } } }
      })
    case 'answer':
      return patch(s, (p) => ({ ...p, checkup: { ...p.checkup, answers: { ...p.checkup.answers, [a.question]: a.values } } }))
    case 'checkup-go':
      return patch(s, (p) => ({ ...p, checkup: { ...p.checkup, step: a.step, dir: a.step >= p.checkup.step ? 1 : -1 } }))
    case 'checkup-reset':
      return patch(s, (p) => ({ ...p, checkup: freshCheckup() }))
    case 'message-copied':
      return patch(s, (p) => ({ ...p, messageCopied: true }))
    case 'reminders':
      return patch(s, (p) => ({ ...p, reminders: { ...p.reminders, ...a.value } }))
    case 'reset':
      return { ...s, byProfile: { young: freshProfile(), parent: freshProfile() } }
  }
}

interface Ctx {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial)

  // Persistance minimale : progression des missions + préférences. Jamais les réponses ni les brouillons.
  useEffect(() => {
    storage.write(state)
  }, [state])

  // Application du thème + profil sur <html>
  useEffect(() => {
    const root = document.documentElement
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = state.themePref === 'dark' || (state.themePref === 'system' && mq.matches)
      root.dataset.theme = dark ? 'dark' : 'light'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0B1220' : '#F6F8FC')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [state.themePref])

  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.profile === state.profile) return
    root.classList.add('accent-transition')
    root.dataset.profile = state.profile
    const t = window.setTimeout(() => root.classList.remove('accent-transition'), 400)
    return () => window.clearTimeout(t)
  }, [state.profile])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>')
  const { state, dispatch } = ctx
  const config = profiles[state.profile]
  const ps = state.byProfile[state.profile]
  return { state, dispatch, config, ps }
}

/** Progression dérivée (missions faites, pistes complètes) pour le profil actif. */
export function useProgress() {
  const { config, ps } = useApp()
  return useMemo(() => {
    const byTrack = (Object.keys(config.missions.tracks) as MissionTrack[]).map((track) => {
      const list = config.missions.tracks[track].missions
      const done = list.filter((m) => ps.missions[m.id]?.status === 'done').length
      return { track, label: config.missions.tracks[track].label, done, total: list.length }
    })
    const done = Object.entries(ps.missions)
      .filter(([, m]) => m.status === 'done')
      .map(([id]) => id)
    const current = byTrack.find((t) => t.track === ps.track)!
    const snapshot = { done, messageCopied: ps.messageCopied, tracksComplete: byTrack.filter((t) => t.done === t.total).length }
    const badges = config.profile.badges.map((b) => ({ ...b, isEarned: b.earned(snapshot) }))
    return { byTrack, current, done, badges }
  }, [config, ps])
}
