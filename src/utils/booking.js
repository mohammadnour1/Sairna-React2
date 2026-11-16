// Small booking helpers shared by My Trips, the ticket modal, tracking and the account page.

export function hasDeparted(booking, now = Date.now()) {
  const at = booking.trip?.departureAt
  return Boolean(at) && new Date(at).getTime() <= now
}

/** Only confirmed bookings of trips that have not left yet can be cancelled. */
export function isCancellable(booking, now = Date.now()) {
  return booking.status === 'CONFIRMED' && !hasDeparted(booking, now)
}

/** Upcoming (soonest first) → past (most recent first) → cancelled last. */
export function sortBookings(bookings, now = Date.now()) {
  const rank = (b) => (b.isCancelled ? 2 : hasDeparted(b, now) ? 1 : 0)
  const time = (b) => new Date(b.trip?.departureAt ?? 0).getTime()
  return [...bookings].sort((a, b) => rank(a) - rank(b) || (rank(a) === 0 ? time(a) - time(b) : time(b) - time(a)))
}

/** Arrival time in ms: `arrivalAt`, else departure + duration, else null. */
function arrivalTime(booking) {
  const trip = booking.trip
  if (trip?.arrivalAt) return new Date(trip.arrivalAt).getTime()
  if (trip?.departureAt && trip.durationMinutes != null) {
    return new Date(trip.departureAt).getTime() + trip.durationMinutes * 60_000
  }
  return null
}

/** The trip has left but not arrived yet. */
export function isOnTheRoad(booking, now = Date.now()) {
  const arrival = arrivalTime(booking)
  return hasDeparted(booking, now) && arrival != null && arrival > now
}

/**
 * Tracking default: a non-cancelled trip that is on the road right now,
 * otherwise the nearest upcoming one.
 */
export function nextTrackableBooking(bookings, now = Date.now()) {
  const active = bookings.filter((b) => !b.isCancelled && b.trip)
  return active.find((b) => isOnTheRoad(b, now)) ?? sortBookings(active, now).find((b) => !hasDeparted(b, now)) ?? null
}
