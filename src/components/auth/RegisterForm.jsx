import { ArrowLeft, Mail, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import PasswordField from '@/components/ui/PasswordField'
import TextField from '@/components/ui/TextField'
import { useRegister } from '@/hooks/mutations/useAuthMutations'
import { useAuthForm } from '@/hooks/useAuthForm'

const labelClass = 'text-xs'

/** Register form (reference `authPage('register')`). Password minimum is 8, like the backend (bug B23). */
export default function RegisterForm() {
  const mutation = useRegister()
  const { register, onSubmit, values } = useAuthForm('register', mutation, { name: '', email: '', password: '', terms: false })

  return (
    <form noValidate onSubmit={onSubmit} className="mt-[25px] mb-[15px] flex flex-col gap-[17px]">
      <TextField
        {...register('name')}
        label="الاسم الكامل"
        icon={User}
        size="lg"
        labelClassName={labelClass}
        placeholder="اسمك الكامل"
        autoComplete="name"
        required
      />
      <TextField
        {...register('email')}
        label="البريد الإلكتروني"
        icon={Mail}
        type="email"
        size="lg"
        labelClassName={labelClass}
        placeholder="name@example.com"
        autoComplete="email"
        dir="ltr"
        required
      />
      <PasswordField
        {...register('password')}
        label="كلمة المرور"
        size="lg"
        labelClassName={labelClass}
        placeholder="8 أحرف على الأقل"
        autoComplete="new-password"
        required
      />
      <Checkbox
        {...register('terms')}
        value="accepted"
        checked={values.terms}
        required
        label="أوافق على استخدام بيانات تجريبية في هذا النموذج التعليمي."
      />
      <Button type="submit" fullWidth loading={mutation.isPending} iconEnd={ArrowLeft} iconSize={18} size="custom" className="mt-[3px] min-h-[53px] rounded-xl px-[22px] py-[11px] text-[13px]">
        إنشاء حساب
      </Button>
    </form>
  )
}
