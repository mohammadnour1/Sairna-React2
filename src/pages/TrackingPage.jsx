import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Ban, MapPinOff, SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import TrackingMapPanel from '@/components/tracking/TrackingMapPanel'
import TrackingSidebar from '@/components/tracking/TrackingSidebar'
import TrackingTitle from '@/components/tracking/TrackingTitle'
import { useBooking, useMyBookings } from '@/hooks/queries/useAuthQueries'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useTrackingSimulation } from '@/hooks/useTrackingSimulation'
import { isNotFound } from '@/api/errors'
import { nextTrackableBooking } from '@/utils/booking'

/** Simulation view for one booking (keyed by booking id → fresh simulation per booking). */
function TrackingView({ booking }) {
  const sim = useTrackingSimulation({ durationMinutes: booking.trip.durationMinutes, distanceKm: booking.trip.estimatedKm })
  return (
    <section className="site-container grid grid-cols-[349px_minmax(0,1fr)] items-stretch gap-[18px] max-lg:grid-cols-[305px_minmax(0,1fr)] max-md:grid-cols-1">
      <TrackingSidebar booking={booking} sim={sim} />
      <TrackingMapPanel trip={booking.trip} progress={sim.progress} />
    </section>
  )
}

function Message({ icon, title, text, action }) {
  return (
    <section className="site-container">
      <EmptyState icon={icon} title={title} text={text} action={action} />
    </section>
  )
}

/** `/tracking` (nearest upcoming booking) and `/tracking/:bookingId`. No footer on this page. */
export default function TrackingPage() {
  useDocumentTitle('تتبّع الرحلة')
  const { bookingId } = useParams()
  const validId = bookingId && /^\d+$/.test(bookingId) ? bookingId : null
  const bookingQuery = useBooking(validId)
  const listQuery = useMyBookings()
  const [now] = useState(Date.now)

  const query = bookingId ? bookingQuery : listQuery
  const booking = bookingId ? bookingQuery.data : listQuery.data && nextTrackableBooking(listQuery.data, now)

  let content
  if (bookingId && !validId) {
    content = <Message icon={SearchX} title="الحجز غير موجود" action={<Button to="/trips">حجوزاتي</Button>} />
  } else if (query.isPending) {
    content = (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner label="عم نجهّز الخريطة..." />
      </div>
    )
  } else if (query.isError) {
    content = isNotFound(query.error) ? (
      <Message icon={SearchX} title="الحجز غير موجود" text="يمكن الرابط غلط أو الحجز مو تابع لحسابك." action={<Button to="/trips">حجوزاتي</Button>} />
    ) : (
      <Message icon={SearchX} title="تعذّر تحميل الحجز" action={<Button onClick={() => query.refetch()}>حاول مرة ثانية</Button>} />
    )
  } else if (!booking) {
    content = (
      <Message
        icon={MapPinOff}
        title="ما في رحلة قادمة لتتبّعها"
        text="احجز رحلة وبتقدر تتابع مسارها من هون."
        action={<Button to="/results">احجز رحلة</Button>}
      />
    )
  } else if (!booking.trip) {
    content = (
      <Message
        icon={MapPinOff}
        title="تفاصيل الرحلة مو متوفرة"
        text={`ما قدرنا نجيب معلومات الرحلة تبع الحجز ${booking.code}.`}
        action={<Button to="/trips">كل الحجوزات</Button>}
      />
    )
  } else if (booking.isCancelled) {
    content = (
      <Message
        icon={Ban}
        title="هالحجز ملغى"
        text={`الحجز ${booking.code} انلغى، فما في رحلة لتتبّعها.`}
        action={<Button to="/trips">كل الحجوزات</Button>}
      />
    )
  } else {
    content = <TrackingView key={booking.id} booking={booking} />
  }

  return (
    <main className="bg-bg pb-[60px]">
      <TrackingTitle />
      {content}
    </main>
  )
}
