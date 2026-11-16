import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { isAdminRole, useAdminAuth } from '../../context/AdminAuthContext'
import { adminLogin } from '../../services/adminAuth.service'

/** Raised locally when the API answers without a token or with a non-ADMIN user. */
export class AdminLoginError extends Error {}

/** POST /auth/login → keep the token (session, or local with "تذكرني") → go to `from` or /admin. */
export function useAdminLogin() {
  const { signIn } = useAdminAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const session = await adminLogin({ email, password })
      if (!session.token) throw new AdminLoginError('لم يُرسل الخادم رمز الدخول. حاول مرة أخرى.')
      if (session.user && !isAdminRole(session.user)) throw new AdminLoginError('هذا الحساب ليس حساب مشرف.')
      return session
    },
    onSuccess: (session, { remember }) => {
      signIn(session, { remember })
      showToast(session.user?.name ? `مرحباً ${session.user.name}، تم تسجيل الدخول إلى لوحة الإدارة.` : 'تم تسجيل الدخول إلى لوحة الإدارة.')
      const from = location.state?.from
      navigate(from?.pathname?.startsWith('/admin') ? from : '/admin', { replace: true })
    },
  })
}
