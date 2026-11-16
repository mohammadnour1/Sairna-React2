import { useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import { useNow } from '@/hooks/useNow'
import { firstName } from '@/utils/text'
import { adminKeys } from '../api/adminQueryKeys'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useAdminBookings, useAdminTrips, useOverview } from '../hooks/queries/useAdminQueries'
import { RANGES, useBookingAnalytics } from '../hooks/useBookingAnalytics'
import { useListParams } from '../hooks/useListParams'
import { byTimeAsc, byTimeDesc, sortCopy } from '../utils/list'
import { tripDeparted } from '../utils/trip'
import BookingAnalytics from '../components/overview/BookingAnalytics'
import MetricsGrid from '../components/overview/MetricsGrid'
import RangeTabs from '../components/overview/RangeTabs'
import RecentBookingsCard from '../components/overview/RecentBookingsCard'
import UpcomingTripsCard from '../components/overview/UpcomingTripsCard'

const DEFAULTS = { range: '30' }

/**
 * `/admin` — GET /overview tiles, then analytics computed from GET /bookings and GET /trips.
 * The range filter scopes every chart below it.
 */
export default function OverviewPage() {
  const { admin } = useAdminAuth()
  const [params, update] = useListParams(DEFAULTS)
  const days = RANGES.some((r) => r.value === params.range) ? Number(params.range) : 30
  const now = useNow()
  const queryClient = useQueryClient()

  const overviewQuery = useOverview()
  const bookingsQuery = useAdminBookings()
  const tripsQuery = useAdminTrips()
  const analytics = useBookingAnalytics(bookingsQuery.data, days, now)

  const recent = useMemo(
    () => overviewQuery.data?.recentBookings?.slice(0, 6) ?? (bookingsQuery.data ? sortCopy(bookingsQuery.data, byTimeDesc((b) => b.createdAt)).slice(0, 6) : null),
    [overviewQuery.data, bookingsQuery.data],
  )
  const upcoming = useMemo(
    () =>
      sortCopy(
        (tripsQuery.data ?? []).filter((t) => t.status === 'AVAILABLE' && !tripDeparted(t, now)),
        byTimeAsc((t) => t.departureAt),
      ).slice(0, 6),
    [tripsQuery.data, now],
  )

  const refreshing = overviewQuery.isFetching || bookingsQuery.isFetching || tripsQuery.isFetching

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-xl">أهلاً {firstName(admin?.name) || 'بالمشرف'}</h2>
          <p className="m-0 text-xs">هذا ملخص سيرنا من بيانات الخادم مباشرةً.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconStart={RefreshCw}
          loading={refreshing}
          onClick={() => queryClient.invalidateQueries({ queryKey: adminKeys.all(), refetchType: 'active' })}
        >
          تحديث
        </Button>
      </div>

      <MetricsGrid query={overviewQuery} />

      <section aria-labelledby="analytics-title" className="mb-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="analytics-title" className="m-0 text-[15px]">
              تحليلات الحجوزات
            </h2>
            <p className="m-0 text-[11px]">محسوبة من قائمة الحجوزات الحقيقية للفترة المختارة.</p>
          </div>
          <RangeTabs value={String(days)} options={RANGES} onChange={(range) => update({ range })} />
        </div>
        <BookingAnalytics query={bookingsQuery} analytics={analytics} days={days} />
      </section>

      <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
        <RecentBookingsCard bookings={recent} loading={!recent && (bookingsQuery.isPending || overviewQuery.isPending)} />
        <UpcomingTripsCard query={tripsQuery} trips={upcoming} />
      </div>
    </>
  )
}
