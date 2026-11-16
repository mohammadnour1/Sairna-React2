import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { useAdminAuth } from '../context/AdminAuthContext'

/** Ends the admin session (no logout endpoint in the API: the token is dropped locally). */
export function useAdminLogout() {
  const { signOut } = useAdminAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  return useCallback(() => {
    signOut()
    showToast('تم تسجيل الخروج من لوحة الإدارة.')
    navigate('/admin/login', { replace: true })
  }, [signOut, showToast, navigate])
}
