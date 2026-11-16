import { useMemo } from 'react'
import { Archive, Building2, Bus, Pencil, Plus, Power } from 'lucide-react'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import Tag from '@/components/ui/Tag'
import { useAdminCompanies, useAdminTrips } from '../hooks/queries/useAdminQueries'
import { useCompanyActions } from '../hooks/useCompanyActions'
import { useListParams } from '../hooks/useListParams'
import { byNumberDesc, byText, countBy, matchesQuery, paginate, sortCopy } from '../utils/list'
import CompanyAvatar from '../components/companies/CompanyAvatar'
import CompanyFormDrawer from '../components/forms/CompanyFormDrawer'
import DataTable from '../components/tables/DataTable'
import Pagination from '../components/tables/Pagination'
import AdminQueryError from '../components/ui/AdminQueryError'
import FilterBar from '../components/ui/FilterBar'
import FilterSelect from '../components/ui/FilterSelect'
import PageIntro from '../components/ui/PageIntro'
import RowAction from '../components/ui/RowAction'
import SearchInput from '../components/ui/SearchInput'
import StatusBadge from '../components/ui/StatusBadge'

const DEFAULTS = { q: '', status: 'all', sort: 'name', page: '1' }
const STATUS = [
  { value: 'all', label: 'الكل' },
  { value: 'active', label: 'فعّالة' },
  { value: 'inactive', label: 'موقوفة' },
]
const SORT = [
  { value: 'name', label: 'الاسم' },
  { value: 'trips', label: 'الأكثر رحلات' },
  { value: 'newest', label: 'الأحدث' },
]

/** `/admin/companies` — list, search, filter, create, edit, activate/deactivate, delete. */
export default function CompaniesPage() {
  const [params, update] = useListParams(DEFAULTS)
  const companiesQuery = useAdminCompanies()
  const tripsQuery = useAdminTrips()
  const actions = useCompanyActions()

  // Trips per company: from the API count when it exists, else counted from GET /trips.
  const tripCounts = useMemo(() => countBy(tripsQuery.data, (t) => t.companyId), [tripsQuery.data])
  const tripsOf = (c) => c.tripsCount ?? (tripsQuery.data ? (tripCounts.get(c.id) ?? 0) : null)

  const list = useMemo(() => {
    const filtered = (companiesQuery.data ?? []).filter(
      (c) =>
        matchesQuery(params.q, c.fullName, c.id) &&
        (params.status === 'all' || (params.status === 'active') === c.isActive),
    )
    const compare = {
      name: byText((c) => c.name),
      trips: byNumberDesc((c) => c.tripsCount ?? tripCounts.get(c.id) ?? 0),
      newest: byNumberDesc((c) => c.id),
    }[params.sort]
    return sortCopy(filtered, compare ?? byText((c) => c.name))
  }, [companiesQuery.data, params.q, params.status, params.sort, tripCounts])

  const page = paginate(list, params.page)
  const filtering = params.q !== '' || params.status !== 'all'
  const { dialog } = actions

  const columns = [
    {
      key: 'name',
      header: 'الشركة',
      primary: true,
      cell: (c) => (
        <div className="flex items-center gap-3">
          <CompanyAvatar company={c} />
          <div className="min-w-0">
            <strong className="block truncate text-[13px]">{c.name}</strong>
            <span className="flex items-center gap-1.5 text-[10px] text-muted">
              <bdi>#{c.id}</bdi>
              {c.isDemo && <Tag tone="demo">تجريبية</Tag>}
            </span>
          </div>
        </div>
      ),
    },
    { key: 'status', header: 'الحالة', cell: (c) => <StatusBadge type="company" value={c.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
    { key: 'trips', header: 'عدد الرحلات', cell: (c) => <span className="font-extrabold tabular-nums">{tripsOf(c) ?? '—'}</span> },
  ]

  return (
    <>
      <PageIntro
        text="شركات النقل التي تظهر رحلاتها للمسافرين. تختفي الشركة المؤرشفة أو الموقوفة من الموقع دون حذف سجلّها، ولا يمكن إضافة رحلات لها."
        actions={
          <Button iconStart={Plus} onClick={actions.openCreate}>
            إضافة شركة
          </Button>
        }
      />

      <FilterBar active={filtering} onClear={() => update({ q: '', status: 'all' })} count={companiesQuery.data ? list.length : null}>
        <SearchInput value={params.q} onChange={(q) => update({ q })} placeholder="ابحث باسم الشركة أو رقمها" />
        <FilterSelect label="الحالة" value={params.status} onChange={(status) => update({ status })} options={STATUS} />
        <FilterSelect label="الترتيب" value={params.sort} onChange={(sort) => update({ sort })} options={SORT} />
      </FilterBar>

      <AdminQueryError query={companiesQuery} />
      {!companiesQuery.isError && (
        <>
          <DataTable
            caption="شركات النقل"
            columns={columns}
            rows={page.rows}
            loading={companiesQuery.isPending}
            minWidth="min-w-[640px]"
            empty={
              <EmptyState
                icon={Building2}
                title={filtering ? 'لا توجد شركات مطابقة' : 'لا توجد شركات بعد'}
                text={filtering ? 'جرّب كلمة بحث أخرى أو امسح الفلاتر.' : 'أضف أول شركة نقل لتبدأ بإضافة رحلاتها.'}
                action={!filtering && <Button iconStart={Plus} onClick={actions.openCreate}>إضافة شركة</Button>}
              />
            }
            actions={(c) => (
              <>
                <RowAction icon={Bus} label="عرض رحلاتها" to={`/admin/trips?company=${c.id}`} />
                <RowAction icon={Pencil} label="تعديل" onClick={() => actions.openEdit(c)} />
                {c.isActive ? (
                  <RowAction icon={Archive} label="أرشفة" tone="danger" onClick={() => actions.askArchive(c)} />
                ) : (
                  <RowAction icon={Power} label="تفعيل" onClick={() => actions.askActivate(c)} />
                )}
              </>
            )}
          />
          <Pagination {...page} onChange={(p) => update({ page: p })} />
        </>
      )}

      {dialog?.type === 'form' && <CompanyFormDrawer key={dialog.company?.id ?? 'new'} company={dialog.company} onClose={actions.close} />}
      <ConfirmDialog
        open={dialog?.type === 'archive'}
        title={`أرشفة «${dialog?.company?.name ?? ''}»؟`}
        text="لا يحذف الخادم الشركات نهائياً، بل توقف الأرشفة الشركة وتخفيها من الموقع مع الاحتفاظ بسجلّ رحلاتها وحجوزاتها. ويمكنك إعادة تفعيلها في أي وقت."
        confirmLabel="أرشفة الشركة"
        loading={actions.busy}
        onConfirm={actions.confirm}
        onCancel={actions.close}
      />
      <ConfirmDialog
        open={dialog?.type === 'activate'}
        title={`تفعيل «${dialog?.company?.name ?? ''}»؟`}
        text="ستعود الشركة للظهور للمسافرين، ويمكنك إضافة رحلات جديدة لها."
        confirmLabel="تفعيل الشركة"
        variant="primary"
        loading={actions.busy}
        onConfirm={actions.confirm}
        onCancel={actions.close}
      />
    </>
  )
}
