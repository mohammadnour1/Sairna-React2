import { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useMapLibre } from '@/hooks/useMapLibre'
import { googleDirectionsUrl, googleEmbedUrl, interpolate, midpoint } from '@/utils/geo'
import { cn } from '@/utils/cn'

/**
 * Route between two cities on an OpenFreeMap basemap (MapLibre), with a Google Maps
 * embed fallback. In `full` mode a bus marker follows `progress` (0–1).
 *
 * @param {{ origin: { name:string, lat:number|null, lng:number|null }, destination: object,
 *           mode?: 'preview'|'full', progress?: number, className?: string, label?: string }} props
 */
export default function RouteMap({ origin, destination, mode = 'preview', progress = 0.48, className, label }) {
  const containerRef = useRef(null)
  const { status, busMarkerRef } = useMapLibre(containerRef, { origin, destination, mode, initialProgress: progress })

  // Move the bus without touching the map instance.
  useEffect(() => {
    if (mode !== 'full' || !busMarkerRef.current) return
    const p = interpolate(origin, destination, progress)
    busMarkerRef.current.setLngLat([p.lng, p.lat])
  }, [mode, progress, origin, destination, busMarkerRef, status])

  const canEmbed = Number.isFinite(origin?.lat) && Number.isFinite(destination?.lat)
  const fallbackSrc = canEmbed
    ? googleEmbedUrl(midpoint(origin, destination))
    : `https://maps.google.com/maps?q=${encodeURIComponent(`${origin?.name}, Syria`)}&z=7&output=embed`

  return (
    <div
      dir="ltr"
      role="region"
      aria-label={label ?? `خريطة تفاعلية من ${origin?.name} إلى ${destination?.name}`}
      className={cn('isolate overflow-hidden bg-[#e6efeb]', className)}
    >
      {/* maplibre-gl.css forces `position: relative` on this element, so it is sized with h/w-full. */}
      <div ref={containerRef} className="size-full" />
      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center bg-[#e7f0eb] p-5 text-center font-[Cairo,sans-serif] text-[13px] font-bold text-[#285463]">
          يتم تحميل الخريطة التفاعلية...
        </div>
      )}
      {status === 'fallback' && (
        <>
          <iframe
            title={`Google Maps - ${origin?.name} إلى ${destination?.name}`}
            src={fallbackSrc}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 z-2 block size-full min-h-full border-0"
          />
          <a
            href={googleDirectionsUrl(origin, destination)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 bottom-3 z-5 rounded-[9px] bg-white px-3 py-[7px] text-[11px] leading-[1.7] font-extrabold text-[#0c5962] shadow-[0_4px_15px_rgba(12,49,58,.14)] hover:bg-[#e9fbf7] hover:text-[#078b80] max-sm:right-[9px] max-sm:bottom-[9px] max-sm:px-2 max-sm:py-[5px] max-sm:text-[10px]"
          >
            فتح المسار في Google Maps ↗
          </a>
        </>
      )}
    </div>
  )
}
