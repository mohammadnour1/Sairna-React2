import { useMemo } from 'react'
import { useAdminBookings } from './queries/useAdminQueries'

/**
 * GET /trips (list) has no seat counts — only GET /trips/{id} has `_count.bookingSeats`.
 * So for lists we count the seats of CONFIRMED bookings per trip from GET /bookings (real data).
 * @returns {Map<number, number>|null} tripId → booked seats; null until bookings are loaded
 */
export function useBookedSeatsByTrip() {
  const { data } = useAdminBookings()
  return useMemo(() => {
    if (!data) return null
    const map = new Map()
    for (const b of data) {
      if (!b.isCancelled && b.tripId != null) map.set(b.tripId, (map.get(b.tripId) ?? 0) + b.seats.length)
    }
    return map
  }, [data])
}

/** The trip's own count when the API sent one, else the count from bookings (null while loading). */
export function bookedSeatsOf(trip, seatMap) {
  if (trip.bookedSeats != null) return trip.bookedSeats
  return seatMap ? (seatMap.get(trip.id) ?? 0) : null
}
