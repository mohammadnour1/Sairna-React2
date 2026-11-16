import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapAdminCompany, mapList, unwrap } from '../api/mappers/admin.mappers'

/** GET /companies — all companies, active and inactive. */
export async function getAdminCompanies() {
  const { data } = await adminClient.get(adminEndpoints.companies())
  return mapList(mapAdminCompany)(data)
}

/** POST /companies — CompanyDto { name*, logoUrl? } */
export async function createCompany(body) {
  const { data } = await adminClient.post(adminEndpoints.companies(), body)
  return mapAdminCompany(unwrap(data))
}

/** PATCH /companies/{id} — UpdateCompanyDto { name?, logoUrl?, isActive? } (changed fields only) */
export async function updateCompany(id, patch) {
  const { data } = await adminClient.patch(adminEndpoints.company(id), patch)
  return mapAdminCompany(unwrap(data))
}

/** DELETE /companies/{id} — archives the company (answers { message: 'COMPANY_ARCHIVED' }). */
export async function deleteCompany(id) {
  const { data } = await adminClient.delete(adminEndpoints.company(id))
  return data
}
