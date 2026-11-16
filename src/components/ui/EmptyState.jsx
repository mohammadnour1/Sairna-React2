import Icon from './Icon'
import { cn } from '@/utils/cn'

/**
 * Centered dashed card for empty / not-found / error situations (reference `.empty-state`).
 * @param {{ icon?: import('react').ComponentType, title: string, text?: string, action?: import('react').ReactNode,
 *           as?: 'h2'|'h3', iconSize?: number, className?: string }} props
 */
export default function EmptyState({ icon, title, text, action, as: Heading = 'h3', iconSize = 42, className }) {
  return (
    <div className={cn('rounded-[20px] border border-dashed border-border bg-surface px-6 py-[70px] text-center', className)}>
      {icon && <Icon icon={icon} size={iconSize} className="text-primary" />}
      <Heading className="mt-4 mb-[3px] text-xl">{title}</Heading>
      {text && <p className="mb-[21px]">{text}</p>}
      {action}
    </div>
  )
}
