import { FilterX } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * One row above a list: search + filters (+ "clear" when something is active) + result count.
 * @param {{ children: import('react').ReactNode, active?: boolean, onClear?: () => void, count?: number|null }} props
 */
export default function FilterBar({ children, active = false, onClear, count = null }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      {children}
      {active && onClear && (
        <Button variant="subtle" size="sm" iconStart={FilterX} onClick={onClear} className="min-h-10">
          مسح الفلاتر
        </Button>
      )}
      {count != null && (
        <span className="ms-auto text-[11px] font-bold text-muted max-sm:w-full" aria-live="polite">
          {count} نتيجة
        </span>
      )}
    </div>
  )
}
