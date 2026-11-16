import { client } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapCompanies, mapCompany } from '@/api/mappers/company.mapper'

export async function getCompanies() {
  const { data } = await client.get(endpoints.companies())
  return mapCompanies(data)
}

export async function getCompany(id) {
  const { data } = await client.get(endpoints.company(id))
  return mapCompany(data)
}
