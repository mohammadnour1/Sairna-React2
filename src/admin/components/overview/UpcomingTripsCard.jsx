import { Link } from 'react-router-dom'
import { ArrowLeft, Bus } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import Icon from '@/components/ui/Icon'
import Skeleton from '@/components/ui/Skeleton'
import { formatAdminDate, formatAdminTime } from '../../utils/datetime'
import { bookedSeatsOf, useBookedSeatsByTrip } from '../../hooks/useBookedSeatsByTrip'
import SeatsMeter from '../trips/SeatsMeter'
import AdminCard from '../ui/AdminCard'
import AdminQueryError from '../ui/AdminQueryError'

/**
 * Next departures (from GET /trips): available trips that have not left yet, soonest first.
 * @param {{ query: import('@tanstack/react-query').UseQueryResult, trips: object[] }} props
 */
export default function UpcomingTripsCard({ query, trips }) {
  const seatMap = useBookedSeatsByTrip()
  return (
    <AdminCard
      title="الرحلات القادمة"
      description="أقرب الانطلاقات المتاحة."
      action={
        <Link to="/admin/trips" className="text-[11px] font-extrabold text-primary hover:underline">
          كل الرحلات
        </Link>
      }
    >
      {query.isPending ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : query.isError && !query.data ? (
        <AdminQueryError query={query} className="border-0 py-8" />
      ) : trips.length === 0 ? (
        <EmptyState icon={Bus} iconSize={32} title="لا توجد رحلات قادمة" className="border-0 py-8" />
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {trips.map((t) => (
            <li key={t.id} className="border-b border-border last:border-0">
              <Link to={`/admin/trips/${t.id}`} className="flex items-center gap-3 py-3 hover:text-primary">
                <div className="min-w-0 flex-1">
                  <strong className="flex items-center gap-1.5 text-[13px]">
                    {t.origin?.name}
                    <Icon icon={ArrowLeft} size={13} className="text-primary" />
                    {t.destination?.name}
                  </strong>
                  <small className="block truncate text-[10px] text-muted">
                    {formatAdminDate(t.departureAt)} · <bdi>{formatAdminTime(t.departureAt)}</bdi> · {t.company?.name}
                  </small>
                </div>
                <SeatsMeter booked={bookedSeatsOf(t, seatMap)} total={t.totalSeats} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}
