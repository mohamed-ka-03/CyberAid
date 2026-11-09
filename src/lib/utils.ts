import { useEffect, useState } from 'react'

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Copie robuste : API Clipboard puis repli execCommand. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* on tente le repli */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/** Sortie rapide : remplace l’entrée d’historique pour que « retour » ne ramène pas ici. */
export function quickExit() {
  try {
    sessionStorage.clear()
  } catch {
    /* rien */
  }
  window.location.replace('https://www.google.com/search?q=m%C3%A9t%C3%A9o')
}

/** Clavier virtuel ouvert (mobile) : on masque la navigation basse pour libérer l’écran. */
export function useKeyboardOpen() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && !['checkbox', 'radio', 'button'].includes((el as HTMLInputElement).type)))
    const onIn = (e: FocusEvent) => coarse.matches && isField(e.target) && setOpen(true)
    const onOut = () => setOpen(false)
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])
  return open
}

export function useMediaQuery(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}
