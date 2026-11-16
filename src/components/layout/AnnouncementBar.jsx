import { Sparkles } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/** Thin dark strip above the header (reference `.announcement`). */
export default function AnnouncementBar() {
  return (
    <div className="flex min-h-8 items-center justify-center gap-[9px] bg-dark-deep text-[10px] font-bold tracking-[.1px] text-[#d4f2ec] max-sm:px-3 max-sm:py-[5px] max-sm:text-center max-sm:text-[9px]">
      <span className="size-1.5 rounded-full bg-[#58d7bb] shadow-[0_0_0_4px_rgba(88,215,187,.12)]" aria-hidden="true" />
      رحلات بين المدن السورية، بخطوات بسيطة وواضحة
      <span className="inline-flex items-center justify-center text-[#ffce87]">
        <Icon icon={Sparkles} size={13} />
      </span>
    </div>
  )
}
