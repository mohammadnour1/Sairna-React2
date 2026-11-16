import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapAdminBooking, mapList, unwrap } from '../api/mappers/admin.mappers'

/** GET /bookings — every booking. */
export async function getAdminBookings() {
  const { data } = await adminClient.get(adminEndpoints.bookings())
  return mapList(mapAdminBooking)(data)
}

/** GET /bookings/{id} */
export async function getAdminBooking(id) {
  const { data } = await adminClient.get(adminEndpoints.booking(id))
  return mapAdminBooking(unwrap(data))
}

/** POST /bookings/{id}/cancel (no body). */
export async function cancelAdminBooking(id) {
  const { data } = await adminClient.post(adminEndpoints.cancelBooking(id))
  return unwrap(data)
}
