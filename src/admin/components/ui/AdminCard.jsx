import { cn } from '@/utils/cn'

/**
 * Basic dashboard card: surface, hairline border, soft shadow (site tokens).
 * @param {{ title?: string, description?: string, action?: import('react').ReactNode, className?: string,
 *           bodyClassName?: string, as?: string, children: import('react').ReactNode }} props
 */
export default function AdminCard({ title, description, action, className, bodyClassName, as: Tag = 'section', children }) {
  return (
    <Tag className={cn('min-w-0 rounded-[18px] border border-border bg-surface shadow-card', className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 max-sm:px-4">
          <div className="min-w-0">
            {title && <h2 className="m-0 text-[15px] leading-[1.6] font-extrabold">{title}</h2>}
            {description && <p className="m-0 text-[11px] leading-[1.7]">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn('p-5 max-sm:p-4', bodyClassName)}>{children}</div>
    </Tag>
  )
}
