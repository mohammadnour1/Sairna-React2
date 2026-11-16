import { cn } from '@/utils/cn'

/** Grey pulsing placeholder block. Size/shape come from `className` (default radius unless one is given). */
export default function Skeleton({ className = '' }) {
  const hasRadius = /(^|\s|:)rounded/.test(className)
  return <span aria-hidden="true" className={cn('block animate-skeleton bg-surface-alt', !hasRadius && 'rounded-lg', className)} />
}
