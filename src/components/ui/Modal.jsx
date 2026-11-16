import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/utils/cn'

/**
 * Accessible dialog shell (reference `.modal-scrim`). Fixes bug B15:
 * focus trap, initial focus, focus returns to the trigger, body scroll lock,
 * closes on Esc and on a click on the dark scrim.
 *
 * @param {{ open: boolean, onClose: () => void, labelledBy?: string, label?: string,
 *           initialFocusRef?: import('react').RefObject<HTMLElement>, widthClass?: string, className?: string,
 *           children: import('react').ReactNode }} props
 */
export default function Modal({ open, onClose, labelledBy, label, initialFocusRef, widthClass = 'w-[min(480px,100%)]', className, children }) {
  const panelRef = useRef(null)
  useLockBodyScroll(open)
  useFocusTrap(panelRef, { active: open, initialFocusRef })

  useEffect(() => {
    if (!open) return
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-200 grid animate-fade place-items-center bg-[rgba(7,27,42,.61)] p-5 backdrop-blur-[6px]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        tabIndex={-1}
        className={cn(
          'relative overflow-hidden rounded-[21px] bg-surface shadow-[0_40px_90px_rgba(0,0,0,.25)] outline-none',
          widthClass,
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
