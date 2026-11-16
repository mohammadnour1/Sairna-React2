import { useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, BusFront, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import QueryState from '@/components/common/QueryState'
import BookingFlow from '@/components/booking/BookingFlow'
import { useTrip } from '@/hooks/queries/useTrips'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useNow } from '@/hooks/useNow'
import { readLastSearch, resultsUrl } from '@/hooks/useTripSearch'
import { isNotFound } from '@/api/errors'

function Unavailable({ icon, title, backTo }) {
  return (
    <main className="site-container min-h-[70vh] py-20">
      <EmptyState
        as="h1"
        icon={icon}
        title={title}
        text="ارجع لنتائج البحث واختار رحلة تانية."
        action={
          <Button to={backTo} iconStart={ArrowRight}>
            رجوع للرحلات
          </Button>
        }
      />
    </main>
  )
}

/** `/booking/:tripId?people=N` — the trip comes from the URL, never from memory (bug B6). */
export default function BookingPage() {
  useDocumentTitle('إتمام الحجز')
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const id = /^\d+$/.test(tripId) ? Number(tripId) : null
  const tripQuery = useTrip(id)
  const now = useNow()
  const last = readLastSearch()
  const backTo = last ? resultsUrl(last) : '/results'

  if (!id) return <Unavailable icon={BusFront} title="الرحلة غير موجودة أو ما عادت متاحة." backTo={backTo} />

  return (
    <QueryState
      query={tripQuery}
      loading={
        <div className="grid min-h-[70vh] place-items-center">
          <Spinner label="عم نحمّل تفاصيل الرحلة..." />
        </div>
      }
      error={(error, retry) =>
        isNotFound(error) ? (
          <Unavailable icon={BusFront} title="الرحلة غير موجودة أو ما عادت متاحة." backTo={backTo} />
        ) : (
          <main className="site-container min-h-[70vh] py-20">
            <EmptyState icon={BusFront} title="تعذّر تحميل الرحلة" text="تأكد من الإنترنت وحاول مرة ثانية." action={<Button onClick={() => retry()}>حاول مرة ثانية</Button>} />
          </main>
        )
      }
    >
      {(trip) => {
        if (trip.departureAt && new Date(trip.departureAt).getTime() <= now) {
          return <Unavailable icon={Clock} title="الرحلة انطلقت وما عاد فيك تحجز عليها." backTo={backTo} />
        }
        if (!trip.isBookable) {
          return <Unavailable icon={BusFront} title="الرحلة مكتملة أو ما عادت متاحة للحجز." backTo={backTo} />
        }
        return <BookingFlow key={trip.id} trip={trip} requestedPeople={Number(searchParams.get('people')) || 1} backTo={backTo} />
      }}
    </QueryState>
  )
}
