import { ArrowLeft } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import CompanyLogo from '@/components/common/CompanyLogo'
import { formatDate, formatTime } from '@/utils/format'

/**
 * "من X ← إلى Y" + company row (reference `.track-route-heading` + `.track-company`).
 * @param {{ trip: object }} props
 */
export default function TrackRouteHeading({ trip }) {
  return (
    <>
      <div className="my-[25px] flex items-center justify-between gap-3 max-md:col-span-full">
        <div>
          <small className="text-[11px] text-muted">من</small>
          <h2 className="my-0.5 text-[22px]">{trip.origin.name}</h2>
        </div>
        <span className="text-primary">
          <Icon icon={ArrowLeft} size={21} />
        </span>
        <div>
          <small className="text-[11px] text-muted">إلى</small>
          <h2 className="my-0.5 text-[22px]">{trip.destination.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-[9px] max-md:col-span-full">
        <CompanyLogo company={trip.company} />
        <div className="flex flex-col">
          <b className="text-xs">{trip.company.name}</b>
          <small className="text-[10px] text-muted">
            موعد الانطلاق {formatTime(trip.departureTime)} · {formatDate(trip.date)}
          </small>
        </div>
      </div>
    </>
  )
}
