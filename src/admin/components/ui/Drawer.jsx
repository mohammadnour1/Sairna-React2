import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import IconButton from '@/components/ui/IconButton'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

/**
 * Side sheet for create/edit forms. Opens from the start edge (right in RTL), full width on phones.
 * Focus trap, Esc / scrim to close (unless `busy`), body scroll lock, focus returns to the trigger.
 *
 * @param {{ open: boolean, onClose: () => void, title: string, description?: string, busy?: boolean,
 *           footer?: import('react').ReactNode, children: import('react').ReactNode }} props
 */
export default function Drawer({ open, onClose, title, description, busy = false, footer, children }) {
  const titleId = useId()
  const panelRef = useRef(null)
  useLockBodyScroll(open)
  useFocusTrap(panelRef, { active: open })

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex animate-fade justify-start bg-[rgba(7,27,42,.55)] backdrop-blur-[3px]"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex h-full w-[min(520px,100%)] flex-col bg-surface shadow-[0_0_60px_rgba(0,0,0,.25)] outline-none"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-5 max-sm:px-4">
          <div className="min-w-0">
            <h2 id={titleId} className="m-0 text-lg">
              {title}
            </h2>
            {description && <p className="m-0 text-[11px]">{description}</p>}
          </div>
          <IconButton label="إغلاق" onClick={onClose} disabled={busy} sizeClass="size-9">
            <Icon icon={X} size={19} />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 max-sm:px-4">{children}</div>
        {footer && <footer className="flex flex-wrap gap-2.5 border-t border-border px-6 py-4 max-sm:px-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
