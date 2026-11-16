// Every number is shown with Latin digits (bug B11).

/** 145000 → '145,000 ل.س' */
export function formatMoney(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toLocaleString('en-US') + ' ل.س'
}

const dateFormatter = new Intl.DateTimeFormat('ar-SY-u-nu-latn', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** '2026-11-11' → 'الأربعاء، 11 تشرين الثاني 2026'. Parsed at local noon so the day never shifts. */
export function formatDate(isoDate) {
  if (!isoDate) return '—'
  const d = new Date(`${isoDate}T12:00:00`)
  return Number.isNaN(d.getTime()) ? '—' : dateFormatter.format(d)
}

/** 390 → '6 س 30 د' (reference format). */
export function formatDuration(minutes) {
  if (minutes == null || !Number.isFinite(minutes)) return '—'
  const m = Math.max(0, Math.round(minutes))
  return `${Math.floor(m / 60)} س ${m % 60} د`
}

/** Pads an 'H:mm' string to 'HH:mm' and returns '—' when missing. */
export function formatTime(time) {
  if (!time) return '—'
  const [h, m] = time.split(':')
  return `${h.padStart(2, '0')}:${m}`
}

/** 1 → '1 مسافر', 3 → '3 مسافرين' */
export function formatPeople(n) {
  return `${n} ${Number(n) === 1 ? 'مسافر' : 'مسافرين'}`
}

/** Joins seat numbers with the Arabic comma: [3, 7] → '3، 7' */
export function formatSeats(seats) {
  return seats && seats.length ? [...seats].sort((a, b) => a - b).join('، ') : '—'
}
