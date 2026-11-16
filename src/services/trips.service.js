import { client } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapSeatMap } from '@/api/mappers/seat.mapper'
import { mapTrip, mapTrips } from '@/api/mappers/trip.mapper'

/** GET /trips — companyId is intentionally not sent (filtering is client-side for per-company counts). */
export async function getTrips({ originId, destinationId, date }) {
  const { data } = await client.get(endpoints.trips(), { params: { originId, destinationId, date } })
  return mapTrips(data)
}

export async function getTrip(id) {
  const { data } = await client.get(endpoints.trip(id))
  return mapTrip(data)
}

export async function getTripSeats(id) {
  const { data } = await client.get(endpoints.tripSeats(id))
  return mapSeatMap(data)
}
