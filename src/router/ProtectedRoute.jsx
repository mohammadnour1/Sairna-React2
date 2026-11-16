import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { RefreshCw, WifiOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

/**
 * Renders child routes only for signed-in users.
 * Guests are sent to /login with `state.from`, so they come back here after signing in.
 */
export default function ProtectedRoute() {
  const { status, retrySession } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner label="عم نتحقق من حسابك..." />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="site-container py-20">
        <EmptyState
          icon={WifiOff}
          title="تعذّر التحقق من حسابك"
          text="تأكد من الإنترنت وحاول مرة ثانية."
          action={
            <Button onClick={() => retrySession()} iconStart={RefreshCw}>
              حاول مرة ثانية
            </Button>
          }
        />
      </div>
    )
  }

  if (status === 'guest') return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
