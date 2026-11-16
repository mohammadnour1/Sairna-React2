import { Fragment } from 'react'
import { formatSeats } from '@/utils/format'

/**
 * Dashed mini-ticket: code / route / seats (reference `.confirmation-ticket`).
 * @param {{ booking: object }} props
 */
export default function ConfirmationTicket({ booking }) {
  const items = [
    { label: 'رقم الحجز', value: booking.code, ltr: true },
    { label: 'الوجهة', value: booking.trip ? `${booking.trip.origin.name} ← ${booking.trip.destination.name}` : '—' },
    { label: 'المقاعد', value: formatSeats(booking.seatNumbers) },
  ]
  return (
    <div className="my-5 flex items-center justify-around gap-[13px] rounded-[15px] border border-dashed border-[#bcd8d4] bg-surface-alt px-3 py-[22px] max-sm:flex-wrap max-sm:gap-[5px]">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <span className="h-10 border-s border-dashed border-[#bbd0d4]" aria-hidden="true" />}
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] text-muted">{item.label}</span>
            <strong className="text-xs max-sm:text-[10px]" dir={item.ltr ? 'ltr' : undefined}>
              {item.value}
            </strong>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
