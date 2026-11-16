import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { formatMoney } from '@/utils/format'
import { formatAdminDateTime } from '../../utils/datetime'
import AdminCard from '../ui/AdminCard'
import StatusBadge from '../ui/StatusBadge'

/**
 * Latest bookings (from GET /overview when it includes them, else from GET /bookings).
 * @param {{ bookings: object[]|null, loading: boolean }} props
 */
export default function RecentBookingsCard({ bookings, loading }) {
  return (
    <AdminCard
      title="أحدث الحجوزات"
      action={
        <Link to="/admin/bookings" className="text-[11px] font-extrabold text-primary hover:underline">
          كل الحجوزات
        </Link>
      }
    >
      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : !bookings?.length ? (
        <EmptyState icon={Ticket} iconSize={32} title="لا توجد حجوزات بعد" className="border-0 py-8" />
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {bookings.map((b) => (
            <li key={b.id} className="border-b border-border last:border-0">
              <Link to={`/admin/bookings/${b.id}`} className="flex items-center gap-3 py-3 hover:text-primary">
                <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-surface-alt text-xs font-black">{b.seatsCount || '—'}</span>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[13px]">
                    {b.user?.name || (b.userId ? `مستخدم #${b.userId}` : '—')}
                    {b.trip && (
                      <span className="font-bold text-muted">
                        {' '}
                        · {b.trip.origin?.name} ← {b.trip.destination?.name}
                      </span>
                    )}
                  </strong>
                  <small className="block truncate text-[10px] text-muted">
                    <bdi dir="ltr">{b.code}</bdi> · {formatAdminDateTime(b.createdAt)}
                  </small>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <strong className="text-xs">{formatMoney(b.total)}</strong>
                  <StatusBadge type="booking" value={b.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}
