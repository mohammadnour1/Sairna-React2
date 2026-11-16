import { cn } from '@/utils/cn'

/**
 * Square bordered icon-only button (reference `.icon-button`). `label` becomes aria-label + title.
 * @param {{ label: string, onClick?: Function, className?: string, sizeClass?: string, children: import('react').ReactNode }} props
 */
export default function IconButton({ label, className, sizeClass = 'size-10', children, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid flex-none place-items-center rounded-xl border border-border bg-surface text-text transition-all duration-250 hover:border-primary hover:bg-soft-teal hover:text-primary',
        sizeClass,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
