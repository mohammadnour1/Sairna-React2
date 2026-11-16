import { CircleCheck, ShieldCheck, User } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import InfoNote from '@/components/ui/InfoNote'
import PaymentInfo from './PaymentInfo'
import StageHead from './StageHead'

/**
 * Step 3: review travellers + payment info (reference `reviewStage()`).
 * @param {{ seats: number[], passengers: { name:string, phone:string }[] }} props
 */
export default function ReviewStage({ seats, passengers }) {
  return (
    <>
      <StageHead title="كل شي جاهز؟" icon={CircleCheck} iconSize={24} text="راجع معلومات الرحلة قبل ما تثبّت الحجز." />
      <div className="mb-[18px] rounded-[17px] border border-border p-[22px]">
        <h3 className="m-0 mb-3.5 text-sm">تفاصيل المسافرين</h3>
        {passengers.map((p, i) => (
          <div key={i} className="flex items-center gap-3 border-t border-border py-2.5">
            <span className="grid size-[39px] place-items-center rounded-full bg-soft-teal text-primary">
              <Icon icon={User} size={19} />
            </span>
            <div className="flex flex-col">
              <b className="text-xs">{p.name}</b>
              <span dir="ltr" className="text-end text-[11px] text-muted">
                {p.phone}
              </span>
            </div>
            <small className="ms-auto font-extrabold text-primary">المقعد {seats[i]}</small>
          </div>
        ))}
      </div>
      <PaymentInfo />
      <InfoNote variant="review" icon={ShieldCheck} as="p">
        بتأكيد الحجز، رح تنضاف التذكرة لقائمة «حجوزاتي» بحسابك.
      </InfoNote>
    </>
  )
}
