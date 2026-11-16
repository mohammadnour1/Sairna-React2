import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { queryKeys } from '@/api/queryKeys'
import { getErrorMessage, getStatus, isSeatConflict } from '@/api/errors'
import { useToast } from '@/context/ToastContext'
import { cancelBooking, createBooking } from '@/services/bookings.service'

/**
 * POST /bookings. On success: refresh caches, clear the draft, go to /booking/success/:id.
 * On a seat conflict: toast, refetch seats and hand control back to the page (`onSeatConflict`).
 */
export function useCreateBooking({ tripId, onSuccessCleanup, onSeatConflict }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(queryKeys.booking(booking.id), booking)
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings() })
      queryClient.invalidateQueries({ queryKey: queryKeys.allTrips() }) // trip, seats and lists
      onSuccessCleanup?.()
      navigate(`/booking/success/${booking.id}`, { replace: true })
    },
    onError: (error) => {
      // Session expired while booking: AuthContext already showed the toast. The draft is kept,
      // so after signing in the traveller lands back on the review step.
      if (getStatus(error) === 401) {
        navigate('/login', { state: { from: location } })
        return
      }
      if (isSeatConflict(error)) {
        showToast('في مقعد انحجز قبل شوي، اختار مقعد بديل.', 'error')
        queryClient.invalidateQueries({ queryKey: queryKeys.tripSeats(Number(tripId)) })
        onSeatConflict?.()
        return
      }
      showToast(getErrorMessage(error, 'ما قدرنا نأكد الحجز. حاول مرة ثانية.'), 'error')
    },
  })
}

/** POST /bookings/{id}/cancel. Refreshes the booking, the list and the trip's seats. */
export function useCancelBooking() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id }) => cancelBooking(id),
    onSuccess: (_result, { id, tripId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings() })
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(Number(id)) })
      if (tripId) queryClient.invalidateQueries({ queryKey: queryKeys.trip(Number(tripId)) })
      showToast('تم إلغاء الحجز.')
    },
    onError: (error) => {
      if (getStatus(error) === 401) return // AuthContext handles the expired session
      showToast(getErrorMessage(error, 'ما قدرنا نلغي الحجز. حاول مرة ثانية.'), 'error')
    },
  })
}
