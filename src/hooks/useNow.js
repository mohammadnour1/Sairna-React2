import { useEffect, useState } from 'react'

/**
 * Current time (ms) that refreshes every `intervalMs` (default: 1 minute).
 * Keeps renders pure (no Date.now() during render) while time-based UI stays correct
 * when a page is left open, e.g. the cancel button disappears once a trip departs.
 */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
