import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * Compact labelled <select> for filter rows.
 * @param {{ label: string, value: string, onChange: (v: string) => void,
 *           options: { value: string, label: string }[] }} props
 */
export default function FilterSelect({ label, value, onChange, options }) {
  const id = useId()
  return (
    <div className="relative flex h-10 items-center rounded-[11px] border border-border bg-surface ps-3 pe-8 text-xs focus-within:border-primary max-sm:flex-1">
      <label htmlFor={id} className="me-1.5 shrink-0 font-bold whitespace-nowrap text-muted">
        {label}:
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent font-extrabold text-text outline-none focus-visible:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon icon={ChevronDown} size={15} className="pointer-events-none absolute end-2.5 text-muted" />
    </div>
  )
}
