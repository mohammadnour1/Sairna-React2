import { Armchair } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * One seat button. Booked seats are disabled; selection is exposed with aria-pressed
 * (the visual states live in `.seat-btn` in index.css).
 * @param {{ number: number, booked: boolean, selected: boolean, onToggle: (n:number) => void }} props
 */
export default function Seat({ number, booked, selected, onToggle }) {
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={selected}
      aria-label={booked ? `مقعد ${number} (محجوز)` : `مقعد ${number}`}
      onClick={() => onToggle(number)}
      className="seat-btn relative grid h-[39px] min-w-0 place-items-center rounded-[9px]"
    >
      <Icon icon={Armchair} size={24} />
      <small className="absolute bottom-px left-1 text-[8px]">{number}</small>
    </button>
  )
}
