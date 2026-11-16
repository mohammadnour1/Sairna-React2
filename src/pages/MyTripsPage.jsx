import { useMemo } from 'react'
import { Ticket } from 'lucide-react'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import PageBanner from '@/components/ui/PageBanner'
import QueryState from '@/components/common/QueryState'
import TicketModal from '@/components/common/TicketModal'
import MyTripCard from '@/components/trips/MyTripCard'
import MyTripCardSkeleton from '@/components/trips/MyTripCardSkeleton'
import TripsHeader from '@/components/trips/TripsHeader'
import { useMyBookings } from '@/hooks/queries/useAuthQueries'
import { useBookingActions } from '@/hooks/useBookingActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useNow } from '@/hooks/useNow'
import { hasDeparted, isCancellable, sortBookings } from '@/utils/booking'

/** `/trips` — the signed-in user's bookings from GET /bookings/me (bug B13). No demo booking. */
export default function MyTripsPage() {
  useDocumentTitle('حجوزاتي')
  const bookingsQuery = useMyBookings()
  const now = useNow()
  const sorted = useMemo(() => sortBookings(bookingsQuery.data ?? [], now), [bookingsQuery.data, now])
  const actions = useBookingActions(bookingsQuery.data)
  const ticket = actions.ticketBooking

  return (
    <main className="min-h-[70vh]">
      <PageBanner
        breadcrumb={[{ label: 'الرئيسية', to: '/' }, { label: 'حجوزاتي' }]}
        eyebrow="كل رحلاتك بمكان واحد"
        title="تذاكرك"
        highlight="دايماً معك."
        text="راقب حجوزاتك، وارجع لتفاصيل الرحلة وقت ما تحتاج."
      />
      <section className="site-container py-[86px] max-sm:py-[58px]">
        <TripsHeader />
        <div className="flex flex-col gap-4">
          <QueryState
            query={bookingsQuery}
            loading={[0, 1].map((i) => (
              <MyTripCardSkeleton key={i} />
            ))}
            isEmpty={(data) => data.length === 0}
            empty={<EmptyState icon={Ticket} title="ما عندك حجوزات لسا." text="ابحث عن رحلة واحجز أول مقعد إلك." action={<Button to="/results">احجز رحلة</Button>} />}
          >
            {() =>
              sorted.map((booking) => (
                <MyTripCard
                  key={booking.id}
                  booking={booking}
                  departed={hasDeparted(booking, now)}
                  cancellable={isCancellable(booking, now)}
                  onShowTicket={() => actions.openTicket(booking.id)}
                  onCancel={() => actions.askCancel(booking.id)}
                />
              ))
            }
          </QueryState>
        </div>
      </section>

      <TicketModal
        booking={ticket}
        open={Boolean(ticket)}
        onClose={actions.closeTicket}
        departed={ticket ? hasDeparted(ticket, now) : false}
        cancellable={ticket ? isCancellable(ticket, now) : false}
        onCancel={() => {
          actions.closeTicket()
          actions.askCancel(ticket.id)
        }}
      />
      <ConfirmDialog
        open={Boolean(actions.cancelBooking)}
        title="أكيد بدك تلغي هالحجز؟"
        text={actions.cancelBooking ? `الحجز ${actions.cancelBooking.code} رح يتلغى والمقاعد بترجع متاحة.` : ''}
        confirmLabel="إلغاء الحجز"
        cancelLabel="رجوع"
        loading={actions.isCancelling}
        onConfirm={actions.confirmCancel}
        onCancel={actions.dismissCancel}
      />
    </main>
  )
}
