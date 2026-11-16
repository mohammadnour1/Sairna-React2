import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/**
 * Labelled <select> styled like TextField (same border, radius, focus ring and error text).
 * @param {{ label: string, icon?: import('react').ComponentType, error?: string, required?: boolean,
 *           options: { value: string|number, label: string, disabled?: boolean }[], placeholder?: string,
 *           className?: string } & import('react').SelectHTMLAttributes<HTMLSelectElement>} props
 */
export default function SelectField({ label, icon, error, required, options, placeholder, className, id, ...selectProps }) {
  const autoId = useId()
  const selectId = id ?? autoId
  const errorId = `${selectId}-error`
  return (
    <div className={cn('block min-w-0', className)}>
      <label htmlFor={selectId} className="mb-2 block text-[11px] font-extrabold">
        {label} {required && <em className="text-[#d86161] not-italic">*</em>}
      </label>
      <div
        className={cn(
          'relative flex h-[50px] items-center gap-2.5 rounded-[11px] border px-[13px] text-muted transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(16,169,154,.09)]',
          error ? 'border-[#d86161]' : 'border-border',
        )}
      >
        {icon && <Icon icon={icon} size={18} />}
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-full w-full min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent pe-6 text-xs text-text outline-none focus-visible:outline-none"
          {...selectProps}
        >
          {placeholder != null && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon icon={ChevronDown} size={16} className="pointer-events-none absolute end-3" />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 mb-0 text-[10px] font-bold text-[#c0504f] dark:text-[#f19c98]">
          {error}
        </p>
      )}
    </div>
  )
}
