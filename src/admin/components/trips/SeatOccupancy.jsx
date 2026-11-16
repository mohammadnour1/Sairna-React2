import { cn } from '@/utils/cn'

/**
 * Mini seat map (4 seats per row, 2 + aisle + 2 like the passenger seat map).
 * Booked seats come from the trip's confirmed bookings — nothing is invented.
 * @param {{ totalSeats: number, booked: Map<number, string> }} props  booked: seat → passenger name
 */
export default function SeatOccupancy({ totalSeats, booked }) {
  const rows = Math.ceil(totalSeats / 4)
  return (
    <div>
      <div className="mx-auto grid w-fit gap-1.5" role="list" aria-label="إشغال المقاعد">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="grid grid-cols-[repeat(2,28px)_14px_repeat(2,28px)] gap-1.5">
            {[1, 2, null, 3, 4].map((offset, i) => {
              if (offset === null) return <span key={`aisle-${i}`} aria-hidden="true" />
              const n = r * 4 + offset
              if (n > totalSeats) return <span key={n} />
              const who = booked.get(n)
              return (
                <span
                  key={n}
                  role="listitem"
                  title={who ? `مقعد ${n}: ${who}` : `مقعد ${n}: متاح`}
                  aria-label={who ? `مقعد ${n} محجوز` : `مقعد ${n} متاح`}
                  className={cn(
                    'grid h-7 place-items-center rounded-[7px] border text-[10px] font-extrabold tabular-nums',
                    who ? 'border-transparent bg-chart text-white' : 'border-border bg-surface text-muted',
                  )}
                >
                  {n}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4 text-[11px] font-bold text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-chart" aria-hidden="true" /> محجوز
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] border border-border bg-surface" aria-hidden="true" /> متاح
        </span>
      </div>
    </div>
  )
}
