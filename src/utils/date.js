// All calendar dates in the app are plain 'YYYY-MM-DD' strings.
// We never use toISOString() for "today", because it returns the UTC date (bug B10).

export const APP_TIME_ZONE = 'Asia/Damascus'

const pad = (n) => String(n).padStart(2, '0')

/** Formats a Date using the browser's LOCAL calendar → 'YYYY-MM-DD'. */
export function toLocalISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayLocalISO() {
  return toLocalISO(new Date())
}

export function tomorrowLocalISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return toLocalISO(d)
}

/** True for a valid 'YYYY-MM-DD' string that is a real calendar day. */
export function isValidISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
}

/** True when the day is before today (local). String comparison works for ISO dates. */
export function isPastDate(value) {
  return value < todayLocalISO()
}

const damascusParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/**
 * Splits an ISO timestamp into the date and time shown to travellers (Damascus time).
 * '2026-11-11T07:00:00.000Z' → { date: '2026-11-11', time: '10:00' }
 */
export function toDamascusDateTime(iso) {
  if (!iso) return { date: null, time: null }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { date: null, time: null }
  const parts = Object.fromEntries(damascusParts.formatToParts(d).map((p) => [p.type, p.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` }
}

/** Minutes between two ISO timestamps, or null when one is missing. */
export function minutesBetween(startIso, endIso) {
  if (!startIso || !endIso) return null
  const diff = (new Date(endIso) - new Date(startIso)) / 60000
  return Number.isFinite(diff) && diff > 0 ? Math.round(diff) : null
}

/** Adds minutes to 'HH:mm' and wraps around midnight. */
export function addMinutesToTime(time, minutes) {
  if (!time || minutes == null) return null
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`
}
