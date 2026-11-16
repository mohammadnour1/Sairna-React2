import ConfirmDialog from '@/components/ui/ConfirmDialog'
import TripFormDrawer from '../forms/TripFormDrawer'

/**
 * The trip form drawer + delete confirmation, driven by `useTripActions()`.
 * @param {{ actions: ReturnType<import('../../hooks/useTripActions').useTripActions>, defaultCompanyId?: number|null }} props
 */
export default function TripDialogs({ actions, defaultCompanyId = null }) {
  const { dialog } = actions
  const trip = dialog?.trip
  return (
    <>
      {dialog?.type === 'form' && (
        <TripFormDrawer key={trip?.id ?? 'new'} trip={trip} defaultCompanyId={defaultCompanyId} onClose={actions.close} />
      )}
      <ConfirmDialog
        open={dialog?.type === 'cancel'}
        title={`إلغاء رحلة ${trip ? `${trip.origin?.name} ← ${trip.destination?.name}` : ''}؟`}
        text="لا يحذف الخادم الرحلات نهائياً، بل يغيّر الإلغاء حالتها إلى «ملغاة» فتختفي من الحجز. راجع حجوزاتها بعد ذلك، ويمكنك إعادتها إلى «متاحة» من نافذة التعديل."
        confirmLabel="إلغاء الرحلة"
        cancelLabel="رجوع"
        loading={actions.cancelling}
        onConfirm={actions.confirmCancel}
        onCancel={actions.close}
      />
    </>
  )
}
