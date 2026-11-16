import { useMemo } from 'react'
import { damascusDay, formatAdminDate, lastDamascusDays } from '../utils/datetime'

export const RANGES = [
  { value: '7', label: '7 أيام' },
  { value: '30', label: '30 يوماً' },
  { value: '90', label: '90 يوماً' },
]

const STATUS_PARTS = [
  { key: 'CONFIRMED', label: 'مؤكدة', fill: 'chart' },
  { key: 'CANCELLED', label: 'ملغاة', fill: 'danger' },
]

const dayIso = (day) => `${day}T09:00:00.000Z` // 12:00 in Damascus → safe for date formatting
const shortDay = (day) => `${Number(day.slice(8, 10))}/${Number(day.slice(5, 7))}`

/**
 * Numbers DERIVED from the real GET /bookings response for the last `days` days (by booking date,
 * Damascus calendar). Nothing here is hard-coded; with no bookings everything is 0.
 *
 * - series: bookings per day (7/30 days) or per week (90 days)
 * - statusParts: confirmed / cancelled / other
 * - topRoutes, byCompany: confirmed bookings grouped by route / company (top 5)
 * - totals: count, seats and revenue of confirmed bookings
 */
export function useBookingAnalytics(bookings, days, now) {
  return useMemo(() => {
    const dayKeys = lastDamascusDays(days, now)
    const inRange = new Set(dayKeys)
    const scoped = (bookings ?? []).filter((b) => inRange.has(damascusDay(b.createdAt)))
    const confirmed = scoped.filter((b) => !b.isCancelled)

    const perDay = new Map(dayKeys.map((d) => [d, 0]))
    for (const b of scoped) perDay.set(damascusDay(b.createdAt), perDay.get(damascusDay(b.createdAt)) + 1)

    let series
    if (days <= 30) {
      series = dayKeys.map((d) => ({ key: d, label: formatAdminDate(dayIso(d)), shortLabel: shortDay(d), value: perDay.get(d) }))
    } else {
      series = []
      for (let i = 0; i < dayKeys.length; i += 7) {
        const week = dayKeys.slice(i, i + 7)
        series.push({
          key: week[0],
          label: `أسبوع ${formatAdminDate(dayIso(week[0]))}`,
          shortLabel: shortDay(week[0]),
          value: week.reduce((sum, d) => sum + perDay.get(d), 0),
        })
      }
    }

    const statusCount = (key) => scoped.filter((b) => b.status === key).length
    const known = STATUS_PARTS.map((p) => ({ ...p, value: statusCount(p.key) }))
    const other = scoped.length - known.reduce((s, p) => s + p.value, 0)
    const statusParts = other > 0 ? [...known, { key: 'OTHER', label: 'حالات أخرى', fill: 'muted', value: other }] : known

    const group = (getKey, getLabel) => {
      const map = new Map()
      for (const b of confirmed) {
        const key = getKey(b)
        if (key == null) continue
        const entry = map.get(key) ?? { key, label: getLabel(b), value: 0 }
        entry.value += 1
        map.set(key, entry)
      }
      return [...map.values()].sort((a, b) => b.value - a.value).slice(0, 5)
    }

    return {
      series,
      statusParts,
      topRoutes: group(
        (b) => (b.trip ? `${b.trip.originId}-${b.trip.destinationId}` : null),
        (b) => `${b.trip.origin?.name ?? '—'} ← ${b.trip.destination?.name ?? '—'}`,
      ),
      byCompany: group(
        (b) => b.trip?.companyId ?? null,
        (b) => b.trip?.company?.name ?? `شركة #${b.trip?.companyId}`,
      ),
      totals: {
        count: scoped.length,
        confirmed: confirmed.length,
        seats: confirmed.reduce((s, b) => s + b.seats.length, 0),
        revenue: confirmed.reduce((s, b) => s + (b.total ?? 0), 0),
      },
    }
  }, [bookings, days, now])
}
