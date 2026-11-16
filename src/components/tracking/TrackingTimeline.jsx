import { Bus, Check, MapPin } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { formatTime } from '@/utils/format'
import { cn } from '@/utils/cn'

function Stop({ icon, title, subtitle, time, done = true, active = false }) {
  return (
    <li className="relative mb-[29px] flex items-start gap-3 last:mb-0">
      <span
        className={cn(
          'relative z-2 grid size-[31px] flex-[0_0_31px] place-items-center rounded-full border-[3px] border-surface',
          done ? 'bg-primary text-white' : 'bg-surface-alt text-muted',
        )}
      >
        <Icon icon={icon} size={13} />
      </span>
      <div className="flex flex-col">
        <b className="text-xs">{title}</b>
        <small className="text-[10px] text-muted" aria-live={active ? 'polite' : undefined}>
          {subtitle}
        </small>
      </div>
      <time className={cn('ms-auto text-[10px] whitespace-nowrap', active ? 'font-black text-primary' : 'text-muted')}>{time}</time>
    </li>
  )
}

/**
 * Origin → on the road → destination (reference `.track-timeline`).
 * @param {{ trip: object, status: string, arrived: boolean }} props
 */
export default function TrackingTimeline({ trip, status, arrived }) {
  return (
    <ol className="track-timeline relative mt-[25px] mb-[18px]">
      <Stop icon={Check} title={trip.origin.name} subtitle="محطة الانطلاق" time={formatTime(trip.departureTime)} />
      <Stop icon={Bus} title="على الطريق" subtitle={status} time="الآن*" active={!arrived} />
      <Stop
        icon={arrived ? Check : MapPin}
        title={trip.destination.name}
        subtitle="محطة الوصول"
        time={formatTime(trip.arrivalTime)}
        done={arrived}
        active={arrived}
      />
    </ol>
  )
}
