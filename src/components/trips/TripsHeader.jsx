import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

/** Title row above the bookings list (reference `.trips-top`). */
export default function TripsHeader() {
  return (
    <div className="mb-[23px] flex items-center justify-between gap-[15px]">
      <div>
        <h2 className="m-0 text-[19px] tracking-[-.6px] max-sm:text-[17px]">رحلاتي القادمة</h2>
        <p className="m-0 text-[11px]">كل حجوزاتك المحفوظة بحسابك</p>
      </div>
      <Button to="/results" size="sm" iconStart={Plus}>
        حجز جديد
      </Button>
    </div>
  )
}
