import type { AppState, ProfileState } from '../state/AppState'

const KEY = 'cyberaid:v1'

type Persisted = Partial<Omit<AppState, 'byProfile'>> & {
  byProfile?: Partial<Record<'young' | 'parent', Partial<ProfileState>>>
}

/** Ne conserve que ce qui est utile ET non sensible. */
const pick = (p: ProfileState): Partial<ProfileState> => ({
  track: p.track,
  missions: p.missions,
  messageCopied: p.messageCopied,
  reminders: p.reminders,
})

export const storage = {
  read(): Persisted | null {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as Persisted) : null
    } catch {
      return null
    }
  },
  write(s: AppState) {
    try {
      const prefs = { profile: s.profile, themePref: s.themePref, remember: s.remember }
      const data: Persisted = s.remember
        ? { ...prefs, byProfile: { young: pick(s.byProfile.young), parent: pick(s.byProfile.parent) } }
        : prefs
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      /* stockage indisponible (navigation privée) : l’app fonctionne sans */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY)
      sessionStorage.clear()
    } catch {
      /* rien */
    }
  },
}
