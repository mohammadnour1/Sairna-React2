import { ArrowLeft } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import SmartImage from '@/components/ui/SmartImage'

/**
 * Photo card that starts a search to this city (reference `.destination-card`).
 * @param {{ name: string, description: string, photoKey: string, onSelect: () => void }} props
 */
export default function DestinationCard({ name, description, photoKey, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`ابحث عن رحلات إلى ${name}`}
      className="group relative block aspect-[.87] overflow-hidden rounded-[19px] border-0 bg-[linear-gradient(140deg,#23586a,#769f99)] p-0 text-start shadow-card transition-[transform,box-shadow] duration-350 ease-[ease] hover:-translate-y-[7px] hover:shadow-card-md max-md:aspect-[1.35] max-sm:aspect-[.98] max-sm:rounded-2xl"
    >
      <SmartImage
        photoKey={photoKey}
        alt={`صورة من ${name} في سوريا`}
        className="absolute inset-0 size-full object-cover saturate-[1.06] transition-transform duration-550 group-hover:scale-[1.09]"
      />
      <span className="absolute inset-0 flex items-end justify-between bg-[linear-gradient(0deg,rgba(7,35,48,.87)_0%,rgba(7,35,48,.25)_59%,rgba(7,35,48,.03)_86%)] p-5 text-white max-sm:p-[13px]">
        <span className="flex flex-col">
          <strong className="text-[21px] max-sm:text-lg">{name}</strong>
          <small className="text-[11px] opacity-82 max-sm:text-[9px]">{description}</small>
        </span>
        <span className="grid size-[39px] place-items-center rounded-full border border-white/40 bg-white/19 transition-all duration-250 group-hover:-translate-x-1 group-hover:bg-primary max-sm:size-[30px]">
          <Icon icon={ArrowLeft} size={18} />
        </span>
      </span>
    </button>
  )
}
