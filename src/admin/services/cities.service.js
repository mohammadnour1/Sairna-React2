import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapAdminCity, mapList } from '../api/mappers/admin.mappers'

/** GET /cities (read-only in the API). */
export async function getAdminCities() {
  const { data } = await adminClient.get(adminEndpoints.cities())
  return mapList(mapAdminCity)(data)
}
