// Small trip helpers for admin lists and details.

export function tripDeparted(trip, now = Date.now()) {
  const t = new Date(trip?.departureAt ?? '').getTime()
  return Number.isFinite(t) && t <= now
}

/** Status shown in tables: the API status, plus "DEPARTED" for an available trip in the past. */
export function tripDisplayStatus(trip, now = Date.now()) {
  if (trip.status === 'AVAILABLE' && tripDeparted(trip, now)) return 'DEPARTED'
  return trip.status
}
