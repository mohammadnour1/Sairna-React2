import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { getTrip, getTripSeats, getTrips } from '@/services/trips.service'

/**
 * Trips for a route + date (GET /trips). Only runs when the criteria are valid.
 * @param {{ originId:number, destinationId:number, date:string }} criteria
 */
export function useTrips(criteria, { enabled = true } = {}) {
  const { originId, destinationId, date } = criteria
  return useQuery({
    queryKey: queryKeys.trips({ originId, destinationId, date }),
    queryFn: () => getTrips({ originId, destinationId, date }),
    enabled: enabled && Boolean(originId && destinationId && date),
    placeholderData: keepPreviousData,
  })
}

/** Every trip without filters (GET /trips) — used for per-company stats on /companies. */
export function useAllTrips() {
  return useQuery({ queryKey: [...queryKeys.allTrips(), 'all'], queryFn: () => getTrips({}), staleTime: 5 * 60 * 1000 })
}

/** One trip (GET /trips/{id}). */
export function useTrip(id) {
  return useQuery({
    queryKey: queryKeys.trip(Number(id)),
    queryFn: () => getTrip(id),
    enabled: Boolean(id),
  })
}

/**
 * Seat map (GET /trips/{id}/seats). Always fresh; while `live` it polls every 30s,
 * so seats booked by others show up while the traveller is choosing.
 */
export function useTripSeats(id, { live = false } = {}) {
  return useQuery({
    queryKey: queryKeys.tripSeats(Number(id)),
    queryFn: () => getTripSeats(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: live ? 30_000 : false,
  })
}
