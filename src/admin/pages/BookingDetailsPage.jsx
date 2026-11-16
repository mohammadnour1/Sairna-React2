import { useParams } from 'react-router-dom'
import { useAdminBooking } from '../hooks/queries/useAdminQueries'
import { useBookingCancel } from '../hooks/useBookingCancel'
import BookingDetailsView from '../components/bookings/BookingDetailsView'
import CancelBookingDialog from '../components/bookings/CancelBookingDialog'
import DetailState from '../components/ui/DetailState'

/** `/admin/bookings/:bookingId` — GET /bookings/{id}, with cancel. */
export default function BookingDetailsPage() {
  const { bookingId } = useParams()
  const valid = /^\d+$/.test(bookingId)
  const query = useAdminBooking(valid ? bookingId : null)
  const cancel = useBookingCancel()
  const booking = query.data

  if (!valid || !booking) {
    return <DetailState query={query} invalid={!valid} notFoundTitle="الحجز غير موجود" backTo="/admin/bookings" backLabel="كل الحجوزات" />
  }

  return (
    <>
      <BookingDetailsView booking={booking} onCancel={() => cancel.ask(booking)} />
      <CancelBookingDialog cancel={cancel} />
    </>
  )
}
