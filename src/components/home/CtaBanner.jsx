import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'

/** Closing call-to-action band (reference `.cta-banner`). */
export default function CtaBanner() {
  return (
    <section className="pb-[85px] max-sm:pb-[54px]">
      <div className="site-container">
        <div className="relative flex items-center justify-between gap-[30px] overflow-hidden rounded-3xl bg-[linear-gradient(105deg,#0e4653,#0b756e)] px-[60px] py-[39px] text-white max-sm:flex-col max-sm:items-start max-sm:gap-[22px] max-sm:px-6 max-sm:py-[29px]">
          <div>
            <Eyebrow tone="onDark">جاهز تغير جو؟</Eyebrow>
            <h2 className="mt-3 mb-0.5 text-[31px] max-sm:text-[25px]">الطريق الجاي بيناديك.</h2>
            <p className="m-0 text-[#d4edeb]">دوّر على رحلة، واحجز أول مقعد إلك.</p>
          </div>
          <Button to="/results" variant="white" iconEnd={ArrowLeft} iconSize={18} className="relative z-2">
            يلا نلاقي رحلة
          </Button>
          <div className="pointer-events-none absolute end-[22%] -top-[140px] size-[230px] rounded-full border border-white/12" aria-hidden="true" />
          <div className="pointer-events-none absolute start-[30%] -bottom-[360px] size-[430px] rounded-full border border-white/12" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
