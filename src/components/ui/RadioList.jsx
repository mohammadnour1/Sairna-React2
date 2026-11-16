/**
 * Vertical radio group with optional counts (reference `.radio-list`).
 * @param {{ name: string, legend?: string, options: { value: string, label: string, count?: number }[],
 *           value: string, onChange: (value: string) => void }} props
 */
export default function RadioList({ name, legend, options, value, onChange }) {
  return (
    <div role="radiogroup" aria-label={legend} className="flex flex-col gap-3 max-sm:gap-[9px]">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 text-[11px] font-bold text-muted max-sm:text-[10px]"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="cursor-pointer accent-primary"
          />
          {option.label}
          {option.count != null && (
            <span className="ms-auto rounded-md bg-surface-alt px-[7px] text-[10px]">{option.count}</span>
          )}
        </label>
      ))}
    </div>
  )
}
