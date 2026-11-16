import { MapPin, ShieldCheck } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import SmartImage from '@/components/ui/SmartImage'

const statBase =
  'floating-stat pointer-events-none absolute z-2 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-[#114252] shadow-[0_15px_28px_rgba(15,61,69,.17)] max-md:p-[9px] max-xs:p-1.5'
const statTitle = 'text-xs max-md:text-[10px] max-xs:text-[9px]'
const statSub = 'text-[10px] text-[#7e9299] max-md:text-[9px] max-xs:text-[8px]'

/**
 * Hero photo with caption and two floating stat cards (reference `.hero-visual`).
 * @param {{ cityCount: number|null }} props
 */
export default function HeroVisual({ cityCount }) {
  return (
    <div className="relative min-w-0 py-[18px] ps-5 pe-0 max-md:p-0 max-sm:mx-3.5 max-sm:mt-[22px] max-sm:mb-1.5">
      <div className="hero-image-tint relative isolate min-h-80 -rotate-[1.5deg] rounded-[30px] bg-[#d4e4e5] shadow-[0_30px_70px_rgba(10,62,70,.15)] max-sm:min-h-0 max-sm:rotate-0">
        <SmartImage
          photoKey="hero"
          alt="صورة حقيقية للجامع الأموي في دمشق"
          loading="eager"
          fetchPriority="high"
          className="block aspect-[1.45] w-full rounded-[30px] object-cover object-center saturate-[1.03] max-sm:aspect-[1.48] max-sm:rounded-[20px]"
        />
        <span className="absolute end-[18px] bottom-[17px] z-1 rounded-lg bg-[rgba(12,43,53,.72)] px-[11px] py-[5px] text-[10px] font-bold text-white max-sm:end-[11px] max-sm:bottom-[11px] max-sm:text-[9px]">
          صورة حقيقية من دمشق
        </span>

        <div className={`${statBase} top-9 -end-[26px] max-md:-end-3 max-sm:top-[17px] max-xs:-end-[7px]`}>
          <Icon icon={MapPin} size={18} className="text-primary" />
          <div className="flex flex-col whitespace-nowrap">
            <b className={statTitle}>{cityCount ?? '—'} محافظة</b>
            <small className={statSub}>وجهات بتجمعنا</small>
          </div>
        </div>

        <div className={`${statBase} stat-bottom bottom-[45px] -start-[22px] max-md:-start-3 max-sm:bottom-[13px] max-sm:-start-[13px] max-xs:-start-2`}>
          <span className="grid size-10 place-items-center rounded-xl bg-[#e6f9f4] text-[#0ca88f] max-sm:size-8">
            <Icon icon={ShieldCheck} size={20} />
          </span>
          <div className="flex flex-col whitespace-nowrap">
            <b className={statTitle}>سافر براحة</b>
            <small className={statSub}>من أول حجز لآخر محطة</small>
          </div>
        </div>
      </div>
      <div className="absolute -end-[62px] -top-[35px] -z-1 size-[220px] rounded-full border-[1.5px] border-dashed border-[#99d6cc]" />
      <div className="absolute bottom-0 -start-[50px] -z-1 size-[150px] rounded-full border-[1.5px] border-dashed border-[#99d6cc]" />
    </div>
  )
}
