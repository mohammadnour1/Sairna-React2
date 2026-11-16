import { ArrowLeft, Calendar } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { formatDate, formatPeople } from '@/utils/format'
import SortSelect from './SortSelect'

/**
 * Count + route + date line above the list (reference `.results-heading`).
 * @param {{ count: number|null, origin?: object, destination?: object, date: string, people: number,
 *           sort: string, onSortChange: (v: string) => void }} props
 */
export default function ResultsHeader({ count, origin, destination, date, people, sort, onSortChange }) {
  return (
    <div className="mt-[38px] mb-[22px] flex items-end justify-between gap-[18px] max-sm:mt-7 max-sm:mb-[18px] max-sm:flex-col max-sm:items-start max-sm:gap-[11px]">
      <div>
        <h2 aria-live="polite" className="mb-[5px] flex items-center gap-3.5 text-xl max-sm:flex-wrap max-sm:gap-[7px] max-sm:text-[17px]">
          {count ?? '…'} رحلات متاحة
          <span className="inline-flex items-center gap-1.5 rounded-[7px] bg-soft-teal px-2.5 py-[5px] text-xs text-primary-deep max-sm:text-[10px]">
            {origin?.name} <Icon icon={ArrowLeft} size={17} /> {destination?.name}
          </span>
        </h2>
        <p className="m-0 flex items-center gap-1.5 text-[11px]">
          <Icon icon={Calendar} size={15} /> {formatDate(date)} · {formatPeople(people)}
        </p>
      </div>
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  )
}
