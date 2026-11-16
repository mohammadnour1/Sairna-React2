import { useLocation } from 'react-router-dom'

/**
 * Returns a function telling whether a nav item is active for the current path.
 * Supports `end` (exact match) and `match` (extra prefixes, e.g. /booking for "احجز رحلة").
 */
export function useNavActive() {
  const { pathname } = useLocation()
  return (item) => {
    if (item.end) return pathname === item.to
    const prefixes = item.match ?? [item.to]
    return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  }
}
