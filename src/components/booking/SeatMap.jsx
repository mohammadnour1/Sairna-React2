import { Bus, Gauge } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import Seat from './Seat'
import SeatLegend from './SeatLegend'

/**
 * Bus-shaped seat plan: rows of 2 + aisle + 2 (reference `.seat-map-card`).
 * Seat statuses come from GET /trips/{id}/seats (bug B3).
 *
 * @param {{ seatMap: { seats: { number:number, status:string }[], columns:number }, selected: number[],
 *           onToggle: (n:number) => void }} props
 */
export default function SeatMap({ seatMap, selected, onToggle }) {
  const { seats, columns } = seatMap
  const half = Math.ceil(columns / 2)
  const rows = Array.from({ length: Math.ceil(seats.length / columns) }, (_, r) => seats.slice(r * columns, r * columns + columns))
  const renderSeat = (seat) => (
    <Seat
      key={seat.number}
      number={seat.number}
      booked={seat.status === 'booked'}
      selected={selected.includes(seat.number)}
      onToggle={onToggle}
    />
  )

  return (
    <div className="mx-auto w-full max-w-[353px] rounded-[100px_100px_26px_26px] border border-border bg-surface-alt px-[18px] pt-[21px] pb-[25px] shadow-[inset_0_0_0_6px_color-mix(in_srgb,var(--border)_35%,transparent)] max-sm:max-w-[340px] max-xs:px-[9px]">
      <div className="mb-[18px] flex items-center justify-between border-b border-dashed border-[#bdced2] px-2.5 pt-[7px] pb-4 text-[10px] font-extrabold text-muted">
        <span className="flex items-center gap-1.5">
          <Icon icon={Bus} size={20} /> مقدمة الحافلة
        </span>
        <span className="inline-flex items-center justify-center text-text">
          <Icon icon={Gauge} size={27} />
        </span>
      </div>
      <div role="group" aria-label="مخطط المقاعد">
        {rows.map((row, r) => (
          <div
            key={r}
            className="mb-[9px] grid grid-cols-[27px_1fr_1fr_15px_1fr_1fr] items-center gap-[7px] max-xs:grid-cols-[20px_1fr_1fr_10px_1fr_1fr] max-xs:gap-[5px]"
          >
            <span className="text-center text-[10px] text-muted" aria-hidden="true">
              {String(r + 1).padStart(2, '0')}
            </span>
            {row.slice(0, half).map(renderSeat)}
            <span aria-hidden="true" />
            {row.slice(half).map(renderSeat)}
          </div>
        ))}
      </div>
      <SeatLegend />
    </div>
  )
}
