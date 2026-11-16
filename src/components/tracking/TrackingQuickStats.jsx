import { Clock, Route } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { formatDuration } from '@/utils/format'

/**
 * Distance + remaining time boxes (reference `.track-quick-stats`).
 * @param {{ distanceKm: number|null, distanceIsEstimate: boolean, remainingMinutes: number|null,
 *           durationIsEstimate: boolean, arrived: boolean }} props
 */
export default function TrackingQuickStats({ distanceKm, distanceIsEstimate, remainingMinutes, durationIsEstimate, arrived }) {
  const remaining = arrived ? 'تم الوصول' : `${durationIsEstimate ? '~' : ''}${formatDuration(remainingMinutes)}`
  return (
    <div className="grid grid-cols-2 gap-[9px] max-md:items-end">
      <div className="flex flex-col rounded-[11px] border border-border p-[13px]">
        <span className="flex items-center gap-1.5 text-[10px] text-muted">
          <Icon icon={Route} size={16} /> المسافة الكلية
        </span>
        <b className="mt-[5px] text-base">{distanceKm == null ? '—' : `${distanceIsEstimate ? '~' : ''}${distanceKm} كم`}</b>
      </div>
      <div className="flex flex-col rounded-[11px] border border-border p-[13px]">
        <span className="flex items-center gap-1.5 text-[10px] text-muted">
          <Icon icon={Clock} size={16} /> المتبقي التقديري
        </span>
        <b className="mt-[5px] text-base">{remaining}</b>
      </div>
    </div>
  )
}
