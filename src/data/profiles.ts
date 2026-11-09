import type { ProfileConfig, ProfileId } from './types'
import { youngProfile } from './young'
import { parentProfile } from './parent'

export const profiles: Record<ProfileId, ProfileConfig> = {
  young: youngProfile,
  parent: parentProfile,
}
