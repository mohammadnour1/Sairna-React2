import { Armchair, Phone } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * Passengers of a booking, one row per seat (seatNumber, passengerName, passengerPhone from the API).
 * @param {{ seats: { seatNumber: number, passengerName: string, passengerPhone: string }[] }} props
 */
export default function PassengersList({ seats }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {seats.map((s) => (
        <li key={s.seatNumber} className="flex items-center gap-3 rounded-[14px] border border-border p-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-soft-teal text-primary-deep dark:text-primary">
            <span className="flex flex-col items-center leading-none">
              <Icon icon={Armchair} size={15} />
              <b className="mt-0.5 text-[11px] tabular-nums">{s.seatNumber}</b>
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-[13px]">{s.passengerName || '—'}</strong>
            <span className="text-[10px] text-muted">مقعد رقم {s.seatNumber}</span>
          </div>
          {s.passengerPhone && (
            <a href={`tel:${s.passengerPhone.replace(/\s/g, '')}`} dir="ltr" className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary">
              <Icon icon={Phone} size={14} />
              {s.passengerPhone}
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
