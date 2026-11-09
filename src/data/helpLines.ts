import type { HelpLine } from './types'

/**
 * Numéros publics français. Horaires indicatifs : à vérifier avant une mise en production.
 */
export const LINE_3018: HelpLine = {
  id: '3018',
  number: '3018',
  label: 'Cyberharcèlement',
  description: 'Gratuit, anonyme et confidentiel. Peut aider à faire supprimer des contenus.',
  hours: '7j/7 · 9h–23h · aussi par appli et tchat',
  tel: 'tel:3018',
}

export const LINE_119: HelpLine = {
  id: '119',
  number: '119',
  label: 'Enfance en danger',
  description: 'Pour parler à quelqu’un si tu es en danger ou si quelqu’un te fait du mal.',
  hours: '24h/24 · 7j/7 · gratuit',
  tel: 'tel:119',
}

export const LINE_3020: HelpLine = {
  id: '3020',
  number: '3020',
  label: 'Non au harcèlement',
  description: 'Harcèlement à l’école : écoute, conseils et lien avec l’établissement.',
  hours: 'Du lundi au samedi · gratuit',
  tel: 'tel:3020',
}

export const LINE_112: HelpLine = {
  id: '112',
  number: '112',
  label: 'Danger immédiat',
  description: 'Si quelqu’un est en danger maintenant.',
  hours: '24h/24',
  tel: 'tel:112',
  urgent: true,
}
