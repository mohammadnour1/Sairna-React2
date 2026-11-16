import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { MAIN_NAV } from '@/data/navigation'
import { cn } from '@/utils/cn'
import { useNavActive } from './useNavActive'

const linkClass = 'flex items-center justify-between border-b border-border px-2 py-3 font-bold'

/**
 * Collapsible link panel for narrow screens (reference `.mobile-panel`).
 * Open/close state and the outside-click/Esc behaviour live in Header.
 *
 * @param {{ id: string, open: boolean, isAuthenticated: boolean, ref?: import('react').Ref<HTMLDivElement> }} props
 */
export default function MobileMenu({ id, open, isAuthenticated, ref }) {
  const isActive = useNavActive()
  return (
    <div
      id={id}
      ref={ref}
      hidden={!open}
      className={cn('border-t border-border bg-surface px-7 py-3 max-sm:px-5', 'md:hidden')}
    >
      <nav aria-label="القائمة">
        {MAIN_NAV.map((item) => {
          const active = isActive(item)
          return (
            <Link key={item.to} to={item.to} aria-current={active ? 'page' : undefined} className={cn(linkClass, active && 'text-primary')}>
              {item.label}
              <Icon icon={ChevronLeft} size={16} />
            </Link>
          )
        })}
        {isAuthenticated ? (
          <Link to="/account" className={linkClass}>
            حسابي
          </Link>
        ) : (
          <>
            <Link to="/login" className={linkClass}>
              تسجيل الدخول
            </Link>
            <Link to="/register" className={linkClass}>
              إنشاء حساب
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
