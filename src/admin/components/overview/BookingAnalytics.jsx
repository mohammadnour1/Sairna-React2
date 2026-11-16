import { ChartColumn } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { formatMoney } from '@/utils/format'
import { cn } from '@/utils/cn'
import BarList from '../charts/BarList'
import ColumnChart from '../charts/ColumnChart'
import SegmentedBar from '../charts/SegmentedBar'
import AdminCard from '../ui/AdminCard'
import AdminQueryError from '../ui/AdminQueryError'
import Figure from './Figure'

/**
 * Charts computed from GET /bookings for the selected range. While a refetch runs, the previous
 * render stays (dimmed) instead of flashing skeletons.
 *
 * @param {{ query: import('@tanstack/react-query').UseQueryResult, analytics: object, days: number }} props
 */
export default function BookingAnalytics({ query, analytics, days }) {
  if (query.isError && !query.data) return <AdminQueryError query={query} title="تعذّر تحميل الحجوزات للتحليلات" />
  if (query.isPending) {
    return (
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 max-lg:grid-cols-1">
        <Skeleton className="h-[330px] rounded-[18px]" />
        <Skeleton className="h-[330px] rounded-[18px]" />
      </div>
    )
  }

  const { series, statusParts, topRoutes, byCompany, totals } = analytics
  const empty = <EmptyState className="border-0 py-8" icon={ChartColumn} iconSize={32} title="لا توجد حجوزات في هذه الفترة" />

  return (
    <div className={cn('flex flex-col gap-5 transition-opacity', query.isFetching && 'opacity-70')}>
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 max-lg:grid-cols-1">
        <AdminCard title={days > 30 ? 'الحجوزات أسبوعياً' : 'الحجوزات يومياً'} description="حسب تاريخ إنشاء الحجز (توقيت دمشق).">
          <div className="mb-5 grid grid-cols-3 gap-4 border-b border-border pb-4">
            <Figure label="كل الحجوزات" value={totals.count.toLocaleString('en-US')} />
            <Figure label="مقاعد مؤكدة" value={totals.seats.toLocaleString('en-US')} />
            <Figure label="قيمة المؤكدة" value={formatMoney(totals.revenue)} />
          </div>
          <ColumnChart data={series} unit="حجز" labelEvery={days === 30 ? 5 : 1} caption="عدد الحجوزات في الفترة" />
        </AdminCard>

        <AdminCard title="حالة الحجوزات" description="من حجوزات الفترة المختارة.">
          {totals.count ? <SegmentedBar parts={statusParts} caption="توزيع حالات الحجوزات" /> : empty}
        </AdminCard>
      </div>

      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <AdminCard title="أكثر الخطوط حجزاً" description="عدد الحجوزات المؤكدة لكل خط.">
          {topRoutes.length ? <BarList items={topRoutes} caption="أكثر الخطوط حجزاً" /> : empty}
        </AdminCard>
        <AdminCard title="الحجوزات حسب الشركة" description="عدد الحجوزات المؤكدة لكل شركة.">
          {byCompany.length ? <BarList items={byCompany} caption="الحجوزات حسب الشركة" /> : empty}
        </AdminCard>
      </div>
    </div>
  )
}
