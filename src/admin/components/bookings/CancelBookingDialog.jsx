import ConfirmDialog from '@/components/ui/ConfirmDialog'

/**
 * Confirmation before POST /bookings/{id}/cancel.
 * @param {{ cancel: ReturnType<import('../../hooks/useBookingCancel').useBookingCancel> }} props
 */
export default function CancelBookingDialog({ cancel }) {
  const b = cancel.target
  return (
    <ConfirmDialog
      open={Boolean(b)}
      title={`إلغاء الحجز ${b?.code ?? ''}؟`}
      text={b ? `${b.user?.name ? `حجز ${b.user.name}` : 'الحجز'} سيُلغى وتعود مقاعده متاحة. لا يمكن التراجع عن الإلغاء.` : ''}
      confirmLabel="إلغاء الحجز"
      cancelLabel="رجوع"
      loading={cancel.busy}
      onConfirm={cancel.confirm}
      onCancel={cancel.close}
    />
  )
}
