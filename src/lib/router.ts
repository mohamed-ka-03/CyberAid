import { useEffect, useState } from 'react'

export const ROUTES = ['accueil', 'check-up', 'missions', 'message', 'profil'] as const
export type Route = (typeof ROUTES)[number]

const parse = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, '') as Route
  return ROUTES.includes(h) ? h : 'accueil'
}

export function navigate(route: Route) {
  if (parse() === route) return
  window.location.hash = `/${route}`
}

/** Routage par hash : liens partageables, bouton « retour » du navigateur fonctionnel. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
