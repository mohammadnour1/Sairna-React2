import Icon from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

const iconTones = ['bg-soft-teal text-primary', 'bg-[#fff4e4] text-[#e4a34c]', 'bg-[#eaf1ff] text-[#5988d1]']

/**
 * One of the 3 "how it works" cards (reference `.process-card`).
 * @param {{ index: number, icon: import('react').ComponentType, number: string, title: string, text: string }} props
 */
export default function ProcessCard({ index, icon, number, title, text }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-border bg-surface p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-[7px] hover:shadow-card-md max-md:p-[22px] max-sm:grid max-sm:grid-cols-[50px_1fr] max-sm:gap-x-[15px] max-sm:gap-y-0.5 max-sm:p-5">
      <span className="absolute end-[25px] top-3.5 text-[54px] leading-none font-black text-border max-sm:end-5 max-sm:top-0" aria-hidden="true">
        {number}
      </span>
      <div
        className={cn(
          'mb-[21px] grid size-[60px] place-items-center rounded-[18px] max-sm:row-[1/3] max-sm:m-0 max-sm:size-12 max-sm:rounded-[13px]',
          iconTones[index % iconTones.length],
        )}
      >
        <Icon icon={icon} size={28} className="max-sm:w-6" />
      </div>
      <h3 className="mt-0 mb-2 text-lg max-sm:m-0 max-sm:text-[15px]">{title}</h3>
      <p className="m-0 text-xs leading-[2] max-sm:text-[11px]">{text}</p>
    </div>
  )
}
