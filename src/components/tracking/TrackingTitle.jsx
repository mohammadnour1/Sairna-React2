import { ArrowRight, Navigation } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Icon from '@/components/ui/Icon'

/** Title row of the tracking page (reference `.tracking-title`). */
export default function TrackingTitle() {
  return (
    <section className="site-container flex items-end justify-between gap-5 pt-[29px] pb-[25px] max-sm:flex-col max-sm:items-start">
      <div>
        <Breadcrumb spacing="mb-[17px]" items={[{ label: 'الرئيسية', to: '/' }, { label: 'حجوزاتي', to: '/trips' }, { label: 'تتبّع الرحلة' }]} />
        <Eyebrow>تابع الطريق</Eyebrow>
        <h1 className="mt-2.5 mb-0 flex flex-wrap items-center gap-[17px] text-[29px] max-sm:text-[25px] max-xs:text-[22px]">
          رحلتك قدام عيونك
          <span className="inline-flex items-center gap-[5px] rounded-[50px] border border-[#a0e6c7] bg-[#e8fff4] px-[11px] py-1.5 text-[10px] tracking-normal text-primary">
            <Icon icon={Navigation} size={15} /> محاكاة تفاعلية
          </span>
        </h1>
        <p className="mt-[5px] mb-0 text-xs">خط السير على الخريطة مع محطات ووقت وصول توضيحي.</p>
      </div>
      <Button to="/trips" variant="outline" iconStart={ArrowRight}>
        كل الحجوزات
      </Button>
    </section>
  )
}
