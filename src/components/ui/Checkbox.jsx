import { useId } from 'react'
import { cn } from '@/utils/cn'

/**
 * Checkbox with inline label (reference `.terms-check`).
 * @param {{ label: import('react').ReactNode, error?: string, className?: string } & import('react').InputHTMLAttributes<HTMLInputElement>} props
 */
export default function Checkbox({ label, error, className, id, ...inputProps }) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`
  return (
    <div className={className}>
      <label htmlFor={inputId} className="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted">
        <input
          id={inputId}
          type="checkbox"
          className="cursor-pointer accent-primary"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={errorId} className={cn('mt-1 mb-0 text-[10px] font-bold text-[#c0504f] dark:text-[#f19c98]')}>
          {error}
        </p>
      )}
    </div>
  )
}
