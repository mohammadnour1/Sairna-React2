import { useId } from 'react'
import Icon from './Icon'
import { cn } from '@/utils/cn'

const heights = { md: 'h-[50px]', lg: 'h-[55px]' }

/**
 * Labelled input with a leading icon (reference `.form-group` + `.field-control`).
 * Errors are linked with aria-describedby and aria-invalid.
 *
 * @param {{ label: string, icon?: import('react').ComponentType, error?: string, required?: boolean,
 *           size?: 'md'|'lg', labelClassName?: string (replaces the default label font size), endAdornment?: import('react').ReactNode,
 *           ref?: import('react').Ref<HTMLInputElement> } & import('react').InputHTMLAttributes<HTMLInputElement>} props
 */
export default function TextField({
  label,
  icon,
  error,
  required,
  size = 'md',
  labelClassName,
  endAdornment,
  className,
  id,
  ref,
  ...inputProps
}) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`

  return (
    <div className={cn('block min-w-0', className)}>
      <label htmlFor={inputId} className={cn('mb-2 block font-extrabold', labelClassName ?? 'text-[11px]')}>
        {label} {required && <em className="text-[#d86161] not-italic">*</em>}
      </label>
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-[11px] border px-[13px] text-muted transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(16,169,154,.09)]',
          heights[size],
          error ? 'border-[#d86161]' : 'border-border',
        )}
      >
        {icon && <Icon icon={icon} size={size === 'lg' ? 19 : 18} />}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 flex-1 border-0 bg-transparent text-xs text-text outline-none placeholder:text-[#a5b4bc] focus-visible:outline-none"
          {...inputProps}
        />
        {endAdornment}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 mb-0 text-[10px] font-bold text-[#c0504f] dark:text-[#f19c98]">
          {error}
        </p>
      )}
    </div>
  )
}
