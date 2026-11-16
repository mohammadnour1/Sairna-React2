import Icon from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/**
 * One bordered cell of the search form with a floating label (reference `.search-field`).
 * @param {{ label: string, icon: import('react').ComponentType, compact?: boolean, className?: string,
 *           children: import('react').ReactNode }} props
 */
export default function SearchField({ label, icon, compact = false, className, children }) {
  return (
    <label
      className={cn(
        'search-field relative flex min-w-0 items-center gap-2.5 rounded-[11px] border border-border bg-surface px-3.5 pt-[11px] pb-[5px] transition-[border-color,box-shadow] duration-200',
        'focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(13,172,155,.08)]',
        'max-lg:gap-1.5 max-lg:px-2.5 max-sm:gap-1 max-sm:px-[9px] max-sm:pt-2 max-sm:pb-1',
        compact ? 'h-[57px] max-sm:h-[53px]' : 'h-[60px] max-md:h-14 max-sm:h-[58px]',
        className,
      )}
    >
      <span className="absolute start-3.5 top-[7px] text-[10px] font-bold text-muted max-sm:start-[9px] max-xs:text-[9px]">
        {label}
      </span>
      <Icon icon={icon} size={19} className="mt-3 shrink-0 text-primary max-sm:size-4" />
      {children}
    </label>
  )
}
