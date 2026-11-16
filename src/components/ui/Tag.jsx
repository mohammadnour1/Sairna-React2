import Icon from './Icon'
import { cn } from '@/utils/cn'

const tones = {
  success: 'bg-soft-teal text-primary-deep',
  teal: 'bg-soft-teal text-primary-deep',
  muted: 'bg-surface-alt text-muted',
  danger: 'bg-[#fde8e7] text-[#a64645] dark:bg-[#4a2427] dark:text-[#f4b6b2]',
  demo: 'bg-[#fff2da] text-[#a16c21]',
}

/**
 * Rounded status label (reference `.tag`, `.tag-success`, `.teal-tag`, `.tag-demo`).
 * @param {{ tone?: 'success'|'teal'|'muted'|'danger'|'demo', icon?: import('react').ComponentType,
 *           iconSize?: number, className?: string, children: import('react').ReactNode }} props
 */
export default function Tag({ tone = 'teal', icon, iconSize = 15, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] rounded-full px-2.5 py-[5px] text-[10px] font-extrabold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {icon && <Icon icon={icon} size={iconSize} />}
      {children}
    </span>
  )
}
