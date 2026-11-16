import { useMemo } from 'react'
import { byNumberDesc, byTimeAsc, byTimeDesc, matchesQuery, sortCopy } from '../utils/list'

export const BOOKING_LIST_DEFAULTS = { q: '', status: 'all', company: 'all', trip: '', user: '', sort: 'newest', page: '1' }

const SORTS = {
  newest: byTimeDesc((b) => b.createdAt),
  oldest: byTimeAsc((b) => b.createdAt),
  departure: byTimeAsc((b) => b.trip?.departureAt),
  total: byNumberDesc((b) => b.total),
}

/** Client-side search/filter/sort of GET /bookings. */
export function useFilteredBookings(bookings, params) {
  return useMemo(() => {
    const filtered = (bookings ?? []).filter((b) => {
      const passengers = b.seats.flatMap((s) => [s.passengerName, s.passengerPhone])
      if (!matchesQuery(params.q, b.code, b.id, b.user?.name, b.user?.email, b.trip?.origin?.name, b.trip?.destination?.name, ...passengers)) {
        return false
      }
      if (params.status !== 'all' && b.status !== params.status) return false
      if (params.company !== 'all' && String(b.trip?.companyId ?? '') !== params.company) return false
      if (params.trip && String(b.tripId) !== params.trip) return false
      if (params.user && String(b.userId) !== params.user) return false
      return true
    })
    return sortCopy(filtered, SORTS[params.sort] ?? SORTS.newest)
  }, [bookings, params.q, params.status, params.company, params.trip, params.user, params.sort])
}
