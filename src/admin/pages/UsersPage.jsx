import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Ticket, Users } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { initial } from '@/utils/text'
import { useAdminBookings, useAdminUsers } from '../hooks/queries/useAdminQueries'
import { useListParams } from '../hooks/useListParams'
import { formatAdminDate } from '../utils/datetime'
import { byNumberDesc, byText, byTimeDesc, countBy, matchesQuery, paginate, sortCopy } from '../utils/list'
import DataTable from '../components/tables/DataTable'
import Pagination from '../components/tables/Pagination'
import AdminQueryError from '../components/ui/AdminQueryError'
import FilterBar from '../components/ui/FilterBar'
import FilterSelect from '../components/ui/FilterSelect'
import PageIntro from '../components/ui/PageIntro'
import RowAction from '../components/ui/RowAction'
import SearchInput from '../components/ui/SearchInput'
import StatusBadge from '../components/ui/StatusBadge'

const DEFAULTS = { q: '', role: 'all', sort: 'newest', page: '1' }
const ROLE_LABELS = { ADMIN: 'مشرف', USER: 'مسافر' }
const SORT = [
  { value: 'newest', label: 'الأحدث تسجيلاً' },
  { value: 'name', label: 'الاسم' },
  { value: 'bookings', label: 'الأكثر حجوزات' },
]

/** `/admin/users` — read-only list (the API has no create/edit/delete for users). */
export default function UsersPage() {
  const [params, update] = useListParams(DEFAULTS)
  const usersQuery = useAdminUsers()
  const bookingsQuery = useAdminBookings()

  // Bookings per user: the API count if present, else counted from GET /bookings.
  const counts = useMemo(() => countBy(bookingsQuery.data, (b) => b.userId), [bookingsQuery.data])
  const bookingsOf = (u) => u.bookingsCount ?? (bookingsQuery.data ? (counts.get(u.id) ?? 0) : null)

  const roleOptions = useMemo(() => {
    const found = [...new Set((usersQuery.data ?? []).map((u) => u.role).filter(Boolean))]
    return [{ value: 'all', label: 'الكل' }, ...found.map((r) => ({ value: r, label: ROLE_LABELS[r] ?? r }))]
  }, [usersQuery.data])

  const list = useMemo(() => {
    const filtered = (usersQuery.data ?? []).filter(
      (u) => matchesQuery(params.q, u.name, u.email, u.id) && (params.role === 'all' || u.role === params.role),
    )
    const compare = {
      newest: (a, b) => byTimeDesc((u) => u.createdAt)(a, b) || b.id - a.id,
      name: byText((u) => u.name),
      bookings: byNumberDesc((u) => u.bookingsCount ?? counts.get(u.id) ?? 0),
    }[params.sort]
    return sortCopy(filtered, compare ?? byText((u) => u.name))
  }, [usersQuery.data, params.q, params.role, params.sort, counts])

  const page = paginate(list, params.page)
  const filtering = params.q !== '' || params.role !== 'all'

  const columns = [
    {
      key: 'user',
      header: 'المستخدم',
      primary: true,
      cell: (u) => (
        <Link to={`/admin/users/${u.id}`} className="flex items-center gap-3 hover:text-primary">
          <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-dark text-[13px] font-black text-white">{initial(u.name || '؟')}</span>
          <span className="min-w-0">
            <strong className="block truncate text-[13px]">{u.name || '—'}</strong>
            <small className="block truncate text-[10px] text-muted" dir="ltr">
              <span className="block text-end">{u.email}</span>
            </small>
          </span>
        </Link>
      ),
    },
    { key: 'role', header: 'نوع الحساب', cell: (u) => <StatusBadge type="role" value={u.role} /> },
    { key: 'bookings', header: 'الحجوزات', cell: (u) => <span className="font-extrabold tabular-nums">{bookingsOf(u) ?? '—'}</span> },
    { key: 'created', header: 'تاريخ التسجيل', cell: (u) => <span className="whitespace-nowrap text-muted">{u.createdAt ? formatAdminDate(u.createdAt) : '—'}</span> },
    { key: 'id', header: 'الرقم', hideOnMobile: true, cell: (u) => <bdi className="text-muted">#{u.id}</bdi> },
  ]

  return (
    <>
      <PageIntro text="حسابات المسافرين المسجّلة. هذا القسم للعرض فقط، إذ لا تتيح واجهة الـ API إنشاء المستخدمين أو تعديلهم أو حذفهم." />
      <FilterBar active={filtering} onClear={() => update({ q: '', role: 'all' })} count={usersQuery.data ? list.length : null}>
        <SearchInput value={params.q} onChange={(q) => update({ q })} placeholder="ابحث بالاسم أو البريد الإلكتروني" />
        <FilterSelect label="النوع" value={params.role} onChange={(role) => update({ role })} options={roleOptions} />
        <FilterSelect label="الترتيب" value={params.sort} onChange={(sort) => update({ sort })} options={SORT} />
      </FilterBar>

      <AdminQueryError query={usersQuery} />
      {!usersQuery.isError && (
        <>
          <DataTable
            caption="المستخدمون"
            columns={columns}
            rows={page.rows}
            loading={usersQuery.isPending}
            minWidth="min-w-[700px]"
            empty={<EmptyState icon={Users} title={filtering ? 'لا يوجد مستخدمون مطابقون' : 'لا يوجد مستخدمون بعد'} />}
            actions={(u) => (
              <>
                <RowAction icon={Eye} label="التفاصيل" to={`/admin/users/${u.id}`} />
                <RowAction icon={Ticket} label="حجوزاته" to={`/admin/bookings?user=${u.id}`} />
              </>
            )}
          />
          <Pagination {...page} onChange={(p) => update({ page: p })} />
        </>
      )}
    </>
  )
}
