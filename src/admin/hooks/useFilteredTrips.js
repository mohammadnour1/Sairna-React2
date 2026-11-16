import { useMemo } from 'react'
import { byNumberDesc, byTimeAsc, byTimeDesc, matchesQuery, sortCopy } from '../utils/list'
import { tripDeparted } from '../utils/trip'
import { bookedSeatsOf } from './useBookedSeatsByTrip'

export const TRIP_LIST_DEFAULTS = { q: '', company: 'all', status: 'all', when: 'upcoming', sort: 'soonest', page: '1' }

const sorts = (seatMap) => ({
  soonest: byTimeAsc((t) => t.departureAt),
  latest: byTimeDesc((t) => t.departureAt),
  price: byNumberDesc((t) => t.price),
  booked: byNumberDesc((t) => bookedSeatsOf(t, seatMap)),
})

/** Client-side filtering + sorting of GET /trips (the API has no query params). */
export function useFilteredTrips(trips, params, now, seatMap) {
  return useMemo(() => {
    const filtered = (trips ?? []).filter((t) => {
      if (!matchesQuery(params.q, t.code, t.id, t.origin?.name, t.destination?.name, t.company?.fullName)) return false
      if (params.company !== 'all' && String(t.companyId) !== params.company) return false
      if (params.status !== 'all' && t.status !== params.status) return false
      if (params.when === 'upcoming' && tripDeparted(t, now)) return false
      if (params.when === 'past' && !tripDeparted(t, now)) return false
      return true
    })
    const all = sorts(seatMap)
    return sortCopy(filtered, all[params.sort] ?? all.soonest)
  }, [trips, params.q, params.company, params.status, params.when, params.sort, now, seatMap])
}
