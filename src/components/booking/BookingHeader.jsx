import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Eyebrow from '@/components/ui/Eyebrow'
import Icon from '@/components/ui/Icon'
import Stepper from '@/components/ui/Stepper'
import { BOOKING_STEPS } from '@/hooks/useBookingFlow'

/**
 * Breadcrumb, title, "تغيير الرحلة" link and the 3-step stepper (reference `.booking-head`).
 * @param {{ step: string, backTo: string }} props
 */
export default function BookingHeader({ step, backTo }) {
  return (
    <section className="site-container pt-[30px] max-sm:pt-5">
      <Breadcrumb items={[{ label: 'الرئيسية', to: '/' }, { label: 'الرحلات', to: backTo }, { label: 'إتمام الحجز' }]} />
      <div className="flex items-end justify-between gap-5">
        <div>
          <Eyebrow>باقي شوي وتوصل</Eyebrow>
          <h1 className="mt-[9px] mb-0 text-[31px] max-sm:text-[26px]">
            كمّل حجز <span className="text-primary">رحلتك.</span>
          </h1>
        </div>
        <Link to={backTo} className="inline-flex items-center gap-2 font-bold text-muted hover:text-primary max-sm:text-[10px]">
          <Icon icon={ArrowRight} size={17} /> تغيير الرحلة
        </Link>
      </div>
      <Stepper steps={BOOKING_STEPS} current={step} />
    </section>
  )
}
