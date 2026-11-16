import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminKeys } from '../../api/adminQueryKeys'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { getOverview } from '../../services/overview.service'
import { getAdminCities } from '../../services/cities.service'
import { getAdminCompanies } from '../../services/companies.service'
import { getAdminTrip, getAdminTrips } from '../../services/trips.service'
import { getAdminBooking, getAdminBookings } from '../../services/bookings.service'
import { getAdminUser, getAdminUsers } from '../../services/users.service'

/** Every admin query runs only with a valid admin session. */
function useAdminQuery(options) {
  const { isAuthenticated } = useAdminAuth()
  return useQuery({ ...options, enabled: isAuthenticated && (options.enabled ?? true) })
}

/**
 * Shows the row from the list cache while the detail request runs (opening a row feels instant).
 * `placeholderData`, not `initialData`: the detail endpoint may return more (e.g. related bookings),
 * so it is always fetched.
 */
function useSeed(listKey, id) {
  const queryClient = useQueryClient()
  return { placeholderData: () => queryClient.getQueryData(listKey)?.find((item) => item.id === id) }
}

export const useOverview = () => useAdminQuery({ queryKey: adminKeys.overview(), queryFn: getOverview, staleTime: 30_000 })

export const useAdminCities = () =>
  useAdminQuery({ queryKey: adminKeys.cities(), queryFn: getAdminCities, staleTime: 60 * 60 * 1000 })

export const useAdminCompanies = () => useAdminQuery({ queryKey: adminKeys.companies(), queryFn: getAdminCompanies })

export const useAdminTrips = () => useAdminQuery({ queryKey: adminKeys.trips(), queryFn: getAdminTrips })

export const useAdminBookings = () => useAdminQuery({ queryKey: adminKeys.bookings(), queryFn: getAdminBookings })

export const useAdminUsers = () => useAdminQuery({ queryKey: adminKeys.users(), queryFn: getAdminUsers })

export function useAdminTrip(id) {
  const tripId = Number(id)
  const seed = useSeed(adminKeys.trips(), tripId)
  return useAdminQuery({ queryKey: adminKeys.trip(tripId), queryFn: () => getAdminTrip(tripId), enabled: Boolean(tripId), ...seed })
}

export function useAdminBooking(id) {
  const bookingId = Number(id)
  const seed = useSeed(adminKeys.bookings(), bookingId)
  return useAdminQuery({
    queryKey: adminKeys.booking(bookingId),
    queryFn: () => getAdminBooking(bookingId),
    enabled: Boolean(bookingId),
    ...seed,
  })
}

export function useAdminUser(id) {
  const userId = Number(id)
  const seed = useSeed(adminKeys.users(), userId)
  return useAdminQuery({ queryKey: adminKeys.user(userId), queryFn: () => getAdminUser(userId), enabled: Boolean(userId), ...seed })
}
