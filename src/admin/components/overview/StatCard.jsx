import Icon from '@/components/ui/Icon'
import Skeleton from '@/components/ui/Skeleton'

/**
 * Stat tile: label · value (proportional figures) · optional hint. No fake delta or trend.
 * @param {{ label: string, value: import('react').ReactNode, icon: import('react').ComponentType,
 *           hint?: string, loading?: boolean }} props
 */
export default function StatCard({ label, value, icon, hint, loading = false }) {
  return (
    <div className="flex min-w-0 items-start gap-3.5 rounded-[18px] border border-border bg-surface p-5 shadow-card max-sm:p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-soft-teal text-primary-deep dark:text-primary">
        <Icon icon={icon} size={21} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-[11px] font-bold">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-20" />
        ) : (
          <strong className="mt-0.5 block truncate text-[26px] leading-[1.4] font-black text-text" dir="ltr">
            <span className="block text-end">{value}</span>
          </strong>
        )}
        {hint && <small className="block truncate text-[10px] text-muted">{hint}</small>}
      </div>
    </div>
  )
}
