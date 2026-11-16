export const SEAT_COLUMNS = 4 // reference layout: 2 + aisle + 2

/**
 * Raw: { tripId, totalSeats, status, occupiedSeats: number[], availableSeats }
 * → SeatMap { totalSeats, availableSeats, columns, seats: [{ number, status }] }
 */
export function mapSeatMap(raw) {
  const totalSeats = Number(raw?.totalSeats) || 0
  const occupied = new Set((raw?.occupiedSeats ?? []).map(Number))
  return {
    tripId: raw?.tripId != null ? Number(raw.tripId) : null,
    totalSeats,
    availableSeats: raw?.availableSeats != null ? Number(raw.availableSeats) : totalSeats - occupied.size,
    columns: Number(raw?.columns) || SEAT_COLUMNS,
    seats: Array.from({ length: totalSeats }, (_, i) => ({
      number: i + 1,
      status: occupied.has(i + 1) ? 'booked' : 'available',
    })),
  }
}
