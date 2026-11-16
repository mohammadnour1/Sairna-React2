import { useEffect } from 'react'

/** Prevents the page behind a modal from scrolling while `locked` is true. */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return
    const { overflow, paddingInlineEnd } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingInlineEnd = paddingInlineEnd
    }
  }, [locked])
}
