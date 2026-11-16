import { Link } from 'react-router-dom'
import Icon from './Icon'
import { cn } from '@/utils/cn'

const base =
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap border font-extrabold transition-[transform,box-shadow,background-color,border-color,color] duration-250 ease-[ease] enabled:hover:-translate-y-[3px] enabled:active:translate-y-0 enabled:active:scale-[.98] disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60 [a&]:hover:-translate-y-[3px]'

const variants = {
  primary:
    'border-transparent bg-primary text-white shadow-[0_9px_20px_rgba(8,165,151,.19)] hover:bg-primary-deep hover:shadow-[0_12px_25px_rgba(8,165,151,.28)]',
  dark: 'border-transparent bg-dark text-white hover:bg-[#174d61]',
  outline: 'border-border bg-surface text-text hover:border-primary hover:text-primary',
  subtle: 'border-transparent bg-surface-alt text-text',
  white: 'border-transparent bg-white text-[#114054] hover:bg-[#e7fff9]',
  // Destructive actions (cancel booking) — not in the reference, which had no cancel.
  danger: 'border-transparent bg-[#a64645] text-white hover:bg-[#8f3a39]',
  dangerOutline:
    'border-border bg-surface text-[#a64645] hover:border-[#a64645] dark:text-[#f4b6b2] dark:hover:border-[#f4b6b2]',
}

const sizes = {
  md: 'min-h-[49px] rounded-xl px-[22px] py-[11px] text-[13px]',
  sm: 'min-h-10 rounded-[10px] px-[15px] py-2 text-xs',
  // The caller passes every sizing class (height, padding, font, radius) in `className`.
  // Needed because two utilities for the same property don't override by class order.
  custom: '',
}

/**
 * Reference `.btn` with its variants.
 * Renders a router <Link> when `to` is given, an <a> for `href`, otherwise a <button>.
 *
 * @param {{
 *   variant?: 'primary'|'dark'|'outline'|'subtle'|'white'|'danger'|'dangerOutline', size?: 'md'|'sm'|'custom',
 *   to?: string|object, href?: string, fullWidth?: boolean, loading?: boolean,
 *   iconStart?: import('react').ComponentType, iconEnd?: import('react').ComponentType, iconSize?: number,
 *   className?: string, children: import('react').ReactNode
 * }} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  fullWidth = false,
  loading = false,
  iconStart,
  iconEnd,
  iconSize = 17,
  className,
  children,
  type = 'button',
  disabled,
  ...rest
}) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)
  const content = (
    <>
      {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : iconStart && <Icon icon={iconStart} size={iconSize} />}
      {children}
      {iconEnd && !loading && <Icon icon={iconEnd} size={iconSize} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} aria-disabled={disabled || undefined} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  )
}
