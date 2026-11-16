import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

const tones = {
  default: 'text-muted hover:border-primary hover:bg-soft-teal hover:text-primary',
  danger: 'text-[#a64645] hover:border-[#a64645] hover:bg-[#fde8e7] dark:text-[#f4b6b2] dark:hover:bg-[#4a2427]',
}

/**
 * Small icon button (or link) for table rows. `label` is the tooltip and the accessible name;
 * on mobile cards it is also shown next to the icon.
 * @param {{ icon: import('react').ComponentType, label: string, to?: string, onClick?: () => void,
 *           tone?: 'default'|'danger', disabled?: boolean }} props
 */
export default function RowAction({ icon, label, to, onClick, tone = 'default', disabled = false }) {
  const classes = cn(
    'inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-[9px] border border-transparent px-1.5 text-[11px] font-bold transition-colors disabled:pointer-events-none disabled:opacity-40 max-sm:border-border max-sm:px-2.5',
    tones[tone],
  )
  const content = (
    <>
      <Icon icon={icon} size={16} />
      <span className="sm:sr-only">{label}</span>
    </>
  )
  if (to) {
    return (
      <Link to={to} className={classes} title={label}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" className={classes} onClick={onClick} title={label} disabled={disabled}>
      {content}
    </button>
  )
}
