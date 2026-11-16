import { Outlet } from 'react-router-dom'
import SkipLink from '@/components/ui/SkipLink'
import { AdminAuthProvider } from './context/AdminAuthContext'

/** Top element of `/admin/*`. Loaded lazily, so passengers never download admin code. */
export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <SkipLink label="انتقل إلى المحتوى" />
      <Outlet />
    </AdminAuthProvider>
  )
}
