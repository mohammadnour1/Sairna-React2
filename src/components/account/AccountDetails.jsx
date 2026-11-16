import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

const ROLE_LABELS = { USER: 'حساب مسافر' }

/**
 * Account info rows (reference `.account-details`).
 * @param {{ user: { name:string, email:string, role:string } }} props
 */
export default function AccountDetails({ user }) {
  const rows = [
    ['الاسم الكامل', user.name],
    ['البريد الإلكتروني', user.email, true],
    ['نوع الحساب', ROLE_LABELS[user.role] ?? 'حساب مسافر'],
  ]
  return (
    <div className="rounded-[19px] border border-border bg-surface p-[27px]">
      <h2 className="border-b border-border pb-[17px] text-xl tracking-[-.6px]">معلومات الحساب</h2>
      <dl className="m-0">
        {rows.map(([label, value, ltr]) => (
          <div key={label} className="flex items-center justify-between gap-[13px] border-b border-border py-[18px] text-xs">
            <dt className="text-muted">{label}</dt>
            <dd className="m-0 font-bold" dir={ltr ? 'ltr' : undefined}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <Button to="/trips" iconEnd={ArrowLeft} className="mt-[25px]">
        انتقل لحجوزاتي
      </Button>
    </div>
  )
}
