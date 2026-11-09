import type { MessageOptions } from '../data/types'

export const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)

export const sinceText: Record<MessageOptions['since'], string> = {
  days: 'depuis quelques jours',
  weeks: 'depuis quelques semaines',
  months: 'depuis plusieurs mois',
}

export const placeText: Record<MessageOptions['place'], string> = {
  'class-group': 'dans un groupe de classe',
  social: 'sur un réseau social',
  game: 'dans un jeu en ligne',
  private: 'en messages privés',
}

/** Assemble des phrases en ignorant les morceaux vides. */
export const sentences = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()

export const plural = (n: number, one: string, many: string) => (n > 1 ? many : one)
