import { client } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapBooking, mapBookings } from '@/api/mappers/booking.mapper'

/**
 * POST /bookings
 * @param {{ tripId: number, seats: { seatNumber: number, passengerName: string, passengerPhone: string }[] }} payload
 */
export async function createBooking({ tripId, seats }) {
  const { data } = await client.post(endpoints.bookings(), {
    tripId: Number(tripId),
    seats: seats.map((s) => ({
      seatNumber: Number(s.seatNumber),
      passengerName: s.passengerName.trim(),
      passengerPhone: s.passengerPhone.trim(),
    })),
  })
  return mapBooking(data)
}

export async function getMyBookings() {
  const { data } = await client.get(endpoints.myBookings())
  return mapBookings(data)
}

export async function getBooking(id) {
  const { data } = await client.get(endpoints.booking(id))
  return mapBooking(data)
}

/** Returns { id, status } — the API does not return the full booking here. */
export async function cancelBooking(id) {
  const { data } = await client.post(endpoints.cancelBooking(id))
  return { id: Number(data?.id ?? id), status: data?.status ?? 'CANCELLED' }
}
