import AuthLayout from '@/components/auth/AuthLayout'
import AuthPanel from '@/components/auth/AuthPanel'
import LoginForm from '@/components/auth/LoginForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** `/login` (guest only). */
export default function LoginPage() {
  useDocumentTitle('تسجيل الدخول')
  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="أهلاً برجعتك"
        title="منوّر،"
        highlight="اشتقنالك!"
        text="ادخل على حسابك، وكمّل حجز رحلتك براحة."
        switchText="لسا ما عندك حساب؟"
        switchLabel="أنشئ حساب جديد"
        switchTo="/register"
      >
        <LoginForm />
      </AuthPanel>
    </AuthLayout>
  )
}
