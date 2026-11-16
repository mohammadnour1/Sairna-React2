import { useState } from 'react'
import { useCancelTrip } from './mutations/useAdminMutations'

/**
 * Drawer/dialog state for trips (list and details pages).
 * dialog: null | { type: 'form', trip: object|null } | { type: 'cancel', trip: object }
 * 'cancel' uses DELETE /trips/{id}, which the server implements as "set status CANCELLED" (the trip stays).
 */
export function useTripActions() {
  const [dialog, setDialog] = useState(null)
  const cancelTrip = useCancelTrip()
  const close = () => setDialog(null)

  return {
    dialog,
    close,
    openCreate: () => setDialog({ type: 'form', trip: null }),
    openEdit: (trip) => setDialog({ type: 'form', trip }),
    askCancel: (trip) => setDialog({ type: 'cancel', trip }),
    cancelling: cancelTrip.isPending,
    confirmCancel: () => cancelTrip.mutate({ id: dialog.trip.id }, { onSuccess: close }),
  }
}
