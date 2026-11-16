import { useState } from 'react'
import { useCancelAdminBooking } from './mutations/useAdminMutations'

/** "Cancel booking" confirmation state, shared by the bookings list and the detail pages. */
export function useBookingCancel() {
  const [target, setTarget] = useState(null)
  const cancel = useCancelAdminBooking()
  return {
    target,
    ask: (booking) => setTarget(booking),
    close: () => !cancel.isPending && setTarget(null),
    busy: cancel.isPending,
    confirm: () => cancel.mutate({ id: target.id }, { onSuccess: () => setTarget(null) }),
  }
}
