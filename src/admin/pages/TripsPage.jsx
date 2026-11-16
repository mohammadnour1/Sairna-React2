import { useMemo } from 'react'
import { Ban, Bus, Eye, Pencil, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { formatMoney, formatDuration } from '@/utils/format'
import { useNow } from '@/hooks/useNow'
import { useAdminCompanies, useAdminTrips } from '../hooks/queries/useAdminQueries'
import { TRIP_LIST_DEFAULTS, useFilteredTrips } from '../hooks/useFilteredTrips'
import { bookedSeatsOf, useBookedSeatsByTrip } from '../hooks/useBookedSeatsByTrip'
import { useListParams } from '../hooks/useListParams'
import { useTripActions } from '../hooks/useTripActions'
import { formatAdminDate, formatAdminTime } from '../utils/datetime'
import { paginate } from '../utils/list'
import { tripDisplayStatus } from '../utils/trip'
import CompanyAvatar from '../components/companies/CompanyAvatar'
import DataTable from '../components/tables/DataTable'
import Pagination from '../components/tables/Pagination'
import SeatsMeter from '../components/trips/SeatsMeter'
import TripDialogs from '../components/trips/TripDialogs'
import TripRouteCell from '../components/trips/TripRouteCell'
import AdminQueryError from '../components/ui/AdminQueryError'
import FilterBar from '../components/ui/FilterBar'
import FilterSelect from '../components/ui/FilterSelect'
import PageIntro from '../components/ui/PageIntro'
import RowAction from '../components/ui/RowAction'
import SearchInput from '../components/ui/SearchInput'
import StatusBadge from '../components/ui/StatusBadge'

const WHEN = [
  { value: 'upcoming', label: 'القادمة' },
  { value: 'past', label: 'السابقة' },
  { value: 'all', label: 'الكل' },
]
const SORT = [
  { value: 'soonest', label: 'الأقرب موعداً' },
  { value: 'latest', label: 'الأبعد موعداً' },
  { value: 'price', label: 'الأعلى سعراً' },
  { value: 'booked', label: 'الأكثر حجزاً' },
]
const STATUS_LABELS = { AVAILABLE: 'متاحة', CANCELLED: 'ملغاة' }

/** `/admin/trips` — every trip with search, filters, create, edit and delete. */
export default function TripsPage() {
  const [params, update] = useListParams(TRIP_LIST_DEFAULTS)
  const tripsQuery = useAdminTrips()
  const companies = useAdminCompanies().data ?? []
  const actions = useTripActions()
  const now = useNow()
  const seatMap = useBookedSeatsByTrip()
  const list = useFilteredTrips(tripsQuery.data, params, now, seatMap)
  const page = paginate(list, params.page)

  // Status filter options come from the statuses that really exist in the data.
  const statusOptions = useMemo(() => {
    const found = [...new Set((tripsQuery.data ?? []).map((t) => t.status))]
    return [{ value: 'all', label: 'الكل' }, ...found.map((s) => ({ value: s, label: STATUS_LABELS[s] ?? s }))]
  }, [tripsQuery.data])

  const filtering = params.q !== '' || params.company !== 'all' || params.status !== 'all' || params.when !== 'upcoming'
  const companyId = params.company === 'all' ? null : Number(params.company)

  const columns = [
    { key: 'route', header: 'الرحلة', primary: true, cell: (t) => <TripRouteCell trip={t} /> },
    {
      key: 'company',
      header: 'الشركة',
      cell: (t) =>
        t.company ? (
          <span className="flex items-center gap-2">
            <CompanyAvatar company={t.company} size="sm" />
            <span className="truncate font-bold">{t.company.name}</span>
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'departure',
      header: 'الانطلاق',
      cell: (t) => (
        <span className="whitespace-nowrap">
          <strong className="block">{formatAdminDate(t.departureAt)}</strong>
          <small className="text-[10px] text-muted">
            <bdi>{formatAdminTime(t.departureAt)}</bdi> · {formatDuration(t.durationMinutes)}
          </small>
        </span>
      ),
    },
    { key: 'price', header: 'السعر', cell: (t) => <span className="font-extrabold whitespace-nowrap">{formatMoney(t.price)}</span> },
    { key: 'seats', header: 'المقاعد المحجوزة', cell: (t) => <SeatsMeter booked={bookedSeatsOf(t, seatMap)} total={t.totalSeats} /> },
    { key: 'status', header: 'الحالة', cell: (t) => <StatusBadge type="trip" value={tripDisplayStatus(t, now)} /> },
  ]

  return (
    <>
      <PageIntro
        text="كل الرحلات المسجّلة بالنظام. الأوقات معروضة بتوقيت دمشق."
        actions={
          <Button iconStart={Plus} onClick={actions.openCreate}>
            إضافة رحلة
          </Button>
        }
      />

      <FilterBar
        active={filtering}
        onClear={() => update({ q: '', company: 'all', status: 'all', when: 'upcoming' })}
        count={tripsQuery.data ? list.length : null}
      >
        <SearchInput value={params.q} onChange={(q) => update({ q })} placeholder="ابحث بالمدينة أو الشركة أو رمز الرحلة" />
        <FilterSelect label="الموعد" value={params.when} onChange={(when) => update({ when })} options={WHEN} />
        <FilterSelect
          label="الشركة"
          value={params.company}
          onChange={(company) => update({ company })}
          options={[{ value: 'all', label: 'كل الشركات' }, ...companies.map((c) => ({ value: String(c.id), label: c.name }))]}
        />
        <FilterSelect label="الحالة" value={params.status} onChange={(status) => update({ status })} options={statusOptions} />
        <FilterSelect label="الترتيب" value={params.sort} onChange={(sort) => update({ sort })} options={SORT} />
      </FilterBar>

      <AdminQueryError query={tripsQuery} />
      {!tripsQuery.isError && (
        <>
          <DataTable
            caption="الرحلات"
            columns={columns}
            rows={page.rows}
            loading={tripsQuery.isPending}
            minWidth="min-w-[900px]"
            empty={
              <EmptyState
                icon={Bus}
                title={filtering ? 'لا توجد رحلات مطابقة' : 'لا توجد رحلات قادمة'}
                text={filtering ? 'غيّر الفلاتر أو امسحها لعرض مزيد من الرحلات.' : 'أضف رحلة جديدة لتظهر للمسافرين.'}
                action={<Button iconStart={Plus} onClick={actions.openCreate}>إضافة رحلة</Button>}
              />
            }
            actions={(t) => (
              <>
                <RowAction icon={Eye} label="التفاصيل" to={`/admin/trips/${t.id}`} />
                <RowAction icon={Pencil} label="تعديل" onClick={() => actions.openEdit(t)} />
                <RowAction icon={Ban} label="إلغاء الرحلة" tone="danger" disabled={t.status === 'CANCELLED'} onClick={() => actions.askCancel(t)} />
              </>
            )}
          />
          <Pagination {...page} onChange={(p) => update({ page: p })} />
        </>
      )}

      <TripDialogs actions={actions} defaultCompanyId={companyId} />
    </>
  )
}
