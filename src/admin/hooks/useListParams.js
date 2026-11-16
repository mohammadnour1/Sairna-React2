import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * List state (search, filters, sort, page) kept in the URL, so a refresh or a shared link
 * shows the same view. Values equal to their default are removed from the URL.
 * Every change uses `replace: true` (no history spam) and, unless `page` itself changes, goes back to page 1.
 *
 * @param {Record<string, string>} defaults e.g. { q: '', status: 'all', sort: 'newest', page: '1' }
 * @returns {[Record<string,string>, (patch: Record<string, string|number|null>) => void]}
 */
export function useListParams(defaults) {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => {
    const out = {}
    for (const [key, fallback] of Object.entries(defaults)) out[key] = searchParams.get(key) ?? fallback
    return out
  }, [searchParams, defaults]) // `defaults` must be a module constant (stable identity)

  const update = useCallback(
    (patch) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const merged = 'page' in patch ? patch : { ...patch, page: null }
          for (const [key, value] of Object.entries(merged)) {
            const str = value == null ? '' : String(value)
            if (!str || str === defaults[key]) next.delete(key)
            else next.set(key, str)
          }
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setSearchParams, defaults],
  )

  return [params, update]
}
