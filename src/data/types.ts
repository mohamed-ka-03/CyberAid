import type { LucideIcon } from 'lucide-react'

export type ProfileId = 'young' | 'parent'
/** Point d'entrée choisi à l'accueil. */
export type EntryContext = 'target' | 'witness' | 'understand'
/** Les missions existent en deux pistes : personne visée / témoin. */
export type MissionTrack = 'target' | 'witness'
export type ArtKind = 'target' | 'witness' | 'understand'

export interface Entry {
  context: EntryContext
  title: string
  description: string
  art: ArtKind
  /** checkup = lance le questionnaire ; learn = ouvre une fiche « comprendre » */
  action: 'checkup' | 'learn'
}

export interface LearnSheet {
  context: EntryContext
  eyebrow: string
  title: string
  points: { title: string; text: string }[]
  primary: { label: string; to: 'checkup' | 'missions'; track?: MissionTrack }
  secondary?: { label: string; to: 'checkup' | 'missions'; track?: MissionTrack }
}

export interface QuestionOption {
  id: string
  label: string
  hint?: string
  /** Pondération interne pour orienter (jamais affichée comme un score). */
  weight?: 0 | 1 | 2
  /** Option qui exprime une souffrance : on met les ressources d'aide en avant. */
  distress?: boolean
  /** « Je préfère ne pas répondre » / « Aucun » : exclusif en sélection multiple. */
  exclusive?: boolean
}

export interface Question {
  id: string
  title: string
  /** Variante de formulation selon le point d'entrée. */
  titleByContext?: Partial<Record<EntryContext, string>>
  helper?: string
  multi?: boolean
  options: QuestionOption[]
  tip: { title: string; text: string }
}

export interface CheckupOutcome {
  level: 'calm' | 'attention' | 'support'
  title: string
  text: string
}

export interface Mission {
  id: string
  title: string
  summary: string
  why: string
  steps: string[]
  /** Feedback calme une fois la mission faite. */
  feedback: string
  caution?: string
}

export interface MessageOptions {
  about: 'me' | 'other'
  since: 'days' | 'weeks' | 'months'
  place: 'class-group' | 'social' | 'game' | 'private'
  evidence: boolean
}

export interface Recipient {
  id: string
  label: string
  description: string
  icon: LucideIcon
  build: (o: MessageOptions) => string
}

export interface HelpLine {
  id: string
  number: string
  label: string
  description: string
  hours: string
  tel: string
  urgent?: boolean
}

export interface ProgressSnapshot {
  done: string[]
  messageCopied: boolean
  tracksComplete: number
}

/** Badges : uniquement liés à des actions positives, jamais à une révélation. */
export interface BadgeDef {
  id: string
  label: string
  description: string
  icon: LucideIcon
  earned: (p: ProgressSnapshot) => boolean
}

export interface ProfileConfig {
  id: ProfileId
  label: string
  audience: string
  address: 'tu' | 'vous'
  home: {
    eyebrow: string
    title: string
    intro: string
    entries: Entry[]
    learn: LearnSheet[]
    promise: { title: string; text: string }
    steps: { title: string; text: string }[]
    tip: { title: string; text: string }
  }
  checkup: {
    title: string
    intro: string
    privacy: string
    questions: Question[]
    outcome: (answers: Record<string, string[]>, context: EntryContext | null) => CheckupOutcome
    disclaimer: string
  }
  missions: {
    eyebrow: string
    title: string
    intro: string
    unit: string // « réflexes » / « étapes »
    tracks: Record<MissionTrack, { label: string; missions: Mission[] }>
    doneAll: string
  }
  message: {
    eyebrow: string
    title: string
    intro: string
    recipients: Recipient[]
    defaultRecipient: string
    aboutLabels?: Record<MessageOptions['about'], string>
    safety: string
    afterCopy: string
  }
  profile: {
    title: string
    identity: string
    privacyNote: string
    badges: BadgeDef[]
  }
  helpLines: HelpLine[]
  labels: {
    nav: { home: string; checkup: string; missions: string; message: string; profile: string }
    quickExit: string
    continue: string
    back: string
    leave: string
  }
}
