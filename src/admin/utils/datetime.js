// Admin date/time helpers. The API stores UTC ISO strings; admins think in Damascus time.
import { APP_TIME_ZONE } from '@/utils/date'

const pad = (n) => String(n).padStart(2, '0')

const partsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

function damascusParts(ms) {
  const p = Object.fromEntries(partsFormatter.formatToParts(new Date(ms)).map((x) => [x.type, Number(x.value)]))
  return p
}

/** Damascus UTC offset (minutes) at a given instant. Works for any DST rule the browser knows. */
function offsetMinutes(ms) {
  const p = damascusParts(ms)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000)
}

/** '2026-11-05T10:30' typed in Damascus time → '2026-11-05T07:30:00.000Z'. Null when invalid. */
export function damascusInputToISO(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value ?? '')
  if (!match) return null
  const [, y, mo, d, h, mi] = match.map(Number)
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi)
  let ms = wallAsUtc - offsetMinutes(wallAsUtc) * 60000
  // Second pass fixes the rare case where the offset differs between the guess and the result.
  ms = wallAsUtc - offsetMinutes(ms) * 60000
  return new Date(ms).toISOString()
}

/** UTC ISO → 'YYYY-MM-DDTHH:mm' in Damascus time (value for <input type="datetime-local">). */
export function isoToDamascusInput(iso) {
  const ms = new Date(iso ?? '').getTime()
  if (!Number.isFinite(ms)) return ''
  const p = damascusParts(ms)
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`
}

/** Current Damascus time as a datetime-local value (used as the input `min`). */
export function nowDamascusInput() {
  return isoToDamascusInput(new Date().toISOString())
}

const dateFormatter = new Intl.DateTimeFormat('ar-SY-u-nu-latn', {
  timeZone: APP_TIME_ZONE,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: APP_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

/** '2026-11-17T16:00:00Z' → '17 تشرين الثاني 2026' (Damascus). */
export function formatAdminDate(iso) {
  const d = new Date(iso ?? '')
  return Number.isNaN(d.getTime()) ? '—' : dateFormatter.format(d)
}

/** '2026-11-17T16:00:00Z' → '19:00' (Damascus). */
export function formatAdminTime(iso) {
  const d = new Date(iso ?? '')
  return Number.isNaN(d.getTime()) ? '—' : timeFormatter.format(d)
}

/** Date + time in one string. */
export function formatAdminDateTime(iso) {
  const date = formatAdminDate(iso)
  return date === '—' ? '—' : `${date} · ${formatAdminTime(iso)}`
}

/** Damascus calendar day 'YYYY-MM-DD' of an ISO timestamp (for grouping by day). */
export function damascusDay(iso) {
  const value = isoToDamascusInput(iso)
  return value ? value.slice(0, 10) : null
}

/** Last `n` Damascus calendar days, oldest first: ['2026-11-01', …, today]. */
export function lastDamascusDays(n, now = Date.now()) {
  return Array.from({ length: n }, (_, i) => damascusDay(new Date(now - (n - 1 - i) * 86_400_000).toISOString()))
}
