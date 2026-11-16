import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'

/**
 * Top route element. AuthProvider lives here (inside the router) so it can redirect
 * to /login when the session expires.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
