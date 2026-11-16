import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * Top card of a details page: back link, big title, meta line and actions.
 * @param {{ backTo: string, backLabel: string, title: import('react').ReactNode, meta?: import('react').ReactNode,
 *           badges?: import('react').ReactNode, actions?: import('react').ReactNode }} props
 */
export default function DetailHeader({ backTo, backLabel, title, meta, badges, actions }) {
  return (
    <div className="mb-5">
      <Link to={backTo} className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary">
        <Icon icon={ArrowRight} size={16} />
        {backLabel}
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-border bg-surface p-5 shadow-card max-sm:p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 text-[22px] leading-[1.5] max-sm:text-lg">{title}</h2>
            {badges}
          </div>
          {meta && <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}
