import { mapTrip } from './trip.mapper'

/**
 * Raw (docs/api/samples/booking-detail.json):
 *   { id, code, userId, tripId, status, totalPrice, createdAt, cancelledAt, trip{}, seats[] }
 * Note: after cancelling, the API returns `seats: []`.
 */
export function mapBooking(raw) {
  if (!raw) return null
  const id = Number(raw.id)
  const status = String(raw.status ?? 'CONFIRMED').toUpperCase()
  const seats = (raw.seats ?? [])
    .map((s) => ({
      seatNumber: Number(s.seatNumber),
      passengerName: s.passengerName ?? '',
      passengerPhone: s.passengerPhone ?? '',
    }))
    .sort((a, b) => a.seatNumber - b.seatNumber)

  return {
    id,
    code: raw.code || `SR-${id}`,
    status,
    isCancelled: status === 'CANCELLED',
    trip: raw.trip ? mapTrip(raw.trip) : null,
    tripId: raw.tripId != null ? Number(raw.tripId) : (raw.trip?.id ?? null),
    seats,
    seatNumbers: seats.map((s) => s.seatNumber),
    total: raw.totalPrice != null ? Number(raw.totalPrice) : null,
    createdAt: raw.createdAt ?? null,
    cancelledAt: raw.cancelledAt ?? null,
  }
}

export function mapBookings(list) {
  return Array.isArray(list) ? list.map(mapBooking).filter(Boolean) : []
}
