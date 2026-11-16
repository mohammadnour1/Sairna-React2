import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import IconButton from '@/components/ui/IconButton'
import { useAuth } from '@/context/AuthContext'
import DesktopNav from './DesktopNav'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

const MENU_ID = 'mobile-menu'

/**
 * Sticky site header (reference `.site-header`).
 * The mobile menu closes on route change, Esc and outside click (bug B16).
 */
export default function Header() {
  const { user, isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const headerRef = useRef(null)

  // Close when the route changes (adjusting state during render instead of in an effect).
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    const onPointer = (event) => !headerRef.current?.contains(event.target) && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-80 border-b border-border bg-surface/96 backdrop-blur-[16px]"
    >
      <div className="site-container flex h-[83px] items-center justify-between gap-[22px] max-md:h-[71px] max-sm:h-[66px]">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-3 max-lg:gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link to="/login" className="text-xs font-extrabold whitespace-nowrap text-text hover:text-primary max-sm:hidden">
                دخول
              </Link>
              <Button to="/register" variant="dark" size="sm" iconEnd={ArrowLeft} iconSize={16} className="max-sm:hidden">
                إنشاء حساب
              </Button>
            </>
          )}
          <IconButton
            label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden"
          >
            <Icon icon={menuOpen ? X : Menu} size={24} />
          </IconButton>
        </div>
      </div>
      <MobileMenu id={MENU_ID} open={menuOpen} isAuthenticated={isAuthenticated} />
    </header>
  )
}
