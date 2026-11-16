import { useMemo } from 'react'
import { Ban, Pencil, Ticket } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { formatDuration, formatMoney } from '@/utils/format'
import { formatAdminDateTime } from '../../utils/datetime'
import { tripDisplayStatus } from '../../utils/trip'
import BookingsTable from '../bookings/BookingsTable'
import CompanyAvatar from '../companies/CompanyAvatar'
import AdminCard from '../ui/AdminCard'
import DetailHeader from '../ui/DetailHeader'
import DetailList from '../ui/DetailList'
import StatusBadge from '../ui/StatusBadge'
import SeatOccupancy from './SeatOccupancy'

/**
 * Everything about one trip. `bookings` = the trip's bookings (from the trip response when it
 * includes them, else filtered from GET /bookings); `null` while they load.
 *
 * @param {{ trip: object, bookings: object[]|null, bookingsLoading: boolean, now: number,
 *           onEdit: () => void, onCancelTrip: () => void, onCancelBooking: (b: object) => void }} props
 */
export default function TripDetailsView({ trip, bookings, bookingsLoading, now, onEdit, onCancelTrip, onCancelBooking }) {
  const confirmed = useMemo(() => (bookings ?? []).filter((b) => !b.isCancelled), [bookings])
  const seatMap = useMemo(() => {
    const map = new Map()
    for (const b of confirmed) for (const s of b.seats) map.set(s.seatNumber, s.passengerName || b.user?.name || 'محجوز')
    return map
  }, [confirmed])
  const revenue = bookings ? confirmed.reduce((sum, b) => sum + (b.total ?? 0), 0) : null

  return (
    <>
      <DetailHeader
        backTo="/admin/trips"
        backLabel="كل الرحلات"
        title={`${trip.origin?.name ?? '—'} ← ${trip.destination?.name ?? '—'}`}
        badges={<StatusBadge type="trip" value={tripDisplayStatus(trip, now)} />}
        meta={
          <>
            <bdi dir="ltr">{trip.code ?? `#${trip.id}`}</bdi>
            {trip.company && (
              <span className="flex items-center gap-1.5">
                <CompanyAvatar company={trip.company} size="sm" />
                {trip.company.name}
              </span>
            )}
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" iconStart={Pencil} onClick={onEdit}>
              تعديل
            </Button>
            {trip.status !== 'CANCELLED' && (
              <Button variant="dangerOutline" size="sm" iconStart={Ban} onClick={onCancelTrip}>
                إلغاء الرحلة
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-5 max-lg:grid-cols-1">
        <AdminCard title="معلومات الرحلة" description="الأوقات بتوقيت دمشق.">
          <DetailList
            columns={3}
            items={[
              { label: 'الانطلاق', value: formatAdminDateTime(trip.departureAt) },
              { label: 'الوصول', value: formatAdminDateTime(trip.arrivalAt) },
              { label: 'المدة', value: trip.durationMinutes != null ? formatDuration(trip.durationMinutes) : null },
              { label: 'السعر للمقعد', value: formatMoney(trip.price) },
              { label: 'عدد المقاعد', value: trip.totalSeats },
              { label: 'المقاعد المحجوزة', value: trip.bookedSeats },
              { label: 'المقاعد المتاحة', value: trip.availableSeats },
              { label: 'الحجوزات المؤكدة', value: bookings ? confirmed.length : null },
              { label: 'إيرادات الحجوزات المؤكدة', value: revenue != null ? formatMoney(revenue) : null },
              { label: 'تاريخ الإضافة', value: trip.createdAt ? formatAdminDateTime(trip.createdAt) : null },
            ]}
          />
        </AdminCard>

        <AdminCard title="إشغال المقاعد" description={bookings ? 'من الحجوزات المؤكدة على الرحلة.' : 'جارٍ تحميل الحجوزات...'}>
          {trip.totalSeats ? <SeatOccupancy totalSeats={trip.totalSeats} booked={seatMap} /> : <p className="m-0 text-xs">عدد المقاعد غير معروف.</p>}
        </AdminCard>
      </div>

      <AdminCard title="حجوزات الرحلة" className="mt-5" bodyClassName="p-0 sm:p-0">
        <div className="p-4">
          <BookingsTable
            caption="حجوزات الرحلة"
            rows={bookings ?? []}
            loading={bookingsLoading}
            hide={['trip']}
            onCancel={onCancelBooking}
            empty={<EmptyState icon={Ticket} title="لا توجد حجوزات على هذه الرحلة بعد" className="border-0 py-10" />}
          />
        </div>
      </AdminCard>
    </>
  )
}
