import { ShieldCheck, Sparkles, Ticket } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import SmartImage from '@/components/ui/SmartImage'

/** Dark teal side panel with the Damascus photo (reference `.auth-visual`). */
export default function AuthVisual() {
  return (
    <div className="auth-ring relative flex flex-col overflow-hidden bg-[linear-gradient(165deg,#123e51_0%,#1b7176_100%)] px-[35px] py-[42px] text-white max-sm:order-first max-sm:min-h-[300px] max-sm:p-[25px]">
      <div className="relative z-2">
        <span className="inline-flex items-center gap-2 rounded-[30px] bg-white/12 px-3.5 py-1.5 text-[11px] font-extrabold">
          <Icon icon={Sparkles} size={18} /> عالم جديد بانتظارك
        </span>
        <h2 className="mt-[25px] mb-1 text-[40px] leading-[1.55] text-white max-md:text-[28px] max-sm:mt-[15px] max-sm:mb-0 max-sm:text-[27px] max-sm:leading-[1.35]">
          كل الطرق <br /> بتوصّل لذكريات.
        </h2>
        <p className="text-xs text-[#d7f0eb] max-sm:m-0">ومن أول محطة رح نكون معك.</p>
      </div>
      <SmartImage
        photoKey="damascus"
        alt="الجامع الأموي في دمشق"
        className="relative mx-[-2.5%] my-auto aspect-[1.45] max-h-[300px] w-[105%] max-w-none -rotate-4 rounded-[17px] object-cover object-center shadow-[0_22px_46px_rgba(0,0,0,.18)] max-md:mx-[-2%] max-sm:absolute max-sm:end-[11px] max-sm:bottom-[15px] max-sm:m-0 max-sm:max-h-[190px] max-sm:w-[52%]"
      />
      <div className="relative mt-[30px] flex items-center gap-[22px] text-[11px] max-sm:hidden">
        <span className="flex items-center gap-[7px]">
          <Icon icon={ShieldCheck} size={19} /> سهل وواضح
        </span>
        <span className="flex items-center gap-[7px]">
          <Icon icon={Ticket} size={19} /> حجز بخطوات بسيطة
        </span>
      </div>
    </div>
  )
}
