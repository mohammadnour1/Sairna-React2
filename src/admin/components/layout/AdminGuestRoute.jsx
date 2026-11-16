import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

/** /admin/login is for signed-out admins only. */
export default function AdminGuestRoute() {
  const { isAuthenticated } = useAdminAuth()
  if (isAuthenticated) return <Navigate to="/admin" replace />
  return <Outlet />
}
