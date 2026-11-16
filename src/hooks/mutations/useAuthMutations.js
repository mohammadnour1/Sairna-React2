import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { login, register } from '@/services/auth.service'

const WELCOME = 'أهلاً وسهلاً! تم تسجيل الدخول.'

/** Where to go after signing in: the page that sent the user to /login, else /account. */
function useAfterAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  return () => navigate(from ?? '/account', { replace: true })
}

/** POST /auth/login → saves the token (remember → localStorage, else sessionStorage). */
export function useLogin() {
  const { signIn } = useAuth()
  const { showToast } = useToast()
  const goNext = useAfterAuth()
  return useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (session, { remember }) => {
      signIn(session, { remember })
      showToast(WELCOME)
      goNext()
    },
  })
}

/** POST /auth/register → the API returns a token, so the user is signed in right away (remembered). */
export function useRegister() {
  const { signIn } = useAuth()
  const { showToast } = useToast()
  const goNext = useAfterAuth()
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const session = await register({ name, email, password })
      // Fallback if a future backend stops returning a token on register.
      return session.token ? session : login({ email, password })
    },
    onSuccess: (session) => {
      signIn(session, { remember: true })
      showToast(WELCOME)
      goNext()
    },
  })
}
