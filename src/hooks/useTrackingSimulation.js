import { useCallback, useEffect, useState } from 'react'
import { estimateDurationMinutes } from '@/utils/geo'

const START = 0.48 // reference demo start
const STEP = 0.006
const TICK_MS = 150

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Simulated bus progress for the tracking page (NOT real GPS).
 * - starts at 48% and advances +0.6% every 150ms while playing
 * - stops at 100% with an "arrived" status (the reference looped forever — bug B8)
 * - starts paused when the user prefers reduced motion
 * - remaining time = (1 − p) × trip duration; estimated from distance when the duration is unknown
 *
 * @param {{ durationMinutes: number|null, distanceKm: number|null }} trip
 */
export function useTrackingSimulation({ durationMinutes, distanceKm }) {
  const [progress, setProgress] = useState(START)
  const [wantsToPlay, setWantsToPlay] = useState(() => !prefersReducedMotion())
  const arrived = progress >= 1
  // Derived: the bus stops by itself on arrival (no setState inside a state updater).
  const playing = wantsToPlay && !arrived

  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => setProgress((p) => Math.min(1, p + STEP)), TICK_MS)
    return () => clearInterval(id)
  }, [playing])

  const toggle = useCallback(() => {
    if (arrived) {
      // Pressing play after arrival restarts the trip.
      setProgress(0)
      setWantsToPlay(true)
    } else {
      setWantsToPlay((value) => !value)
    }
  }, [arrived])

  const reset = useCallback(() => {
    setProgress(0)
    setWantsToPlay(true)
  }, [])

  const durationIsEstimate = durationMinutes == null
  const totalMinutes = durationMinutes ?? estimateDurationMinutes(distanceKm)
  const status = arrived ? 'وصلت الحافلة إلى الوجهة' : progress >= 0.8 ? 'اقتربنا من محطة الوصول' : 'الحافلة تتحرك نحو الوجهة'

  return {
    progress,
    playing,
    arrived,
    status,
    remainingMinutes: totalMinutes == null ? null : Math.max(0, Math.round((1 - progress) * totalMinutes)),
    durationIsEstimate,
    toggle,
    reset,
  }
}
