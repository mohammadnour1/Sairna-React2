import { client } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapCities } from '@/api/mappers/city.mapper'

export async function getCities() {
  const { data } = await client.get(endpoints.cities())
  return mapCities(data)
}
