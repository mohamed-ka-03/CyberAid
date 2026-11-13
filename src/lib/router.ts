import { useEffect, useState } from 'react'

export const ROUTES = ['accueil', 'check-up', 'missions', 'message', 'profil', 'situations', 'guides'] as const
export type Route = (typeof ROUTES)[number]

interface Location {
  route: Route
  /** Sous-page optionnelle : #/guides/instagram → « instagram ». */
  param: string | null
}

const parse = (): Location => {
  const [head, param] = window.location.hash.replace(/^#\/?/, '').split('/') as [Route, string | undefined]
  return ROUTES.includes(head) ? { route: head, param: param || null } : { route: 'accueil', param: null }
}

/** `replace` : change de sous-page sans empiler l’historique (ex. onglets). */
export function navigate(route: Route, param?: string | null, { replace = false } = {}) {
  const next = `#/${route}${param ? `/${param}` : ''}`
  if (window.location.hash === next) return
  if (replace) window.location.replace(next)
  else window.location.hash = next.slice(1)
}

function useLocation() {
  const [loc, setLoc] = useState<Location>(parse)
  useEffect(() => {
    const on = () => setLoc(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return loc
}

/** Routage par hash : liens partageables, bouton « retour » du navigateur fonctionnel. */
export function useRoute() {
  return useLocation().route
}

/** Sous-page de l’écran courant (ex. la plateforme d’un guide), ou null. */
export function useRouteParam() {
  return useLocation().param
}
