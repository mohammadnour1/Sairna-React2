import { cn } from '@/utils/cn'

/**
 * Wraps a lucide-react icon with the reference stroke width (1.85).
 * Icons are decorative by default (aria-hidden); give text next to them instead of labels.
 *
 * @param {{ icon: import('react').ComponentType<any>, size?: number, className?: string }} props
 */
export default function Icon({ icon: IconComponent, size = 20, className, ...rest }) {
  return (
    <IconComponent
      size={size}
      strokeWidth={1.85}
      aria-hidden="true"
      focusable="false"
      className={cn('sairna-icon', className)}
      {...rest}
    />
  )
}
