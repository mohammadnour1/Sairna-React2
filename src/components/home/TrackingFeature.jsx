import { ArrowLeft, CircleCheck, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Icon from '@/components/ui/Icon'
import RouteMap from '@/components/common/RouteMap'
import { findCityGeo } from '@/data/cityGeo'
import { DEFAULT_DESTINATION_NAME, DEFAULT_ORIGIN_NAME, TRACKING_FEATURES } from '@/data/homeContent'
import { findCityByName } from '@/hooks/useTripSearch'

/**
 * Tracking teaser with a non-interactive map preview حلب → دمشق (reference `.split-feature`).
 * @param {{ cities: object[]|undefined }} props
 */
export default function TrackingFeature({ cities }) {
  const origin = findCityByName(cities, DEFAULT_ORIGIN_NAME) ?? findCityGeo({ name: DEFAULT_ORIGIN_NAME })
  const destination = findCityByName(cities, DEFAULT_DESTINATION_NAME) ?? findCityGeo({ name: DEFAULT_DESTINATION_NAME })

  return (
    <section className="py-[86px] max-sm:py-[58px]">
      <div className="site-container">
        <div className="grid min-h-[435px] grid-cols-[.9fr_1.1fr] overflow-hidden rounded-[28px] border border-border bg-surface max-md:grid-cols-2 max-sm:grid-cols-1">
          <div className="px-[52px] py-[50px] max-md:px-[29px] max-md:py-9 max-sm:px-6 max-sm:py-8">
            <Eyebrow>وين وصلت الرحلة؟</Eyebrow>
            <h2 className="mt-3 mb-1.5 text-[clamp(25px,3vw,36px)] leading-[1.65] tracking-[-.6px] max-sm:text-[29px]">
              الطريق قدامك.
              <br />
              <span className="text-primary">لحظة بلحظة؟</span>
            </h2>
            <p className="mt-[15px] mb-[18px] text-[13px] leading-[2.15]">
              بصفحة التتبّع بتشوف خط سير الرحلة ومحطاتها وحالتها ضمن نموذج تفاعلي سهل وواضح.
            </p>
            {TRACKING_FEATURES.map((feature) => (
              <div key={feature} className="mb-[11px] flex items-center gap-2.5 text-xs font-extrabold">
                <Icon icon={CircleCheck} size={18} className="text-primary" /> {feature}
              </div>
            ))}
            <Button to="/tracking" iconEnd={ArrowLeft} iconSize={18} className="mt-[19px]">
              جرّب تتبّع رحلة
            </Button>
            <small className="mt-[13px] block text-[9px] text-muted">* الخريطة وحركة الحافلة في هذا النموذج توضيحية وليست GPS مباشر.</small>
          </div>

          <div className="relative flex flex-col justify-center bg-[#f0f6f3] p-7 max-md:p-[17px] max-sm:p-[15px]">
            <div className="relative z-1 mb-[15px] flex items-center gap-2 text-xs font-extrabold text-[#215467]">
              <span className="size-[9px] rounded-full bg-[#13b58d] shadow-[0_0_0_5px_rgba(16,180,141,.13)]" aria-hidden="true" />
              معاينة مسار رحلة <b className="ms-auto">{origin.name} ← {destination.name}</b>
            </div>
            <RouteMap
              origin={origin}
              destination={destination}
              mode="preview"
              label={`خريطة تفاعلية بين ${origin.name} و${destination.name}`}
              className="relative h-[280px] w-full rounded-[18px] max-sm:h-[230px]"
            />
            <div className="relative z-1 mt-[15px] flex items-center gap-5 text-[11px] font-black text-[#235666]">
              <span className="flex items-center gap-[5px]">
                <Icon icon={MapPin} size={15} /> {origin.name}
              </span>
              <div className="relative h-0.5 flex-1 bg-[#b1dbce]" aria-hidden="true">
                <span className="absolute start-[48%] -top-1 size-2.5 rounded-full bg-[#15ac99]" />
              </div>
              <span className="flex items-center gap-[5px]">
                <Icon icon={MapPin} size={15} /> {destination.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
