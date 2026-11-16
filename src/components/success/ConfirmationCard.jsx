import { Check, Route, Ticket } from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Icon from '@/components/ui/Icon'
import ConfirmationTicket from './ConfirmationTicket'

/**
 * Animated "booking confirmed" card (reference `successPage()`).
 * @param {{ booking: object }} props
 */
export default function ConfirmationCard({ booking }) {
  return (
    <div className="w-[min(640px,100%)] rounded-3xl border border-border bg-surface px-[45px] py-[50px] text-center shadow-card max-sm:px-[17px] max-sm:py-[34px]">
      <div className="mx-auto mb-[22px] grid size-[83px] animate-pop place-items-center rounded-full bg-[#dbf7e9] text-[#12a976]">
        <Icon icon={Check} size={43} />
      </div>
      <Eyebrow>صار الحجز جاهز</Eyebrow>
      <h1 className="mt-[13px] mb-2 text-[29px] max-sm:text-2xl">
        يا سلام! <span className="text-primary">تم تأكيد حجزك.</span>
      </h1>
      <p className="mx-auto mb-6 max-w-[420px] text-xs">انضافت التذكرة إلى «حجوزاتي». هلق بتقدر تراجعها وتتابع الرحلة التجريبية.</p>
      <ConfirmationTicket booking={booking} />
      <div className="flex justify-center gap-[11px] max-sm:flex-col">
        <Button to="/trips" iconEnd={Ticket}>
          عرض تذكرتي
        </Button>
        <Button to={`/tracking/${booking.id}`} variant="outline" iconEnd={Route}>
          تتبّع الرحلة
        </Button>
      </div>
    </div>
  )
}
