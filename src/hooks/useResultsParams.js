import { useEffect, useMemo } from 'react'
import { useToast } from '@/context/ToastContext'
import { useCities, useCompanies } from '@/hooks/queries/useCatalog'
import { defaultSearch, saveLastSearch } from '@/hooks/useTripSearch'
import { useSearchParamsState } from '@/hooks/useSearchParamsState'
import { isPastDate, isValidISODate } from '@/utils/date'
import { MAX_PEOPLE } from '@/utils/validation'
import { SORT_OPTIONS, TIME_FILTERS } from './useTripFilters'

const toInt = (v) => (v != null && /^\d+$/.test(v) ? Number(v) : null)

// Parsers for every /results param (module constant → stable identity).
const SCHEMA = {
  originId: toInt,
  destinationId: toInt,
  date: (v) => v,
  people: toInt,
  company: (v) => (v == null || v === 'all' ? 'all' : (toInt(v) ?? 'invalid')),
  time: (v) => (TIME_FILTERS.some((t) => t.value === v) ? v : 'all'),
  sort: (v) => (SORT_OPTIONS.some((s) => s.value === v) ? v : 'earliest'),
}

/**
 * Reads the /results URL, fills missing values with defaults and corrects invalid ones
 * (same city, past date, unknown id, people out of 1–4) with `replace: true` + a toast.
 *
 * @returns {{ ready: boolean, criteria: object, filters: object, cities, companies, setFilters, resetFilters }}
 */
export function useResultsParams() {
  const [params, setParams] = useSearchParamsState(SCHEMA)
  const { showToast } = useToast()
  const citiesQuery = useCities()
  const companiesQuery = useCompanies()
  const cities = citiesQuery.data
  const companies = companiesQuery.data

  // Work out the corrected criteria once cities are known.
  const correction = useMemo(() => {
    if (!cities) return null
    const ids = new Set(cities.map((c) => c.id))
    const defaults = defaultSearch(cities)
    const fixed = { ...params }
    const notes = []

    if (!ids.has(fixed.originId)) {
      if (params.originId != null) notes.push('محافظة الانطلاق')
      fixed.originId = defaults.originId
    }
    if (!ids.has(fixed.destinationId) || fixed.destinationId === fixed.originId) {
      if (params.destinationId != null) notes.push('محافظة الوصول')
      fixed.destinationId = defaults.destinationId !== fixed.originId ? defaults.destinationId : defaults.originId
    }
    if (!isValidISODate(fixed.date) || isPastDate(fixed.date)) {
      if (params.date != null) notes.push('التاريخ')
      fixed.date = defaults.date
    }
    if (!fixed.people || fixed.people < 1 || fixed.people > MAX_PEOPLE) {
      if (params.people != null) notes.push('عدد المسافرين')
      fixed.people = 1
    }
    if (companies && fixed.company !== 'all' && !companies.some((c) => c.id === fixed.company)) {
      notes.push('الشركة')
      fixed.company = 'all'
    }

    const changed = ['originId', 'destinationId', 'date', 'people', 'company'].some((k) => fixed[k] !== params[k])
    return { fixed, notes, changed }
  }, [cities, companies, params])

  useEffect(() => {
    if (!correction) return
    const { fixed, notes, changed } = correction
    if (changed) {
      setParams(
        {
          originId: fixed.originId,
          destinationId: fixed.destinationId,
          date: fixed.date,
          people: fixed.people,
          company: fixed.company === 'all' ? null : fixed.company,
        },
        { replace: true },
      )
      if (notes.length) showToast(`عدّلنا ${notes.join(' و')} لقيم صالحة.`, 'info')
    } else {
      saveLastSearch({ originId: fixed.originId, destinationId: fixed.destinationId, date: fixed.date, people: fixed.people })
    }
  }, [correction, setParams, showToast])

  const ready = Boolean(correction && !correction.changed)
  const values = correction?.fixed ?? params

  return {
    ready,
    citiesQuery,
    cities,
    companies: companies ?? [],
    criteria: { originId: values.originId, destinationId: values.destinationId, date: values.date, people: values.people },
    filters: { company: values.company === 'invalid' ? 'all' : values.company, time: params.time, sort: params.sort },
    setFilters: (patch) =>
      setParams(
        Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, v === 'all' || (k === 'sort' && v === 'earliest') ? null : v])),
        { replace: true },
      ),
    resetFilters: () => setParams({ company: null, time: null, sort: null }, { replace: true }),
  }
}
