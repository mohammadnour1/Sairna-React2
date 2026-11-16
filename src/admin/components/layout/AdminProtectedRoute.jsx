import { Navigate, useLocation } from 'react-router-dom'
import { LogOut, RefreshCw, ShieldAlert, WifiOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useAdminLogout } from '../../hooks/useAdminLogout'
import AdminLayout from './AdminLayout'

function FullScreen({ children }) {
  return <main className="grid min-h-dvh place-items-center bg-bg p-5">{children}</main>
}

/**
 * Gate for every dashboard page: no admin token → /admin/login (with `from`);
 * a non-ADMIN role → explicit message; network failure → retry.
 */
export default function AdminProtectedRoute() {
  const { status, retry } = useAdminAuth()
  const logout = useAdminLogout()
  const location = useLocation()

  if (status === 'guest') return <Navigate to="/admin/login" state={{ from: location }} replace />

  if (status === 'loading') {
    return (
      <FullScreen>
        <Spinner label="جارٍ التحقق من جلسة الإدارة..." />
      </FullScreen>
    )
  }

  if (status === 'forbidden') {
    return (
      <FullScreen>
        <EmptyState
          className="w-[min(480px,100%)]"
          icon={ShieldAlert}
          title="لا يملك هذا الحساب صلاحية الإدارة"
          text="لوحة الإدارة مخصّصة لحسابات المشرفين فقط."
          action={
            <Button variant="dark" onClick={logout} iconStart={LogOut}>
              تسجيل الخروج
            </Button>
          }
        />
      </FullScreen>
    )
  }

  if (status === 'error') {
    return (
      <FullScreen>
        <EmptyState
          className="w-[min(480px,100%)]"
          icon={WifiOff}
          title="تعذّر التحقق من جلسة الإدارة"
          text="تحقّق من اتصالك بالإنترنت وحاول مرة أخرى."
          action={
            <Button onClick={() => retry()} iconStart={RefreshCw}>
              حاول مرة أخرى
            </Button>
          }
        />
      </FullScreen>
    )
  }

  return <AdminLayout />
}
