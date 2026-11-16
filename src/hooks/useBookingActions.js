import { useState } from 'react'
import { useCancelBooking } from '@/hooks/mutations/useBookingMutations'

/**
 * UI state for "show ticket" and "cancel booking" (My Trips page).
 * The ticket keeps an id (not a copy), so it always shows the freshest data from the list.
 */
export function useBookingActions(bookings) {
  const [ticketId, setTicketId] = useState(null)
  const [cancelId, setCancelId] = useState(null)
  const cancelMutation = useCancelBooking()

  const findById = (id) => bookings?.find((b) => b.id === id) ?? null

  return {
    ticketBooking: findById(ticketId),
    openTicket: (id) => setTicketId(id),
    closeTicket: () => setTicketId(null),
    cancelBooking: findById(cancelId),
    askCancel: (id) => setCancelId(id),
    dismissCancel: () => !cancelMutation.isPending && setCancelId(null),
    confirmCancel: () => {
      const booking = findById(cancelId)
      if (!booking) return
      cancelMutation.mutate({ id: booking.id, tripId: booking.tripId }, { onSettled: () => setCancelId(null) })
    },
    isCancelling: cancelMutation.isPending,
  }
}
