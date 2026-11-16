import { Link } from 'react-router-dom'
import { Ban, Eye, Ticket } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { formatMoney, formatSeats } from '@/utils/format'
import { formatAdminDate, formatAdminDateTime } from '../../utils/datetime'
import DataTable from '../tables/DataTable'
import RowAction from '../ui/RowAction'
import StatusBadge from '../ui/StatusBadge'
import TripRouteCell from '../trips/TripRouteCell'

/**
 * Bookings table used by the bookings page and inside trip/user details.
 * `hide` removes columns that are redundant in context (e.g. the trip on a trip page).
 *
 * @param {{ rows: object[], loading?: boolean, hide?: ('trip'|'user')[], onCancel?: (b: object) => void,
 *           empty?: import('react').ReactNode, caption?: string }} props
 */
export default function BookingsTable({ rows, loading = false, hide = [], onCancel, empty, caption = 'الحجوزات' }) {
  const columns = [
    {
      key: 'code',
      header: 'رقم الحجز',
      primary: true,
      cell: (b) => (
        <Link to={`/admin/bookings/${b.id}`} className="font-extrabold hover:text-primary" dir="ltr">
          {b.code}
        </Link>
      ),
    },
    !hide.includes('user') && {
      key: 'user',
      header: 'صاحب الحجز',
      cell: (b) =>
        b.user || b.userId ? (
          <Link to={`/admin/users/${b.user?.id ?? b.userId}`} className="block min-w-0 hover:text-primary">
            <strong className="block truncate">{b.user?.name || `مستخدم #${b.userId}`}</strong>
            {b.user?.email && (
              <small className="block truncate text-[10px] text-muted" dir="ltr">
                <span className="block text-end">{b.user.email}</span>
              </small>
            )}
          </Link>
        ) : (
          '—'
        ),
    },
    !hide.includes('trip') && {
      key: 'trip',
      header: 'الرحلة',
      cell: (b) =>
        b.trip ? (
          <div>
            <TripRouteCell trip={b.trip} />
            <small className="text-[10px] text-muted">{formatAdminDate(b.trip.departureAt)}</small>
          </div>
        ) : (
          '—'
        ),
    },
    { key: 'seats', header: 'المقاعد', cell: (b) => <span className="font-bold">{b.isCancelled ? '—' : formatSeats(b.seatNumbers)}</span> },
    { key: 'total', header: 'الإجمالي', cell: (b) => <span className="font-extrabold whitespace-nowrap">{formatMoney(b.total)}</span> },
    { key: 'status', header: 'الحالة', cell: (b) => <StatusBadge type="booking" value={b.status} /> },
    { key: 'created', header: 'تاريخ الحجز', hideOnMobile: true, cell: (b) => <small className="whitespace-nowrap text-muted">{formatAdminDateTime(b.createdAt)}</small> },
  ].filter(Boolean)

  return (
    <DataTable
      caption={caption}
      columns={columns}
      rows={rows}
      loading={loading}
      minWidth={hide.length ? 'min-w-[680px]' : 'min-w-[960px]'}
      empty={empty ?? <EmptyState icon={Ticket} title="لا توجد حجوزات" />}
      actions={(b) => (
        <>
          <RowAction icon={Eye} label="التفاصيل" to={`/admin/bookings/${b.id}`} />
          {onCancel && <RowAction icon={Ban} label="إلغاء الحجز" tone="danger" disabled={b.isCancelled} onClick={() => onCancel(b)} />}
        </>
      )}
    />
  )
}
