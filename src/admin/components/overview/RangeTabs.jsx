import { cn } from '@/utils/cn'

/**
 * Segmented date-range presets (one row, above the charts it scopes).
 * @param {{ value: string, options: { value: string, label: string }[], onChange: (v: string) => void }} props
 */
export default function RangeTabs({ value, options, onChange }) {
  return (
    <div role="radiogroup" aria-label="الفترة" className="inline-flex rounded-[12px] border border-border bg-surface p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'h-8 rounded-[9px] px-3.5 text-xs font-extrabold transition-colors',
              active ? 'bg-dark text-white dark:bg-primary' : 'text-muted hover:text-text',
            )}
          >
            آخر {o.label}
          </button>
        )
      })}
    </div>
  )
}
