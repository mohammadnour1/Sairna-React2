import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ExternalLink, LogOut, X } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/utils/cn'
import { ADMIN_NAV } from '../../navigation'
import { useAdminLogout } from '../../hooks/useAdminLogout'
import AdminBrand from './AdminBrand'

const item =
  'relative flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-bold text-[#a9c6cf] transition-colors hover:bg-white/[.06] hover:text-white focus-visible:outline-[#4cc8bf]'

/**
 * Dark brand sidebar. ≥901px: sticky column (260px, or 78px when `collapsed`).
 * <901px: off-canvas drawer from the start edge with scrim, focus trap, Esc and scroll lock.
 *
 * @param {{ id: string, collapsed: boolean, mobileOpen: boolean, onCloseMobile: () => void }} props
 */
export default function AdminSidebar({ id, collapsed, mobileOpen, onCloseMobile }) {
  const panelRef = useRef(null)
  const logout = useAdminLogout()
  useFocusTrap(panelRef, { active: mobileOpen })
  useLockBodyScroll(mobileOpen)

  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && onCloseMobile()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen, onCloseMobile])

  // Icon-only only applies on desktop; the mobile drawer always shows labels.
  const iconOnly = collapsed && !mobileOpen
  const label = (text) => <span className={cn('truncate', iconOnly && 'md:sr-only')}>{text}</span>

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-140 animate-fade bg-[rgba(7,27,42,.55)] md:hidden" onClick={onCloseMobile} aria-hidden="true" />}
      <aside
        id={id}
        ref={panelRef}
        aria-label="قائمة لوحة الإدارة"
        className={cn(
          'flex flex-col bg-sidebar text-white transition-[width,translate] duration-250',
          'max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:z-150 max-md:w-[min(284px,86vw)] max-md:shadow-[0_0_50px_rgba(0,0,0,.3)]',
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:invisible max-md:translate-x-full',
          'md:sticky md:top-0 md:h-dvh md:shrink-0',
          collapsed ? 'md:w-[78px]' : 'md:w-[260px]',
        )}
      >
        <div className={cn('flex h-[72px] shrink-0 items-center border-b border-white/[.07] px-5', iconOnly && 'md:justify-center md:px-0')}>
          <span className={cn(iconOnly && 'md:hidden')}>
            <AdminBrand />
          </span>
          {iconOnly && (
            <span className="max-md:hidden">
              <AdminBrand compact />
            </span>
          )}
          <button type="button" onClick={onCloseMobile} className="ms-auto grid size-9 place-items-center rounded-lg text-[#a9c6cf] hover:bg-white/[.06] md:hidden" aria-label="إغلاق القائمة">
            <Icon icon={X} size={20} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5" aria-label="أقسام لوحة الإدارة">
          <p className={cn('mx-3 mb-2 text-[10px] font-extrabold tracking-wide text-[#6f97a3]', iconOnly && 'md:sr-only')}>الإدارة</p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {ADMIN_NAV.map((nav) => (
              <li key={nav.to}>
                <NavLink
                  to={nav.to}
                  end={nav.end}
                  onClick={onCloseMobile}
                  title={iconOnly ? nav.label : undefined}
                  className={({ isActive }) =>
                    cn(item, iconOnly && 'md:justify-center md:px-0', isActive && 'bg-[rgba(10,169,155,.17)] text-white hover:bg-[rgba(10,169,155,.22)]')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-primary" aria-hidden="true" />}
                      <Icon icon={nav.icon} size={20} className={cn('shrink-0', isActive && 'text-primary')} />
                      {label(nav.label)}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 flex-col gap-1 border-t border-white/[.07] p-3">
          <Link to="/" className={cn(item, iconOnly && 'md:justify-center md:px-0')} title={iconOnly ? 'عرض الموقع' : undefined}>
            <Icon icon={ExternalLink} size={19} className="shrink-0" />
            {label('عرض الموقع')}
          </Link>
          <button
            type="button"
            onClick={logout}
            className={cn(item, 'w-full text-[#f0b3b0] hover:text-[#ffd4d1]', iconOnly && 'md:justify-center md:px-0')}
            title={iconOnly ? 'تسجيل الخروج' : undefined}
          >
            <Icon icon={LogOut} size={19} className="shrink-0" />
            {label('تسجيل الخروج')}
          </button>
        </div>
      </aside>
    </>
  )
}
