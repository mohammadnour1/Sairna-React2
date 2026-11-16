import { CalendarX, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import QueryState from '@/components/common/QueryState'
import TripCard from './TripCard'
import TripCardSkeleton from './TripCardSkeleton'

/**
 * Trip cards with loading / error / empty states.
 * Two different empty states: nothing on this route+date vs. filters hide everything.
 *
 * @param {{ query: object, trips: object[], total: number, people: number, onClearFilters: () => void }} props
 */
export default function TripList({ query, trips, total, people, onClearFilters }) {
  return (
    <div className="flex min-w-0 flex-col gap-[15px]">
      <QueryState
        query={query}
        loading={Array.from({ length: 3 }, (_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      >
        {() =>
          total === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="ما في رحلات بهالتاريخ"
              text="جرّب تاريخ تاني أو غيّر محافظة الانطلاق أو الوصول."
            />
          ) : trips.length === 0 ? (
            <EmptyState
              icon={Search}
              title="ما في رحلات مطابقة"
              text="جرّب تغيّر الشركة أو وقت الانطلاق."
              action={<Button onClick={onClearFilters}>عرض كل الرحلات</Button>}
            />
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} people={people} />)
          )
        }
      </QueryState>
    </div>
  )
}
