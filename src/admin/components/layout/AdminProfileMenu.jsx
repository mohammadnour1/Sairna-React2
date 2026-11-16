import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ExternalLink, LogOut } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { initial } from '@/utils/text'
import { cn } from '@/utils/cn'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useAdminLogout } from '../../hooks/useAdminLogout'
import StatusBadge from '../ui/StatusBadge'

/** Avatar button + dropdown with the admin's name/email (from GET /auth/me) and logout. */
export default function AdminProfileMenu() {
  const { admin } = useAdminAuth()
  const logout = useAdminLogout()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const name = admin?.name || 'المشرف'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        className="flex h-10 items-center gap-2 rounded-xl border border-border bg-surface ps-1.5 pe-2.5 hover:border-primary"
      >
        <span className="grid size-[30px] place-items-center rounded-[9px] bg-dark text-xs font-black text-white">{initial(name)}</span>
        <span className="max-w-[140px] truncate text-xs font-extrabold max-sm:hidden">{name}</span>
        <Icon icon={ChevronDown} size={15} className={cn('text-muted transition-transform', open && 'rotate-180')} />
        <span className="sr-only">قائمة الحساب</span>
      </button>

      {open && (
        <div id={menuId} className="absolute end-0 top-[calc(100%+8px)] z-120 w-[250px] animate-fade rounded-[14px] border border-border bg-surface p-2 shadow-card-md">
          <div className="border-b border-border px-3 pt-2 pb-3">
            <strong className="block truncate text-[13px]">{name}</strong>
            {admin?.email && (
              <small className="block truncate text-[11px] text-muted" dir="ltr">
                <span className="block text-end">{admin.email}</span>
              </small>
            )}
            {admin?.role && (
              <div className="mt-2">
                <StatusBadge type="role" value={admin.role} />
              </div>
            )}
          </div>
          <Link to="/" onClick={() => setOpen(false)} className="mt-1 flex h-10 items-center gap-2.5 rounded-[10px] px-3 text-xs font-bold hover:bg-surface-alt">
            <Icon icon={ExternalLink} size={17} className="text-muted" />
            عرض الموقع
          </Link>
          <button type="button" onClick={logout} className="flex h-10 w-full items-center gap-2.5 rounded-[10px] px-3 text-xs font-bold text-[#a64645] hover:bg-[#fde8e7] dark:text-[#f4b6b2] dark:hover:bg-[#4a2427]">
            <Icon icon={LogOut} size={17} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  )
}
