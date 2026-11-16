import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { getCities } from '@/services/cities.service'
import { getCompanies, getCompany } from '@/services/companies.service'

const HOUR = 60 * 60 * 1000

/** All governorates (GET /cities). Rarely changes → cached for an hour. */
export function useCities() {
  return useQuery({ queryKey: queryKeys.cities(), queryFn: getCities, staleTime: HOUR })
}

/** All active transport companies (GET /companies). */
export function useCompanies() {
  return useQuery({ queryKey: queryKeys.companies(), queryFn: getCompanies, staleTime: HOUR })
}

/** One company (GET /companies/{id}). */
export function useCompany(id) {
  return useQuery({
    queryKey: queryKeys.company(Number(id)),
    queryFn: () => getCompany(id),
    enabled: Boolean(id),
  })
}
