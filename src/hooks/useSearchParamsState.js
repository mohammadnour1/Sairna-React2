import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Typed read/write of URL search params.
 * `schema` maps a key to a parser: (raw string|null) => value.
 *
 * const [params, setParams] = useSearchParamsState({ page: (v) => Number(v) || 1 })
 * setParams({ page: 2 }, { replace: true })   // merges with the existing params
 * setParams({ page: null })                   // null/undefined removes the key
 */
export function useSearchParamsState(schema) {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(
    () => Object.fromEntries(Object.entries(schema).map(([key, parse]) => [key, parse(searchParams.get(key))])),
    [schema, searchParams],
  )

  const update = useCallback(
    (patch, options = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(patch).forEach(([key, value]) => {
            if (value == null || value === '') next.delete(key)
            else next.set(key, String(value))
          })
          return next
        },
        // preventScrollReset keeps the position when only filters change.
        { preventScrollReset: true, ...options },
      )
    },
    [setSearchParams],
  )

  return [params, update, searchParams]
}
