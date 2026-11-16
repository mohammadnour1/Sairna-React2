// Client-side list helpers (the Dashboard API has no search/filter/pagination params).
import { normalizeArabic } from '@/utils/text'

export const PAGE_SIZE = 10

/** Case/diacritics-insensitive "contains" across several fields. */
export function matchesQuery(query, ...fields) {
  const q = normalizeArabic(String(query ?? '')).toLowerCase()
  if (!q) return true
  return fields.some((f) => f != null && normalizeArabic(String(f)).toLowerCase().includes(q))
}

/** Slice one page; clamps an out-of-range page (e.g. after deleting the last row). */
export function paginate(list, page, size = PAGE_SIZE) {
  const total = list.length
  const pages = Math.max(1, Math.ceil(total / size))
  const current = Math.min(Math.max(1, Number(page) || 1), pages)
  return { rows: list.slice((current - 1) * size, current * size), page: current, pages, total, size }
}

const time = (iso) => {
  const t = new Date(iso ?? '').getTime()
  return Number.isFinite(t) ? t : 0
}

/** Sort helpers that never mutate the input. */
export const byTimeDesc = (get) => (a, b) => time(get(b)) - time(get(a))
export const byTimeAsc = (get) => (a, b) => time(get(a)) - time(get(b))
export const byNumberDesc = (get) => (a, b) => (get(b) ?? -Infinity) - (get(a) ?? -Infinity)
export const byText = (get) => (a, b) => String(get(a) ?? '').localeCompare(String(get(b) ?? ''), 'ar')

export function sortCopy(list, compare) {
  return [...list].sort(compare)
}

/** Counts items per key: countBy(trips, t => t.companyId) → Map(id → n). */
export function countBy(list, getKey) {
  const map = new Map()
  for (const item of list ?? []) {
    const key = getKey(item)
    if (key != null) map.set(key, (map.get(key) ?? 0) + 1)
  }
  return map
}
