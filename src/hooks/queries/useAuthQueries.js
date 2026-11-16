import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { getMe } from '@/services/auth.service'
import { getBooking, getMyBookings } from '@/services/bookings.service'
import { useAuth } from '@/context/AuthContext'

/** Current user (GET /auth/me). Enabled only when a token exists. */
export function useMe(hasToken) {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

/** The signed-in user's bookings (GET /bookings/me). */
export function useMyBookings() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.myBookings(),
    queryFn: getMyBookings,
    enabled: isAuthenticated,
  })
}

/** One booking (GET /bookings/{id}), seeded from the "my bookings" cache when possible. */
export function useBooking(id) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const bookingId = Number(id)
  return useQuery({
    queryKey: queryKeys.booking(bookingId),
    queryFn: () => getBooking(bookingId),
    enabled: isAuthenticated && Boolean(bookingId),
    initialData: () => queryClient.getQueryData(queryKeys.myBookings())?.find((b) => b.id === bookingId),
    initialDataUpdatedAt: () => queryClient.getQueryState(queryKeys.myBookings())?.dataUpdatedAt,
  })
}
