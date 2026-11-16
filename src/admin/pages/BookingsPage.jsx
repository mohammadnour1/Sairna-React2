import { useMemo } from 'react'
import { Ticket } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { formatMoney } from '@/utils/format'
import { useAdminBookings, useAdminCompanies } from '../hooks/queries/useAdminQueries'
import { useBookingCancel } from '../hooks/useBookingCancel'
import { BOOKING_LIST_DEFAULTS, useFilteredBookings } from '../hooks/useFilteredBookings'
import { useListParams } from '../hooks/useListParams'
import { paginate } from '../utils/list'
import BookingsTable from '../components/bookings/BookingsTable'
import CancelBookingDialog from '../components/bookings/CancelBookingDialog'
import Pagination from '../components/tables/Pagination'
import AdminQueryError from '../components/ui/AdminQueryError'
import FilterBar from '../components/ui/FilterBar'
import FilterChip from '../components/ui/FilterChip'
import FilterSelect from '../components/ui/FilterSelect'
import PageIntro from '../components/ui/PageIntro'
import SearchInput from '../components/ui/SearchInput'

const STATUS_LABELS = { CONFIRMED: 'مؤكدة', CANCELLED: 'ملغاة' }
const SORT = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'departure', label: 'موعد الرحلة' },
  { value: 'total', label: 'الأعلى قيمة' },
]

/** `/admin/bookings` — all bookings; filter by status/company (and ?trip= / ?user= from other pages); cancel. */
export default function BookingsPage() {
  const [params, update] = useListParams(BOOKING_LIST_DEFAULTS)
  const bookingsQuery = useAdminBookings()
  const companies = useAdminCompanies().data ?? []
  const cancel = useBookingCancel()
  const list = useFilteredBookings(bookingsQuery.data, params)
  const page = paginate(list, params.page)

  const statusOptions = useMemo(() => {
    const found = [...new Set((bookingsQuery.data ?? []).map((b) => b.status))]
    return [{ value: 'all', label: 'الكل' }, ...found.map((s) => ({ value: s, label: STATUS_LABELS[s] ?? s }))]
  }, [bookingsQuery.data])

  // Summary of the filtered slice (computed from the bookings shown, labelled as such).
  const confirmedTotal = list.filter((b) => !b.isCancelled).reduce((sum, b) => sum + (b.total ?? 0), 0)
  const filtering = params.q !== '' || params.status !== 'all' || params.company !== 'all' || params.trip !== '' || params.user !== ''

  return (
    <>
      <PageIntro text="جميع حجوزات المسافرين. يمكنك فتح أي حجز لعرض المسافرين ومقاعدهم، أو إلغاؤه بعد التأكيد.">
        {(params.trip || params.user) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {params.trip && <FilterChip label={`رحلة #${params.trip}`} onRemove={() => update({ trip: '' })} />}
            {params.user && <FilterChip label={`مستخدم #${params.user}`} onRemove={() => update({ user: '' })} />}
          </div>
        )}
      </PageIntro>

      <FilterBar
        active={filtering}
        onClear={() => update({ q: '', status: 'all', company: 'all', trip: '', user: '' })}
        count={bookingsQuery.data ? list.length : null}
      >
        <SearchInput value={params.q} onChange={(q) => update({ q })} placeholder="رقم الحجز أو الاسم أو البريد الإلكتروني أو الهاتف" />
        <FilterSelect label="الحالة" value={params.status} onChange={(status) => update({ status })} options={statusOptions} />
        <FilterSelect
          label="الشركة"
          value={params.company}
          onChange={(company) => update({ company })}
          options={[{ value: 'all', label: 'كل الشركات' }, ...companies.map((c) => ({ value: String(c.id), label: c.name }))]}
        />
        <FilterSelect label="الترتيب" value={params.sort} onChange={(sort) => update({ sort })} options={SORT} />
      </FilterBar>

      {bookingsQuery.data && list.length > 0 && (
        <p className="-mt-1 mb-3 text-[11px] font-bold text-muted">
          مجموع الحجوزات المؤكدة في هذه النتائج: <span className="text-text">{formatMoney(confirmedTotal)}</span>
        </p>
      )}

      <AdminQueryError query={bookingsQuery} />
      {!bookingsQuery.isError && (
        <>
          <BookingsTable
            rows={page.rows}
            loading={bookingsQuery.isPending}
            onCancel={cancel.ask}
            empty={
              <EmptyState
                icon={Ticket}
                title={filtering ? 'لا توجد حجوزات مطابقة' : 'لا توجد حجوزات بعد'}
                text={filtering ? 'جرّب بحثاً آخر أو امسح الفلاتر.' : 'ستظهر الحجوزات هنا فور حجز المسافرين من الموقع.'}
              />
            }
          />
          <Pagination {...page} onChange={(p) => update({ page: p })} />
        </>
      )}

      <CancelBookingDialog cancel={cancel} />
    </>
  )
}
