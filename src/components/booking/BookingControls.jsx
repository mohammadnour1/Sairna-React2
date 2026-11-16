import { ArrowLeft, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Back / next buttons under each step (reference `.booking-controls`).
 * @param {{ step: string, backTo: string, onBack: () => void, onNext: () => void, loading: boolean }} props
 */
export default function BookingControls({ step, backTo, onBack, onNext, loading }) {
  const btn = 'max-sm:px-[11px] max-sm:text-[11px]'
  return (
    <div className="mt-[27px] flex items-center justify-between gap-[15px] border-t border-border pt-[22px]">
      {step === 'seats' ? (
        <Button to={backTo} variant="subtle" iconStart={ArrowRight} className={btn}>
          رجوع للرحلات
        </Button>
      ) : (
        <Button variant="subtle" onClick={onBack} iconStart={ArrowRight} className={btn} disabled={loading}>
          السابق
        </Button>
      )}
      <Button onClick={onNext} iconEnd={ArrowLeft} loading={loading} className={btn}>
        {step === 'review' ? 'تأكيد الحجز' : 'متابعة الحجز'}
      </Button>
    </div>
  )
}
