import AuthLayout from '@/components/auth/AuthLayout'
import AuthPanel from '@/components/auth/AuthPanel'
import RegisterForm from '@/components/auth/RegisterForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** `/register` (guest only). */
export default function RegisterPage() {
  useDocumentTitle('إنشاء حساب')
  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="انضم لعيلة سيرنا"
        title="خلّينا نبدأ"
        highlight="المشوار سوا."
        text="حساب بسيط، ورحلاتك كلها بين إيديك."
        switchText="عندك حساب من قبل؟"
        switchLabel="سجّل دخولك"
        switchTo="/login"
      >
        <RegisterForm />
      </AuthPanel>
    </AuthLayout>
  )
}
