import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Icon from './Icon'
import { cn } from '@/utils/cn'

/**
 * Breadcrumb trail (reference `.breadcrumb`). The last item has no `to` and is the current page.
 * @param {{ items: { label: string, to?: string }[], spacing?: string }} props — `spacing` replaces the bottom margin
 */
export default function Breadcrumb({ items, spacing = 'mb-[22px]' }) {
  return (
    <nav aria-label="مسار التنقل" className={cn('flex items-center gap-2 text-[11px] font-extrabold text-muted', spacing)}>
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <Icon icon={ChevronLeft} size={14} />}
          {item.to ? (
            <Link to={item.to} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-text">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
