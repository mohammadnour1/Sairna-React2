import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapOverview } from '../api/mappers/overview.mapper'

/** GET /overview → { metrics[], recentBookings, recentTrips } */
export async function getOverview() {
  const { data } = await adminClient.get(adminEndpoints.overview())
  return mapOverview(data)
}
