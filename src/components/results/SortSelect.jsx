import { SORT_OPTIONS } from '@/hooks/useTripFilters'

/**
 * "ترتيب حسب" dropdown (reference `.sort-box`).
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export default function SortSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-bold">
      <label htmlFor="sort-select" className="whitespace-nowrap text-muted">
        ترتيب حسب
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[42px] cursor-pointer rounded-[10px] border border-border bg-surface px-3 text-text"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
