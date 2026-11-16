import { Link, useLocation } from 'react-router-dom'
import Eyebrow from '@/components/ui/Eyebrow'
import InfoNote from '@/components/ui/InfoNote'

/**
 * Left/right text column of the auth pages (reference `.auth-panel`).
 * The switch link keeps `state.from`, so switching login ↔ register doesn't lose the return page.
 *
 * @param {{ eyebrow: string, title: string, highlight: string, text: string,
 *           switchText: string, switchLabel: string, switchTo: string, children: import('react').ReactNode }} props
 */
export default function AuthPanel({ eyebrow, title, highlight, text, switchText, switchLabel, switchTo, children }) {
  const location = useLocation()
  return (
    <div className="flex flex-col justify-center px-[min(6vw,80px)] py-[49px] max-md:p-9 max-sm:px-[23px] max-sm:py-[29px]">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 mb-[5px] text-[30px] tracking-[-.7px] max-sm:text-[27px]">
          {title} <span className="text-primary">{highlight}</span>
        </h1>
        <p className="text-xs">{text}</p>
      </div>
      {children}
      <p className="mt-3 mb-[15px] text-center text-[11px] text-muted">
        {switchText}{' '}
        <Link to={switchTo} state={location.state} className="font-black text-primary">
          {switchLabel}
        </Link>
      </p>
      <InfoNote variant="auth">هاد مشروع تدريبي. استعمل كلمة مرور خاصة فيه وما تستعمل كلمة مرور حساباتك الحقيقية.</InfoNote>
    </div>
  )
}
