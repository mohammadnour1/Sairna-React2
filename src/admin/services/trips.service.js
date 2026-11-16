import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapAdminTrip, mapList, unwrap } from '../api/mappers/admin.mappers'

/** GET /trips — every trip (no query params in the API; filtering is client-side). */
export async function getAdminTrips() {
  const { data } = await adminClient.get(adminEndpoints.trips())
  return mapList(mapAdminTrip)(data)
}

/** GET /trips/{id} */
export async function getAdminTrip(id) {
  const { data } = await adminClient.get(adminEndpoints.trip(id))
  return mapAdminTrip(unwrap(data))
}

/** POST /trips — CreateTripDto (all 7 fields required) */
export async function createTrip(body) {
  const { data } = await adminClient.post(adminEndpoints.trips(), body)
  return mapAdminTrip(unwrap(data))
}

/** PATCH /trips/{id} — UpdateTripDto (changed fields only; may include status) */
export async function updateTrip(id, patch) {
  const { data } = await adminClient.patch(adminEndpoints.trip(id), patch)
  return mapAdminTrip(unwrap(data))
}

/** DELETE /trips/{id} — cancels the trip (answers the trip with status CANCELLED; the record stays). */
export async function deleteTrip(id) {
  const { data } = await adminClient.delete(adminEndpoints.trip(id))
  return mapAdminTrip(unwrap(data))
}
