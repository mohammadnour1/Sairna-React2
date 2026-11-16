// Safe wrappers: storage can throw in private mode or when blocked.

function area(kind) {
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

export function readJSON(key, fallback = null, kind = 'local') {
  try {
    const raw = area(kind)?.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value, kind = 'local') {
  try {
    area(kind)?.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — the app keeps working without persistence */
  }
}

export function readString(key, kind = 'local') {
  try {
    return area(kind)?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function writeString(key, value, kind = 'local') {
  try {
    area(kind)?.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export function remove(key, kind = 'local') {
  try {
    area(kind)?.removeItem(key)
  } catch {
    /* ignore */
  }
}

// ---- Auth token (section 6.3) ----
export const TOKEN_KEY = 'sairna-token'

/** sessionStorage first (not remembered), then localStorage (remembered). */
export function getToken() {
  return readString(TOKEN_KEY, 'session') || readString(TOKEN_KEY, 'local')
}

export function setToken(token, remember) {
  clearToken()
  writeString(TOKEN_KEY, token, remember ? 'local' : 'session')
}

export function clearToken() {
  remove(TOKEN_KEY, 'session')
  remove(TOKEN_KEY, 'local')
}
