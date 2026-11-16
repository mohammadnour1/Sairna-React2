import InfoNote from '@/components/ui/InfoNote'
import ProgressBar from '@/components/ui/ProgressBar'
import TrackingControls from './TrackingControls'
import TrackingQuickStats from './TrackingQuickStats'
import TrackingStatus from './TrackingStatus'
import TrackingTimeline from './TrackingTimeline'
import TrackRouteHeading from './TrackRouteHeading'

/**
 * Left column: status, route, progress, timeline, stats and controls (reference `.tracking-sidebar`).
 * @param {{ booking: object, sim: ReturnType<import('@/hooks/useTrackingSimulation').useTrackingSimulation> }} props
 */
export default function TrackingSidebar({ booking, sim }) {
  const { trip } = booking
  const percent = Math.round(sim.progress * 100)
  return (
    <aside className="rounded-[19px] border border-border bg-surface p-[22px] max-md:grid max-md:grid-cols-2 max-md:gap-x-[25px] max-md:gap-y-3 max-sm:block max-sm:p-[19px]">
      <TrackingStatus arrived={sim.arrived} code={booking.code} />
      <TrackRouteHeading trip={trip} />
      <div className="my-[22px] border-t border-dashed border-border max-md:col-span-full max-md:my-1 max-sm:my-[17px]" />
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="m-0 text-[13px]">تقدّم الرحلة</h3>
          <strong className="text-[13px] text-primary">{percent}%</strong>
        </div>
        <ProgressBar value={sim.progress} label="تقدّم الرحلة" />
        <TrackingTimeline trip={trip} status={sim.status} arrived={sim.arrived} />
      </div>
      <div>
        <TrackingQuickStats
          distanceKm={trip.estimatedKm}
          distanceIsEstimate={trip.distanceKm == null}
          remainingMinutes={sim.remainingMinutes}
          durationIsEstimate={sim.durationIsEstimate}
          arrived={sim.arrived}
        />
        <TrackingControls playing={sim.playing} onToggle={sim.toggle} onReset={sim.reset} />
      </div>
      <InfoNote variant="warning" as="p" className="max-md:col-span-full">
        هذه محاكاة تعليمية فوق خريطة جغرافية حقيقية، وليست تتبع GPS. خط الربط بين المدن تقريبي؛ افتح Google Maps لمعرفة الطرق الفعلية.
      </InfoNote>
    </aside>
  )
}
