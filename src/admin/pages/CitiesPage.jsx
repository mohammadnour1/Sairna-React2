import { useMemo } from 'react'
import { Bus, MapPin } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { useAdminCities, useAdminTrips } from '../hooks/queries/useAdminQueries'
import { useListParams } from '../hooks/useListParams'
import { byNumberDesc, byText, matchesQuery, paginate, sortCopy } from '../utils/list'
import DataTable from '../components/tables/DataTable'
import Pagination from '../components/tables/Pagination'
import AdminQueryError from '../components/ui/AdminQueryError'
import FilterBar from '../components/ui/FilterBar'
import FilterSelect from '../components/ui/FilterSelect'
import PageIntro from '../components/ui/PageIntro'
import RowAction from '../components/ui/RowAction'
import SearchInput from '../components/ui/SearchInput'

const DEFAULTS = { q: '', sort: 'name', page: '1' }
const SORT = [
  { value: 'name', label: 'الاسم' },
  { value: 'departures', label: 'الأكثر انطلاقاً' },
  { value: 'arrivals', label: 'الأكثر وصولاً' },
]
const coord = (v) => (v == null ? '—' : v.toFixed(4))

/** `/admin/cities` — read-only (GET /cities only). Trip counts are computed from GET /trips. */
export default function CitiesPage() {
  const [params, update] = useListParams(DEFAULTS)
  const citiesQuery = useAdminCities()
  const tripsQuery = useAdminTrips()

  const stats = useMemo(() => {
    const map = new Map()
    for (const t of tripsQuery.data ?? []) {
      const o = map.get(t.originId) ?? { out: 0, in: 0 }
      o.out += 1
      map.set(t.originId, o)
      const d = map.get(t.destinationId) ?? { out: 0, in: 0 }
      d.in += 1
      map.set(t.destinationId, d)
    }
    return map
  }, [tripsQuery.data])
  const statOf = (c, key) => (tripsQuery.data ? (stats.get(c.id)?.[key] ?? 0) : null)

  const list = useMemo(() => {
    const filtered = (citiesQuery.data ?? []).filter((c) => matchesQuery(params.q, c.name, c.slug, c.id))
    const compare = {
      name: byText((c) => c.name),
      departures: byNumberDesc((c) => stats.get(c.id)?.out ?? 0),
      arrivals: byNumberDesc((c) => stats.get(c.id)?.in ?? 0),
    }[params.sort]
    return sortCopy(filtered, compare ?? byText((c) => c.name))
  }, [citiesQuery.data, params.q, params.sort, stats])
  const page = paginate(list, params.page)

  const columns = [
    {
      key: 'name',
      header: 'المدينة',
      primary: true,
      cell: (c) => (
        <span className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[11px] bg-soft-teal text-primary-deep dark:text-primary">
            <MapPin size={17} aria-hidden="true" />
          </span>
          <span>
            <strong className="block text-[13px]">{c.name}</strong>
            <bdi className="text-[10px] text-muted">#{c.id}</bdi>
          </span>
        </span>
      ),
    },
    { key: 'out', header: 'رحلات انطلاق', cell: (c) => <span className="font-extrabold tabular-nums">{statOf(c, 'out') ?? '—'}</span> },
    { key: 'in', header: 'رحلات وصول', cell: (c) => <span className="font-extrabold tabular-nums">{statOf(c, 'in') ?? '—'}</span> },
    {
      key: 'coords',
      header: 'الإحداثيات',
      cell: (c) => (
        <span dir="ltr" className="text-[11px] text-muted tabular-nums">
          {coord(c.latitude)}, {coord(c.longitude)}
        </span>
      ),
    },
  ]

  return (
    <>
      <PageIntro text="المحافظات المتاحة للرحلات. هذا القسم للعرض فقط، إذ لا تتيح واجهة الـ API إضافة المدن أو تعديلها. عدد الرحلات محسوب من قائمة الرحلات." />
      <FilterBar active={params.q !== ''} onClear={() => update({ q: '' })} count={citiesQuery.data ? list.length : null}>
        <SearchInput value={params.q} onChange={(q) => update({ q })} placeholder="ابحث باسم المدينة" />
        <FilterSelect label="الترتيب" value={params.sort} onChange={(sort) => update({ sort })} options={SORT} />
      </FilterBar>
      <AdminQueryError query={citiesQuery} />
      {!citiesQuery.isError && (
        <>
          <DataTable
            caption="المدن"
            columns={columns}
            rows={page.rows}
            loading={citiesQuery.isPending}
            minWidth="min-w-[600px]"
            empty={<EmptyState icon={MapPin} title="لا توجد مدن مطابقة" />}
            actions={(c) => <RowAction icon={Bus} label="الرحلات منها" to={`/admin/trips?q=${encodeURIComponent(c.name)}&when=all`} />}
          />
          <Pagination {...page} onChange={(p) => update({ page: p })} />
        </>
      )}
    </>
  )
}
