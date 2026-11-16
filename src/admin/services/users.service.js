import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapAdminUser, mapList, unwrap } from '../api/mappers/admin.mappers'

/** GET /users (read-only in the API). */
export async function getAdminUsers() {
  const { data } = await adminClient.get(adminEndpoints.users())
  return mapList(mapAdminUser)(data)
}

/** GET /users/{id} */
export async function getAdminUser(id) {
  const { data } = await adminClient.get(adminEndpoints.user(id))
  return mapAdminUser(unwrap(data))
}
