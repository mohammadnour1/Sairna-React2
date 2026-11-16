import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab / Shift+Tab inside `containerRef` while active, focuses `initialFocusRef`
 * (or the first focusable element) on open, and returns focus to the trigger on close (bug B15).
 */
export function useFocusTrap(containerRef, { active, initialFocusRef } = {}) {
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return
    previouslyFocused.current = document.activeElement

    const focusables = () => [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    ;(initialFocusRef?.current ?? focusables()[0] ?? container).focus()

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      const trigger = previouslyFocused.current
      if (trigger && typeof trigger.focus === 'function' && document.contains(trigger)) trigger.focus()
    }
  }, [active, containerRef, initialFocusRef])
}
