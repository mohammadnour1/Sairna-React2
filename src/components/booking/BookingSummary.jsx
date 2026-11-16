import { ArrowLeft, ShieldCheck, Ticket } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import CompanyLogo from '@/components/common/CompanyLogo'
import { formatDate, formatMoney, formatSeats, formatTime } from '@/utils/format'

/**
 * Sticky booking summary (reference `.summary-card`).
 * @param {{ trip: object, people: number, seats: number[] }} props — `seats` already sorted (bug B5)
 */
export default function BookingSummary({ trip, people, seats }) {
  const rows = [
    ['تاريخ الرحلة', formatDate(trip.date)],
    ['المسافرين', people],
    ['المقاعد', seats.length ? formatSeats(seats) : 'لم تُحدّد بعد'],
    ['السعر للمسافر', formatMoney(trip.price)],
  ]
  return (
    <aside className="sticky top-[110px] rounded-[20px] border border-border bg-surface p-[23px] shadow-card max-md:static max-md:order-first max-sm:rounded-[15px] max-sm:p-[17px]">
      <div className="flex items-center gap-2 border-b border-border pb-[17px] text-primary">
        <Icon icon={Ticket} size={21} />
        <h3 className="m-0 text-base text-text">ملخص الحجز</h3>
      </div>
      <div className="my-[21px] flex items-center gap-[11px]">
        <CompanyLogo company={trip.company} />
        <div>
          <strong className="block text-[13px]">{trip.company.name}</strong>
          <small className="block text-[10px] text-muted">رحلة مباشرة</small>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-surface-alt p-[13px]">
        <div className="flex flex-col items-start">
          <small className="text-[10px] text-muted">الانطلاق</small>
          <b className="text-sm">{trip.origin.name}</b>
          <span className="text-[10px] text-muted">{formatTime(trip.departureTime)}</span>
        </div>
        <span className="text-primary">
          <Icon icon={ArrowLeft} size={21} />
        </span>
        <div className="flex flex-col items-start">
          <small className="text-[10px] text-muted">الوصول</small>
          <b className="text-sm">{trip.destination.name}</b>
          <span className="text-[10px] text-muted">{formatTime(trip.arrivalTime)}</span>
        </div>
      </div>
      <div className="my-[23px] flex flex-col gap-[17px] max-md:grid max-md:grid-cols-2 max-md:gap-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-2 max-sm:flex-col max-sm:items-start">
            <span className="text-[11px] text-muted">{label}</span>
            <strong className="text-end text-[11px] max-sm:text-start">{value}</strong>
          </div>
        ))}
      </div>
      <div className="flex items-baseline justify-between gap-2 border-t border-dashed border-border pt-5 pb-2">
        <span className="text-xs font-extrabold">السعر الإجمالي</span>
        <b className="text-xl text-primary">{formatMoney(trip.price * people)}</b>
      </div>
      <p className="mt-3 mb-0 flex gap-[7px] rounded-[10px] bg-surface-alt p-[9px] text-[10px]">
        <Icon icon={ShieldCheck} size={17} className="shrink-0 text-primary" /> لا يوجد دفع إلكتروني ضمن المشروع التعليمي.
      </p>
    </aside>
  )
}
