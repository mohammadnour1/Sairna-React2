import { Armchair, Building2, Bus, ChartColumn, MapPin, Ticket, Users, Wallet } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { formatMoney } from '@/utils/format'
import AdminQueryError from '../ui/AdminQueryError'
import StatCard from './StatCard'

const ICONS = { users: Users, companies: Building2, trips: Bus, bookings: Ticket, cities: MapPin, seats: Armchair, money: Wallet, other: ChartColumn }

const format = (m) => (m.kind === 'money' ? formatMoney(m.value) : m.value.toLocaleString('en-US'))

/**
 * Stat tiles for EVERY numeric value returned by GET /overview (known keys first).
 * Nothing is added that the API did not send.
 * @param {{ query: import('@tanstack/react-query').UseQueryResult }} props
 */
export default function MetricsGrid({ query }) {
  if (query.isError && !query.data) return <AdminQueryError query={query} title="تعذّر تحميل ملخص النظرة العامة" className="mb-5" />

  const metrics = query.data?.metrics ?? []
  const ordered = [...metrics.filter((m) => m.known), ...metrics.filter((m) => !m.known)]

  if (query.data && !ordered.length) {
    return <EmptyState className="mb-5 py-10" icon={ChartColumn} title="لا توجد أرقام في ملخص الخادم" text="لا يتضمّن ردّ GET /overview قيماً رقمية للعرض." />
  }

  return (
    <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 max-xs:grid-cols-1">
      {query.isPending
        ? Array.from({ length: 4 }, (_, i) => <StatCard key={i} label="..." icon={ChartColumn} value="" loading />)
        : ordered.map((m) => <StatCard key={m.id} label={m.label} value={format(m)} icon={ICONS[m.kind] ?? ChartColumn} hint={m.known ? undefined : 'قيمة من الخادم'} />)}
    </div>
  )
}
