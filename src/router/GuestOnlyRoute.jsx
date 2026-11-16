import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Login/register are for guests only. A signed-in user is sent to `from` (if the login
 * form just succeeded) or to /account.
 */
export default function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (isAuthenticated) return <Navigate to={location.state?.from ?? '/account'} replace />
  return <Outlet />
}
