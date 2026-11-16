import { useId, useRef } from 'react'
import { TriangleAlert } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Icon from './Icon'

/**
 * Yes/No confirmation built on Modal. Initial focus goes to the safe "cancel" button.
 * @param {{ open: boolean, title: string, text?: string, confirmLabel: string, cancelLabel?: string,
 *           onConfirm: () => void, onCancel: () => void, loading?: boolean,
 *           variant?: 'danger'|'primary' (confirm button; 'primary' for non-destructive actions) }} props
 */
export default function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel,
  cancelLabel = 'رجوع',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}) {
  const titleId = useId()
  const cancelRef = useRef(null)
  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel} labelledBy={titleId} initialFocusRef={cancelRef} widthClass="w-[min(420px,100%)]" className="p-7 text-center">
      <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-[#fde8e7] text-[#a64645] dark:bg-[#4a2427] dark:text-[#f4b6b2]">
        <Icon icon={TriangleAlert} size={26} />
      </span>
      <h2 id={titleId} className="mb-2 text-lg">
        {title}
      </h2>
      {text && <p className="mb-6 text-xs">{text}</p>}
      <div className="flex justify-center gap-2.5 max-sm:flex-col">
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
        <Button ref={cancelRef} variant="outline" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  )
}
