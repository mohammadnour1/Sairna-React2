import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/context/ToastContext'
import { queryKeys } from '@/api/queryKeys'
import { adminKeys } from '../../api/adminQueryKeys'
import { getAdminErrorMessage, getStatus } from '../../api/adminErrors'
import { createCompany, deleteCompany, updateCompany } from '../../services/companies.service'
import { createTrip, deleteTrip, updateTrip } from '../../services/trips.service'
import { cancelAdminBooking } from '../../services/bookings.service'

/**
 * Shared mutation wiring: success toast, cache invalidation, error toast.
 * A 401 is handled by AdminAuthContext (no second toast). Callers can still read `error`
 * (e.g. to show field errors under inputs).
 */
function useAdminMutation({ mutationFn, invalidate, success, errorFallback }) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      for (const key of invalidate(variables)) queryClient.invalidateQueries({ queryKey: key })
      showToast(typeof success === 'function' ? success(data, variables) : success)
    },
    onError: (error) => {
      if (getStatus(error) === 401) return
      showToast(getAdminErrorMessage(error, errorFallback), 'error')
    },
  })
}

// Changes to companies/trips also refresh the passenger-site cache in this tab (same QueryClient).
const websiteCatalog = [queryKeys.companies(), queryKeys.allTrips()]

/** Create (no id) or update (id + changed fields). */
export function useSaveCompany() {
  return useAdminMutation({
    mutationFn: ({ id, body }) => (id ? updateCompany(id, body) : createCompany(body)),
    invalidate: () => [adminKeys.companies(), adminKeys.trips(), adminKeys.overview(), ...websiteCatalog],
    success: (_d, { id, successMessage }) => successMessage ?? (id ? 'تم حفظ تعديلات الشركة.' : 'تمت إضافة الشركة.'),
    errorFallback: 'تعذّر حفظ الشركة.',
  })
}

/** DELETE /companies/{id} — the server ARCHIVES (isActive:false, answers COMPANY_ARCHIVED); it does not erase. */
export function useArchiveCompany() {
  return useAdminMutation({
    mutationFn: ({ id }) => deleteCompany(id),
    invalidate: () => [adminKeys.companies(), adminKeys.overview(), ...websiteCatalog],
    success: 'تمت أرشفة الشركة ولم تعد تظهر للمسافرين.',
    errorFallback: 'تعذّرت أرشفة الشركة.',
  })
}

export function useSaveTrip() {
  return useAdminMutation({
    mutationFn: ({ id, body }) => (id ? updateTrip(id, body) : createTrip(body)),
    invalidate: () => [adminKeys.trips(), adminKeys.bookings(), adminKeys.overview(), ...websiteCatalog],
    success: (_d, { id, successMessage }) => successMessage ?? (id ? 'تم حفظ تعديلات الرحلة.' : 'تمت إضافة الرحلة.'),
    errorFallback: 'تعذّر حفظ الرحلة.',
  })
}

/** DELETE /trips/{id} — the server CANCELS the trip (status CANCELLED, record kept); it does not erase. */
export function useCancelTrip() {
  return useAdminMutation({
    mutationFn: ({ id }) => deleteTrip(id),
    invalidate: () => [adminKeys.trips(), adminKeys.bookings(), adminKeys.overview(), ...websiteCatalog],
    success: 'تم إلغاء الرحلة ولم تعد متاحة للحجز.',
    errorFallback: 'تعذّر إلغاء الرحلة.',
  })
}

export function useCancelAdminBooking() {
  return useAdminMutation({
    mutationFn: ({ id }) => cancelAdminBooking(id),
    invalidate: () => [adminKeys.bookings(), adminKeys.trips(), adminKeys.users(), adminKeys.overview(), queryKeys.allTrips()],
    success: 'تم إلغاء الحجز وعادت المقاعد متاحة.',
    errorFallback: 'تعذّر إلغاء الحجز.',
  })
}
