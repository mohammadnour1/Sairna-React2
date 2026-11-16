import { Armchair, Ban, Bus, Route, Ticket, Wallet } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import BookingStatusTag from '@/components/common/BookingStatusTag'
import CompanyLogo from '@/components/common/CompanyLogo'
import { formatDate, formatMoney, formatSeats, formatTime } from '@/utils/format'

const actionBtn = 'min-h-[39px] rounded-xl px-[22px] py-[11px] text-[11px] max-sm:flex-1'

/**
 * One booking in "حجوزاتي" (reference `.my-trip-card`).
 * @param {{ booking: object, departed: boolean, cancellable: boolean,
 *           onShowTicket: (trigger: HTMLElement) => void, onCancel: () => void }} props
 */
export default function MyTripCard({ booking, departed, cancellable, onShowTicket, onCancel }) {
  const { trip } = booking
  return (
    <article className="overflow-hidden rounded-[19px] border border-border bg-surface">
      <div className="flex items-center justify-between gap-[15px] border-b border-dashed border-border bg-surface-alt px-[25px] py-[19px] max-sm:p-[13px]">
        <div className="flex items-center gap-2.5">
          <span className="grid size-[41px] place-items-center rounded-xl bg-soft-teal text-primary">
            <Icon icon={Ticket} size={20} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted">رقم الحجز</span>
            <b dir="ltr" className="text-end text-[13px]">
              {booking.code}
            </b>
          </div>
        </div>
        <BookingStatusTag booking={booking} departed={departed} />
      </div>

      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-[25px] px-[25px] py-[30px] max-sm:grid-cols-1 max-sm:px-[15px] max-sm:py-[21px]">
        <div className="flex items-center justify-between gap-[15px]">
          <div className="flex flex-col">
            <small className="text-[10px] text-muted">من</small>
            <h3 className="my-0.5 text-[21px] max-sm:text-lg">{trip?.origin.name ?? '—'}</h3>
            <b className="text-xs">{formatTime(trip?.departureTime)}</b>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1.5 text-primary">
            <Icon icon={Bus} size={20} />
            <div className="w-full border-t border-dashed border-border" />
            <small className="text-[9px] whitespace-nowrap max-sm:text-center max-sm:whitespace-normal">{formatDate(trip?.date)}</small>
          </div>
          <div className="flex flex-col">
            <small className="text-[10px] text-muted">إلى</small>
            <h3 className="my-0.5 text-[21px] max-sm:text-lg">{trip?.destination.name ?? '—'}</h3>
            <b className="text-xs">{formatTime(trip?.arrivalTime)}</b>
          </div>
        </div>
        <div className="flex flex-col gap-[9px] border-s border-border ps-[26px] max-sm:border-s-0 max-sm:border-t max-sm:ps-0 max-sm:pt-[15px]">
          {trip && (
            <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
              <CompanyLogo company={trip.company} size="tiny" /> {trip.company.name}
            </span>
          )}
          <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
            <Icon icon={Armchair} size={16} /> المقعد: {booking.isCancelled ? '—' : formatSeats(booking.seatNumbers)}
          </span>
          <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
            <Icon icon={Wallet} size={16} /> {formatMoney(booking.total)}
          </span>
        </div>
      </div>

      <div className="flex gap-[9px] border-t border-border px-[25px] py-4 max-sm:flex-wrap max-sm:p-3">
        {!booking.isCancelled && !departed && (
          <Button to={`/tracking/${booking.id}`} variant="outline" iconStart={Route} size="custom" className={actionBtn}>
            تتبّع الرحلة
          </Button>
        )}
        <Button variant="subtle" iconStart={Ticket} size="custom" className={actionBtn} onClick={(event) => onShowTicket(event.currentTarget)}>
          عرض التذكرة
        </Button>
        {cancellable && (
          <Button
            variant="dangerOutline"
            iconStart={Ban}
            onClick={onCancel}
            size="custom" className={actionBtn}
          >
            إلغاء الحجز
          </Button>
        )}
      </div>
    </article>
  )
}
