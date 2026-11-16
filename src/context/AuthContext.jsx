import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authEvents } from '@/api/authEvents'
import { queryKeys } from '@/api/queryKeys'
import { useMe } from '@/hooks/queries/useAuthQueries'
import { useToast } from './ToastContext'
import { clearToken, getToken, setToken } from '@/utils/storage'

const AuthContext = createContext(null)

/**
 * Session state. The token lives in storage; the user ALWAYS comes from GET /auth/me.
 * Rendered inside the router (pages under it use router hooks).
 *
 * status: 'guest' | 'loading' | 'authenticated' | 'error'
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [token, setTokenState] = useState(getToken)

  const me = useMe(Boolean(token))
  const user = token ? (me.data ?? null) : null
  // 'error' = we have a token but /auth/me failed for a non-401 reason (e.g. network).
  // A 401 is handled by the interceptor, which clears the token → 'guest'.
  const status = !token ? 'guest' : user ? 'authenticated' : me.isError ? 'error' : 'loading'
  const retrySession = me.refetch

  const clearUserData = useCallback(() => {
    queryClient.removeQueries({ queryKey: queryKeys.me() })
    queryClient.removeQueries({ queryKey: queryKeys.allBookings() })
  }, [queryClient])

  /** Called after a successful login/register. */
  const signIn = useCallback(
    ({ token: newToken, user: newUser }, { remember = true } = {}) => {
      setToken(newToken, remember)
      if (newUser) queryClient.setQueryData(queryKeys.me(), newUser)
      setTokenState(newToken)
    },
    [queryClient],
  )

  const signOut = useCallback(() => {
    clearToken()
    setTokenState(null)
    clearUserData()
  }, [clearUserData])

  // Latest token, readable from the event handler without re-subscribing.
  const tokenRef = useRef(token)
  useEffect(() => {
    tokenRef.current = token
  }, [token])

  // The axios interceptor emits 'unauthorized' when a token is rejected.
  // We only end the session here. Redirecting is not needed on public pages (the visitor
  // just becomes a guest); protected pages redirect by themselves through <ProtectedRoute>,
  // which keeps `state.from` so the user comes back after signing in.
  useEffect(
    () =>
      authEvents.on('unauthorized', () => {
        if (!tokenRef.current) return // several requests can fail together → one toast only
        tokenRef.current = null
        setTokenState(null)
        clearUserData()
        showToast('انتهت الجلسة، سجّل دخولك من جديد.', 'error')
      }),
    [clearUserData, showToast],
  )

  const value = useMemo(
    () => ({ token, user, status, isAuthenticated: status === 'authenticated', signIn, signOut, retrySession }),
    [token, user, status, signIn, signOut, retrySession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
