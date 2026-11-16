import { useParams } from 'react-router-dom'
import { Ban, SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import QueryState from '@/components/common/QueryState'
import ConfirmationCard from '@/components/success/ConfirmationCard'
import { useBooking } from '@/hooks/queries/useAuthQueries'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isNotFound } from '@/api/errors'

const notFound = (
  <EmptyState
    as="h1"
    icon={SearchX}
    title="الحجز غير موجود"
    text="يمكن الرابط غلط أو الحجز مو تابع لحسابك."
    action={<Button to="/trips">حجوزاتي</Button>}
  />
)

/** `/booking/success/:bookingId` — shows THIS booking, not "the last one" (bug B24). */
export default function BookingSuccessPage() {
  useDocumentTitle('تم تأكيد الحجز')
  const { bookingId } = useParams()
  const valid = /^\d+$/.test(bookingId)
  const bookingQuery = useBooking(valid ? bookingId : null)

  return (
    <main className="site-container grid min-h-[70vh] place-items-center pt-[70px] pb-[85px] max-sm:pt-10 max-sm:pb-[50px]">
      {!valid ? (
        notFound
      ) : (
        <QueryState
          query={bookingQuery}
          loading={<Spinner label="عم نجيب تفاصيل الحجز..." />}
          error={(error, retry) =>
            isNotFound(error) ? notFound : <EmptyState icon={SearchX} title="تعذّر تحميل الحجز" action={<Button onClick={() => retry()}>حاول مرة ثانية</Button>} />
          }
        >
          {(booking) =>
            booking.isCancelled ? (
              <EmptyState
                as="h1"
                icon={Ban}
                title="هالحجز ملغى"
                text={`الحجز ${booking.code} انلغى وما عاد صالح للسفر.`}
                action={<Button to="/results">احجز رحلة</Button>}
              />
            ) : (
              <ConfirmationCard booking={booking} />
            )
          }
        </QueryState>
      )}
    </main>
  )
}
