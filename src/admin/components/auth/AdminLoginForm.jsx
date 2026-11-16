import { useState } from 'react'
import { CircleAlert, LogIn, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Icon from '@/components/ui/Icon'
import PasswordField from '@/components/ui/PasswordField'
import TextField from '@/components/ui/TextField'
import { EMAIL_PATTERN } from '@/utils/validation'
import { getAdminErrorMessage, getAdminFieldErrors } from '../../api/adminErrors'
import { AdminLoginError, useAdminLogin } from '../../hooks/mutations/useAdminLogin'

function validate({ email, password }) {
  const errors = {}
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'أدخل بريد إلكتروني صحيح.'
  if (!password) errors.password = 'أدخل كلمة المرور.'
  return errors
}

/** Admin email/password form. Credentials are only sent to the API — never stored. */
export default function AdminLoginForm() {
  const [values, setValues] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const login = useAdminLogin()

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((all) => ({ ...all, [field]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`admin-${Object.keys(found)[0]}`)?.focus()
      return
    }
    login.mutate(values, { onError: (error) => setErrors(getAdminFieldErrors(error)) })
  }

  const serverError = login.isError
    ? login.error instanceof AdminLoginError
      ? login.error.message
      : getAdminErrorMessage(login.error, 'تعذّر تسجيل الدخول.')
    : null

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {serverError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-[#fde8e7] p-3 text-[11px] font-bold text-[#a64645] dark:bg-[#4a2427] dark:text-[#f4b6b2]">
          <Icon icon={CircleAlert} size={18} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}
      <TextField
        id="admin-email"
        label="البريد الإلكتروني"
        icon={Mail}
        type="email"
        dir="ltr"
        autoComplete="username"
        value={values.email}
        onChange={set('email')}
        error={errors.email}
        required
        size="lg"
      />
      <PasswordField
        id="admin-password"
        label="كلمة المرور"
        autoComplete="current-password"
        value={values.password}
        onChange={set('password')}
        error={errors.password}
        required
        size="lg"
      />
      <Checkbox label="تذكّرني على هذا الجهاز" checked={values.remember} onChange={set('remember')} />
      <Button type="submit" variant="dark" fullWidth loading={login.isPending} iconStart={LogIn} className="mt-1 min-h-[52px]">
        {login.isPending ? 'جارٍ التحقق...' : 'دخول لوحة الإدارة'}
      </Button>
    </form>
  )
}
