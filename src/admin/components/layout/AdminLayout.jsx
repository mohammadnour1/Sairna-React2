import { useCallback, useEffect, useId, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { readString, writeString } from '@/utils/storage'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

const COLLAPSE_KEY = 'sairna-admin-sidebar'

/** Dashboard shell: sidebar + sticky header + page. Collapsed state is remembered per browser. */
export default function AdminLayout() {
  const sidebarId = useId()
  const [collapsed, setCollapsed] = useState(() => readString(COLLAPSE_KEY) === 'collapsed')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    writeString(COLLAPSE_KEY, next ? 'collapsed' : 'expanded')
  }
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // Growing the window past the drawer breakpoint closes the drawer (and releases the scroll lock).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const onChange = (e) => e.matches && setMobileOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // New page → back to the top (lists keep their scroll when only the query string changes).
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-dvh bg-bg">
      <AdminSidebar id={sidebarId} collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={closeMobile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          sidebarId={sidebarId}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          mobileOpen={mobileOpen}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-6 outline-none max-sm:px-4 max-sm:py-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
