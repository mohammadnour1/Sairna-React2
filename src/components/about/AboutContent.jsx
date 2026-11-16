import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import SmartImage from '@/components/ui/SmartImage'

/** Text + Latakia photo (reference `.about-grid`). The 2nd paragraph is updated for React + API. */
export default function AboutContent() {
  return (
    <section className="site-container grid grid-cols-2 items-center gap-[45px] py-[86px] max-sm:grid-cols-1 max-sm:py-[58px]">
      <div>
        <h2 className="text-[29px] tracking-[-.6px] max-sm:text-[23px]">فكرة صغيرة... تجربة كبيرة.</h2>
        <p className="text-[13px] leading-[2.2]">
          بدنا تجربة واضحة للمستخدم من لحظة اختيار مدينة الانطلاق والوصول، وصولاً لمقارنة الشركات، اختيار المقاعد، تأكيد التذكرة،
          ومشاهدة مسار الرحلة على الخريطة.
        </p>
        <p className="text-[13px] leading-[2.2]">تم تطوير هذه النسخة باستخدام React ومربوطة بواجهة API حقيقية للمشروع التدريبي.</p>
        <Button to="/results" iconEnd={ArrowLeft}>
          جرّب رحلة
        </Button>
      </div>
      <SmartImage
        photoKey="latakia"
        alt="الساحل السوري في اللاذقية"
        className="aspect-[1.4] max-h-[405px] w-full rounded-[23px] object-cover"
      />
    </section>
  )
}
