import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCities } from '@/hooks/queries/useCatalog'
import { useToast } from '@/context/ToastContext'
import { DEFAULT_DESTINATION_NAME, DEFAULT_ORIGIN_NAME, FALLBACK_ORIGIN_NAMES } from '@/data/homeContent'
import { tomorrowLocalISO } from '@/utils/date'
import { readJSON, writeJSON } from '@/utils/storage'
import { normalizeArabic } from '@/utils/text'
import { validateSearch } from '@/utils/validation'

const LAST_SEARCH_KEY = 'sairna-last-search'

export function findCityByName(cities, name) {
  const target = normalizeArabic(name)
  return cities?.find((c) => normalizeArabic(c.name) === target) ?? null
}

/** Default search: حلب → دمشق, tomorrow, 1 traveller (reference). */
export function defaultSearch(cities) {
  const origin = findCityByName(cities, DEFAULT_ORIGIN_NAME) ?? cities?.[0]
  const destination = findCityByName(cities, DEFAULT_DESTINATION_NAME) ?? cities?.find((c) => c.id !== origin?.id)
  return { originId: origin?.id ?? null, destinationId: destination?.id ?? null, date: tomorrowLocalISO(), people: 1 }
}

/** Builds `/results?originId=…` (extra keys like `company` are appended when present). */
export function resultsUrl({ originId, destinationId, date, people, ...extra }) {
  const params = new URLSearchParams({ originId, destinationId, date, people: String(people) })
  Object.entries(extra).forEach(([key, value]) => value != null && value !== 'all' && params.set(key, value))
  return `/results?${params}`
}

export function readLastSearch() {
  return readJSON(LAST_SEARCH_KEY, null, 'session')
}

export function saveLastSearch(search) {
  writeJSON(LAST_SEARCH_KEY, search, 'session')
}

/**
 * Search criteria shared by the home form, destination shortcuts and the results page.
 * - `initialValues`: last valid search of this tab, else the defaults
 * - `search(values)`: validates (bug B2), remembers and navigates to /results
 * - `searchToDestination(city)`: destination shortcut that never creates X → X (bug B1)
 */
export function useTripSearch() {
  const citiesQuery = useCities()
  const cities = citiesQuery.data
  const navigate = useNavigate()
  const { showToast } = useToast()
  const cityIds = useMemo(() => cities?.map((c) => c.id) ?? [], [cities])

  const initialValues = useMemo(() => {
    if (!cities) return null
    const last = readLastSearch()
    if (last && validateSearch(last, cityIds).valid) return last
    return defaultSearch(cities)
  }, [cities, cityIds])

  const search = useCallback(
    (values, extra = {}) => {
      const criteria = {
        originId: Number(values.originId),
        destinationId: Number(values.destinationId),
        date: values.date,
        people: Number(values.people),
      }
      const { valid, errors } = validateSearch(criteria, cityIds)
      if (!valid) {
        showToast(Object.values(errors)[0], 'error')
        return false
      }
      saveLastSearch(criteria)
      navigate(resultsUrl({ ...criteria, ...extra }))
      return true
    },
    [cityIds, navigate, showToast],
  )

  const searchToDestination = useCallback(
    (destination) => {
      const last = readLastSearch()
      let origin = cities.find((c) => c.id === last?.originId) ?? findCityByName(cities, DEFAULT_ORIGIN_NAME)
      if (!origin || origin.id === destination.id) {
        origin = FALLBACK_ORIGIN_NAMES.map((n) => findCityByName(cities, n)).find((c) => c && c.id !== destination.id)
      }
      return search({
        originId: origin?.id,
        destinationId: destination.id,
        date: tomorrowLocalISO(),
        people: last?.people ?? 1,
      })
    },
    [cities, search],
  )

  return { citiesQuery, cities, initialValues, search, searchToDestination }
}
