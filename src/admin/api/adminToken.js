import { readString, remove, writeString } from '@/utils/storage'

// Own key, so the admin and passenger sessions never overwrite each other.
export const ADMIN_TOKEN_KEY = 'sairna-admin-token'

/** sessionStorage first (default), then localStorage ("تذكرني"). */
export function getAdminToken() {
  return readString(ADMIN_TOKEN_KEY, 'session') || readString(ADMIN_TOKEN_KEY, 'local')
}

export function setAdminToken(token, remember = false) {
  clearAdminToken()
  writeString(ADMIN_TOKEN_KEY, token, remember ? 'local' : 'session')
}

export function clearAdminToken() {
  remove(ADMIN_TOKEN_KEY, 'session')
  remove(ADMIN_TOKEN_KEY, 'local')
}
