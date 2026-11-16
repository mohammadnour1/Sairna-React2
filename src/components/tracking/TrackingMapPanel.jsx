import { Globe, MapPin, Route } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import RouteMap from '@/components/common/RouteMap'
import { googleDirectionsUrl } from '@/utils/geo'

const chip =
  'flex items-center gap-[9px] rounded-[11px] border border-[rgba(10,60,70,.1)] bg-white px-3.5 py-2.5 text-[11px] font-extrabold text-[#224457] shadow-[0_8px_22px_rgba(15,64,75,.07)] max-sm:p-2 max-sm:text-[9px]'

/**
 * Full interactive map with overlays (reference `.tracking-map-panel`).
 * The map instance is created once; only the bus marker moves with `progress`.
 * @param {{ trip: object, progress: number }} props
 */
export default function TrackingMapPanel({ trip, progress }) {
  const { origin, destination } = trip
  return (
    <div className="relative min-h-[650px] min-w-0 overflow-hidden rounded-[19px] border border-border bg-[#e5f0eb] max-md:h-[500px] max-md:min-h-0 max-sm:h-[440px] max-sm:min-h-[440px]">
      <div className="pointer-events-none absolute inset-x-[17px] top-[17px] z-450 flex items-center justify-between gap-2.5 max-sm:inset-x-2.5 max-sm:top-2.5">
        <div className={chip}>
          <span className="size-[9px] rounded-full bg-[#13b58d] shadow-[0_0_0_5px_rgba(16,180,141,.13)]" aria-hidden="true" />
          OpenFreeMap · خريطة تفاعلية
        </div>
        <div className={`${chip} text-[10px] max-sm:hidden`}>
          <span className="flex items-center gap-[5px]">
            <Icon icon={Globe} size={16} /> عرض الخريطة
          </span>
        </div>
      </div>

      <RouteMap origin={origin} destination={destination} mode="full" progress={progress} className="absolute inset-0 z-1" />

      <div className="absolute inset-x-[17px] bottom-[68px] z-450 flex flex-wrap items-center gap-2 max-sm:inset-x-2.5 max-sm:bottom-[62px]">
        <a
          href={googleDirectionsUrl(origin, destination)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-2.5 rounded-[10px] border border-[#d6e8e8] bg-white px-[15px] py-2 text-xs font-extrabold text-[#114054] shadow-[0_5px_18px_rgba(12,45,55,.12)] transition-transform duration-250 hover:-translate-y-[3px] hover:bg-[#e7fff9] max-sm:px-2.5 max-sm:py-[7px] max-sm:text-[10px]"
        >
          <Icon icon={Route} size={17} /> عرض الطرق في Google Maps
        </a>
      </div>

      <div className="pointer-events-none absolute inset-x-[17px] bottom-[17px] z-450 flex items-center justify-between gap-[7px] max-sm:inset-x-[9px] max-sm:bottom-[9px]">
        <span className="inline-flex items-center gap-[5px] rounded-[9px] bg-white px-3 py-2 text-[10px] font-extrabold text-[#1d4a56] shadow-[0_6px_20px_rgba(0,0,0,.05)]">
          <Icon icon={MapPin} size={17} /> {origin.name} ← {destination.name}
        </span>
        <span className="inline-flex items-center gap-[5px] rounded-[9px] bg-white px-3 py-2 text-[9px] font-bold text-[#83989f] shadow-[0_6px_20px_rgba(0,0,0,.05)] max-sm:hidden">
          المسار تقريبي · افتح Google Maps للاتجاهات الفعلية
        </span>
      </div>
    </div>
  )
}
