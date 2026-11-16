import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import PasswordField from '@/components/ui/PasswordField'
import TextField from '@/components/ui/TextField'
import { useLogin } from '@/hooks/mutations/useAuthMutations'
import { useAuthForm } from '@/hooks/useAuthForm'

const labelClass = 'text-xs'

/** Login form (reference `authPage('login')`). "تذكرني" chooses localStorage vs sessionStorage (bug B14). */
export default function LoginForm() {
  const mutation = useLogin()
  const { register, onSubmit, values } = useAuthForm('login', mutation, { email: '', password: '', remember: false })
  const remember = register('remember')

  return (
    <form noValidate onSubmit={onSubmit} className="mt-[25px] mb-[15px] flex flex-col gap-[17px]">
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
        autoComplete="current-password"
        required
      />
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <Checkbox label="تذكرني" name="remember" checked={values.remember} onChange={remember.onChange} />
        <Link to="/support" className="font-black text-primary">
          نسيت كلمة المرور؟
        </Link>
      </div>
      <Button type="submit" fullWidth loading={mutation.isPending} iconEnd={ArrowLeft} iconSize={18} size="custom" className="mt-[3px] min-h-[53px] rounded-xl px-[22px] py-[11px] text-[13px]">
        تسجيل الدخول
      </Button>
    </form>
  )
}
