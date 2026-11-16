import { Link } from 'react-router-dom'
import { Ban, Bus, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatDuration, formatMoney } from '@/utils/format'
import { formatAdminDateTime } from '../../utils/datetime'
import AdminCard from '../ui/AdminCard'
import DetailHeader from '../ui/DetailHeader'
import DetailList from '../ui/DetailList'
import StatusBadge from '../ui/StatusBadge'
import PassengersList from './PassengersList'

/**
 * One booking: passengers + seats, the trip, the account that booked, and totals.
 * @param {{ booking: object, onCancel: () => void }} props
 */
export default function BookingDetailsView({ booking, onCancel }) {
  const { trip, user } = booking
  return (
    <>
      <DetailHeader
        backTo="/admin/bookings"
        backLabel="كل الحجوزات"
        title={<bdi dir="ltr">{booking.code}</bdi>}
        badges={<StatusBadge type="booking" value={booking.status} />}
        meta={
          <>
            <span>تاريخ الحجز: {formatAdminDateTime(booking.createdAt)}</span>
            {booking.cancelledAt && <span>تاريخ الإلغاء: {formatAdminDateTime(booking.cancelledAt)}</span>}
          </>
        }
        actions={
          !booking.isCancelled && (
            <Button variant="dangerOutline" size="sm" iconStart={Ban} onClick={onCancel}>
              إلغاء الحجز
            </Button>
          )
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-5 max-lg:grid-cols-1">
        <AdminCard title="المسافرون والمقاعد" description={booking.isCancelled ? 'الحجز ملغى، ولا يُعيد الخادم عادةً تفاصيل المقاعد بعد الإلغاء.' : `${booking.seats.length} مقعد`}>
          {booking.seats.length ? <PassengersList seats={booking.seats} /> : <p className="m-0 text-xs">لا توجد مقاعد مرتبطة بهذا الحجز.</p>}
        </AdminCard>

        <div className="flex flex-col gap-5">
          <AdminCard title="المبلغ">
            <strong className="block text-[26px] font-black">{formatMoney(booking.total)}</strong>
            <small className="text-[11px] text-muted">الدفع في مكتب الشركة — لا يوجد دفع إلكتروني.</small>
          </AdminCard>

          {user || booking.userId ? (
            <AdminCard
              title="صاحب الحجز"
              action={<Button to={`/admin/users/${user?.id ?? booking.userId}`} variant="subtle" size="sm" iconStart={User}>الحساب</Button>}
            >
              <DetailList items={[{ label: 'الاسم', value: user?.name || `#${booking.userId}` }, { label: 'البريد الإلكتروني', value: user?.email || null, ltr: true }]} />
            </AdminCard>
          ) : null}
        </div>
      </div>

      {trip && (
        <AdminCard
          className="mt-5"
          title={
            <Link to={`/admin/trips/${trip.id}`} className="hover:text-primary">
              الرحلة: {trip.origin?.name} ← {trip.destination?.name}
            </Link>
          }
          action={<Button to={`/admin/trips/${trip.id}`} variant="subtle" size="sm" iconStart={Bus}>تفاصيل الرحلة</Button>}
        >
          <DetailList
            columns={3}
            items={[
              { label: 'الشركة', value: trip.company?.name },
              { label: 'رمز الرحلة', value: trip.code, ltr: true },
              { label: 'الانطلاق', value: formatAdminDateTime(trip.departureAt) },
              { label: 'الوصول', value: formatAdminDateTime(trip.arrivalAt) },
              { label: 'المدة', value: trip.durationMinutes != null ? formatDuration(trip.durationMinutes) : null },
              { label: 'السعر للمقعد', value: formatMoney(trip.price) },
            ]}
          />
        </AdminCard>
      )}
    </>
  )
}
