import { Link, useMatches } from 'react-router-dom'
import { ChevronLeft, Menu, PanelRightClose, PanelRightOpen } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import IconButton from '@/components/ui/IconButton'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import AdminProfileMenu from './AdminProfileMenu'

/**
 * Sticky header: menu / collapse button, page title + breadcrumb (from the route `handle`),
 * theme toggle and the profile menu. The API has no notifications, so there is no bell.
 *
 * @param {{ sidebarId: string, collapsed: boolean, onToggleCollapse: () => void,
 *           mobileOpen: boolean, onOpenMobile: () => void }} props
 */
export default function AdminHeader({ sidebarId, collapsed, onToggleCollapse, mobileOpen, onOpenMobile }) {
  const matches = useMatches()
  const handle = [...matches].reverse().find((m) => m.handle?.title)?.handle ?? { title: 'لوحة الإدارة' }
  useDocumentTitle(`${handle.title} · لوحة الإدارة`)

  const crumbs = [{ label: 'لوحة الإدارة', to: '/admin' }, ...(handle.parent ? [handle.parent] : [])]
  const isRoot = handle.title === 'نظرة عامة'

  return (
    <header className="sticky top-0 z-100 flex h-[72px] items-center gap-3 border-b border-border bg-surface/90 px-6 backdrop-blur-[10px] max-sm:h-16 max-sm:px-4">
      <IconButton label="فتح القائمة" onClick={onOpenMobile} className="md:hidden" aria-expanded={mobileOpen} aria-controls={sidebarId}>
        <Icon icon={Menu} size={20} />
      </IconButton>
      <IconButton
        label={collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
        onClick={onToggleCollapse}
        className="max-md:hidden"
        aria-pressed={collapsed}
      >
        <Icon icon={collapsed ? PanelRightOpen : PanelRightClose} size={20} />
      </IconButton>

      <div className="min-w-0 flex-1">
        {!isRoot && (
          <nav aria-label="مسار الصفحة" className="max-sm:hidden">
            <ol className="m-0 flex list-none items-center gap-1 p-0 text-[10px] font-bold text-muted">
              {crumbs.map((c) => (
                <li key={c.to} className="flex items-center gap-1">
                  <Link to={c.to} className="hover:text-primary">
                    {c.label}
                  </Link>
                  <Icon icon={ChevronLeft} size={12} />
                </li>
              ))}
              <li aria-current="page" className="truncate text-text">
                {handle.title}
              </li>
            </ol>
          </nav>
        )}
        <h1 className="m-0 truncate text-[19px] leading-[1.5] max-sm:text-base">{handle.title}</h1>
      </div>

      <ThemeToggle />
      <AdminProfileMenu />
    </header>
  )
}
