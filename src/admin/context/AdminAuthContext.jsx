import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/context/ToastContext'
import { adminAuthEvents } from '../api/adminAuthEvents'
import { adminKeys } from '../api/adminQueryKeys'
import { clearAdminToken, getAdminToken, setAdminToken } from '../api/adminToken'
import { getAdminMe } from '../services/adminAuth.service'

const AdminAuthContext = createContext(null)

/** A user is an admin unless the API explicitly says another role. */
export const isAdminRole = (user) => !user?.role || user.role === 'ADMIN'

/**
 * Admin session, fully separate from the passenger AuthContext.
 * The token lives in storage (`sairna-admin-token`); the admin profile always comes from GET /auth/me.
 *
 * status: 'guest' | 'loading' | 'authenticated' | 'forbidden' | 'error'
 */
export function AdminAuthProvider({ children }) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [token, setToken] = useState(getAdminToken)

  const me = useQuery({
    queryKey: adminKeys.me(),
    queryFn: getAdminMe,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const admin = token ? (me.data ?? null) : null
  let status = 'guest'
  if (token) {
    if (admin) status = isAdminRole(admin) ? 'authenticated' : 'forbidden'
    else status = me.isError ? 'error' : 'loading'
  }

  const signIn = useCallback(
    ({ token: newToken, user }, { remember = false } = {}) => {
      setAdminToken(newToken, remember)
      if (user) queryClient.setQueryData(adminKeys.me(), user)
      setToken(newToken)
    },
    [queryClient],
  )

  const signOut = useCallback(() => {
    clearAdminToken()
    setToken(null)
    queryClient.removeQueries({ queryKey: adminKeys.all() })
  }, [queryClient])

  // Latest token for the event handler, without re-subscribing.
  const tokenRef = useRef(token)
  useEffect(() => {
    tokenRef.current = token
  }, [token])

  // adminClient emits this on a 401. <AdminProtectedRoute> then redirects to /admin/login.
  useEffect(
    () =>
      adminAuthEvents.onUnauthorized(() => {
        if (!tokenRef.current) return // many parallel 401s → one toast
        tokenRef.current = null
        setToken(null)
        queryClient.removeQueries({ queryKey: adminKeys.all() })
        showToast('انتهت جلسة الإدارة، يُرجى تسجيل الدخول من جديد.', 'error')
      }),
    [queryClient, showToast],
  )

  const value = useMemo(
    () => ({ admin, status, isAuthenticated: status === 'authenticated', signIn, signOut, retry: me.refetch }),
    [admin, status, signIn, signOut, me.refetch],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return ctx
}
