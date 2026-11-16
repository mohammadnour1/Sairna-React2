import { useMemo } from 'react'

export const TIME_FILTERS = [
  { value: 'all', label: 'كل الأوقات' },
  { value: 'morning', label: 'صباحاً (قبل 12)' },
  { value: 'afternoon', label: 'ظهراً (12–17)' },
  { value: 'evening', label: 'مساءً (بعد 17)' },
]

export const SORT_OPTIONS = [
  { value: 'earliest', label: 'وقت الانطلاق' },
  { value: 'cheap', label: 'أقل سعر' },
  { value: 'quick', label: 'أقصر مدة' },
]

const hourOf = (trip) => Number(trip.departureTime?.slice(0, 2) ?? 0)

function matchesTime(trip, time) {
  const h = hourOf(trip)
  if (time === 'morning') return h < 12
  if (time === 'afternoon') return h >= 12 && h < 17
  if (time === 'evening') return h >= 17
  return true
}

const sorters = {
  earliest: (a, b) => (a.departureAt ?? '').localeCompare(b.departureAt ?? ''),
  cheap: (a, b) => a.price - b.price,
  quick: (a, b) => (a.durationMinutes ?? Infinity) - (b.durationMinutes ?? Infinity) || sorters.earliest(a, b),
}

/**
 * Client-side company/time filtering and sorting of the trips list.
 * Counts per company are computed on the unfiltered list, so the filter shows real numbers.
 *
 * @param {object[]} trips
 * @param {{ company: 'all'|number, time: string, sort: string }} filters
 */
export function useTripFilters(trips, { company, time, sort }) {
  return useMemo(() => {
    const all = trips ?? []
    const countsByCompany = all.reduce((acc, t) => acc.set(t.company.id, (acc.get(t.company.id) ?? 0) + 1), new Map())
    const filtered = all
      .filter((t) => (company === 'all' || t.company.id === company) && matchesTime(t, time))
      .sort(sorters[sort] ?? sorters.earliest)
    return { filtered, total: all.length, countsByCompany }
  }, [trips, company, time, sort])
}
