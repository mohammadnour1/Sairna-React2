import { Info } from 'lucide-react'
import Icon from './Icon'
import { cn } from '@/utils/cn'

const variants = {
  // `.soft-info` — teal hint under booking steps
  soft: {
    box: 'mt-3.5 flex items-start gap-[9px] rounded-xl bg-soft-teal p-[13px] text-[10px] leading-[1.9] font-bold text-primary-deep',
    icon: 'mt-px shrink-0',
    size: 19,
  },
  // `.soft-notice` — teal banner under lists
  notice: {
    box: 'mt-[18px] flex items-center gap-[9px] rounded-xl bg-soft-teal p-3.5 text-[11px] text-primary-deep',
    icon: 'shrink-0',
    size: 19,
  },
  // `.review-alert` — inline teal sentence
  review: { box: 'flex items-center gap-[9px] text-[11px] text-primary-deep', icon: 'shrink-0', size: 18 },
  // `.tracking-warning` — muted fine print
  warning: { box: 'mt-[17px] mb-0 flex items-start gap-[7px] text-[10px] leading-[1.85] text-muted', icon: 'flex-none', size: 17 },
  // `.auth-demo-note` — grey box with teal icon
  auth: {
    box: 'flex items-start gap-2 rounded-[10px] bg-surface-alt p-[13px] text-[10px] text-muted',
    icon: 'flex-none text-primary',
    size: 18,
  },
}

/**
 * Small informational note with an icon.
 * @param {{ variant?: 'soft'|'notice'|'review'|'warning'|'auth', icon?: import('react').ComponentType,
 *           as?: string, className?: string, children: import('react').ReactNode }} props
 */
export default function InfoNote({ variant = 'soft', icon = Info, as: Tag = 'div', className, children }) {
  const v = variants[variant]
  return (
    <Tag className={cn(v.box, className)}>
      <Icon icon={icon} size={v.size} className={v.icon} />
      <span>{children}</span>
    </Tag>
  )
}
