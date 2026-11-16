import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * "حلب ← دمشق" + trip code, linking to the trip details page.
 * @param {{ trip: object, linked?: boolean }} props
 */
export default function TripRouteCell({ trip, linked = true }) {
  const route = (
    <span className="flex items-center gap-1.5 font-extrabold">
      {trip.origin?.name || '—'}
      <Icon icon={ArrowLeft} size={14} className="shrink-0 text-primary" />
      {trip.destination?.name || '—'}
    </span>
  )
  return (
    <div className="min-w-0">
      {linked ? (
        <Link to={`/admin/trips/${trip.id}`} className="hover:text-primary">
          {route}
        </Link>
      ) : (
        route
      )}
      <small className="block text-[10px] text-muted" dir="ltr">
        <span className="block text-end">{trip.code ?? `#${trip.id}`}</span>
      </small>
    </div>
  )
}
