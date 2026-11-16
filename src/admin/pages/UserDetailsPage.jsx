import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Ban, CircleCheck, Ticket, Wallet } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { formatMoney } from '@/utils/format'
import { initial } from '@/utils/text'
import { useAdminBookings, useAdminUser } from '../hooks/queries/useAdminQueries'
import { useBookingCancel } from '../hooks/useBookingCancel'
import { formatAdminDateTime } from '../utils/datetime'
import { byTimeDesc, sortCopy } from '../utils/list'
import BookingsTable from '../components/bookings/BookingsTable'
import CancelBookingDialog from '../components/bookings/CancelBookingDialog'
import StatCard from '../components/overview/StatCard'
import AdminCard from '../components/ui/AdminCard'
import DetailHeader from '../components/ui/DetailHeader'
import DetailState from '../components/ui/DetailState'
import StatusBadge from '../components/ui/StatusBadge'

/** `/admin/users/:userId` — GET /users/{id} + the user's bookings. Read-only profile. */
export default function UserDetailsPage() {
  const { userId } = useParams()
  const valid = /^\d+$/.test(userId)
  const query = useAdminUser(valid ? userId : null)
  const bookingsQuery = useAdminBookings()
  const cancel = useBookingCancel()
  const user = query.data

  const bookings = useMemo(() => {
    const list = user?.bookings ?? bookingsQuery.data?.filter((b) => b.userId === Number(userId))
    return list ? sortCopy(list, byTimeDesc((b) => b.createdAt)) : null
  }, [user?.bookings, bookingsQuery.data, userId])

  if (!valid || !user) {
    return <DetailState query={query} invalid={!valid} notFoundTitle="المستخدم غير موجود" backTo="/admin/users" backLabel="كل المستخدمين" />
  }

  const confirmed = bookings?.filter((b) => !b.isCancelled) ?? []
  const spent = confirmed.reduce((sum, b) => sum + (b.total ?? 0), 0)

  return (
    <>
      <DetailHeader
        backTo="/admin/users"
        backLabel="كل المستخدمين"
        title={
          <span className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[13px] bg-dark text-lg font-black text-white">{initial(user.name || '؟')}</span>
            {user.name || '—'}
          </span>
        }
        badges={<StatusBadge type="role" value={user.role} />}
        meta={
          <>
            <bdi dir="ltr">{user.email}</bdi>
            <span>رقم الحساب #{user.id}</span>
            {user.createdAt && <span>تاريخ التسجيل: {formatAdminDateTime(user.createdAt)}</span>}
          </>
        }
      />

      <div className="mb-5 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-xs:grid-cols-1">
        <StatCard label="كل الحجوزات" icon={Ticket} value={bookings?.length ?? user.bookingsCount ?? '—'} loading={!bookings && bookingsQuery.isPending} />
        <StatCard label="حجوزات مؤكدة" icon={CircleCheck} value={bookings ? confirmed.length : '—'} loading={!bookings && bookingsQuery.isPending} />
        <StatCard label="حجوزات ملغاة" icon={Ban} value={bookings ? bookings.length - confirmed.length : '—'} loading={!bookings && bookingsQuery.isPending} />
        <StatCard label="قيمة الحجوزات المؤكدة" icon={Wallet} value={bookings ? formatMoney(spent) : '—'} loading={!bookings && bookingsQuery.isPending} hint="محسوبة من حجوزاته" />
      </div>

      <AdminCard title="حجوزات المستخدم" bodyClassName="p-4">
        <BookingsTable
          caption="حجوزات المستخدم"
          rows={bookings ?? []}
          loading={!bookings && bookingsQuery.isPending}
          hide={['user']}
          onCancel={cancel.ask}
          empty={<EmptyState icon={Ticket} title="لا توجد لديه حجوزات بعد" className="border-0 py-10" />}
        />
      </AdminCard>
      <CancelBookingDialog cancel={cancel} />
    </>
  )
}
