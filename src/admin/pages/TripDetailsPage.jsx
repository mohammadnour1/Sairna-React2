import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useNow } from '@/hooks/useNow'
import { useAdminBookings, useAdminTrip } from '../hooks/queries/useAdminQueries'
import { useBookingCancel } from '../hooks/useBookingCancel'
import { useTripActions } from '../hooks/useTripActions'
import { byTimeDesc, sortCopy } from '../utils/list'
import CancelBookingDialog from '../components/bookings/CancelBookingDialog'
import TripDetailsView from '../components/trips/TripDetailsView'
import TripDialogs from '../components/trips/TripDialogs'
import DetailState from '../components/ui/DetailState'

/** `/admin/trips/:tripId` — GET /trips/{id} + its bookings. */
export default function TripDetailsPage() {
  const { tripId } = useParams()
  const valid = /^\d+$/.test(tripId)
  const tripQuery = useAdminTrip(valid ? tripId : null)
  const trip = tripQuery.data
  // Use the bookings embedded in the trip response if the API sends them; otherwise filter GET /bookings.
  const embedded = trip?.bookings ?? null
  const bookingsQuery = useAdminBookings()
  const actions = useTripActions()
  const cancel = useBookingCancel()
  const now = useNow()

  const bookings = useMemo(() => {
    const list = embedded ?? bookingsQuery.data?.filter((b) => b.tripId === Number(tripId))
    return list ? sortCopy(list, byTimeDesc((b) => b.createdAt)) : null
  }, [embedded, bookingsQuery.data, tripId])

  const state = <DetailState query={tripQuery} invalid={!valid} notFoundTitle="الرحلة غير موجودة" backTo="/admin/trips" backLabel="كل الرحلات" />
  if (!valid || !trip) return state

  return (
    <>
      <TripDetailsView
        trip={trip}
        bookings={bookings}
        bookingsLoading={!bookings && bookingsQuery.isPending}
        now={now}
        onEdit={() => actions.openEdit(trip)}
        onCancelTrip={() => actions.askCancel(trip)}
        onCancelBooking={cancel.ask}
      />
      <TripDialogs actions={actions} />
      <CancelBookingDialog cancel={cancel} />
    </>
  )
}
