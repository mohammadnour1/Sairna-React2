import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Toast from '@/components/ui/Toast'

const ToastContext = createContext(null)
const HIDE_AFTER_MS = 3600

/**
 * Provides `showToast(message, type)` where type is 'info' | 'error'.
 * Two live regions are always mounted (status + alert) so screen readers announce toasts (bug B17).
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ id: 0, message: '', type: 'info', visible: false })
  const timer = useRef(null)

  const showToast = useCallback((message, type = 'info') => {
    clearTimeout(timer.current)
    setToast((prev) => ({ id: prev.id + 1, message, type, visible: true }))
    timer.current = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), HIDE_AFTER_MS)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true">
        {toast.type !== 'error' && <Toast key={toast.id} message={toast.message} type="info" visible={toast.visible} />}
      </div>
      <div role="alert" aria-atomic="true">
        {toast.type === 'error' && <Toast key={toast.id} message={toast.message} type="error" visible={toast.visible} />}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
