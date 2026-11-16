import { cn } from '@/utils/cn'

/**
 * Minimal loading indicator. `label` is read by screen readers and shown under the ring.
 * @param {{ label?: string, className?: string }} props
 */
export default function Spinner({ label = 'عم نحمّل...', className }) {
  return (
    <div role="status" className={cn('flex flex-col items-center gap-3 text-xs font-bold text-muted', className)}>
      <span className="size-9 animate-spin rounded-full border-[3px] border-soft-teal border-t-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
