import { Wallet } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * The only payment method: pay at the company office. The API has no payment field,
 * so the reference's fake "online payment" option is removed.
 */
export default function PaymentInfo() {
  return (
    <div className="mb-[18px] rounded-[17px] border border-border p-[22px]">
      <h3 className="m-0 mb-3.5 text-sm">طريقة تأكيد الحجز</h3>
      <div className="mb-[9px] flex items-center gap-3 rounded-xl border border-primary bg-soft-teal p-[13px]">
        <span className="grid size-[43px] place-items-center rounded-[11px] bg-surface-alt text-primary">
          <Icon icon={Wallet} size={22} />
        </span>
        <span className="flex flex-1 flex-col">
          <b className="text-xs">الدفع في مكتب الشركة</b>
          <small className="text-[10px] text-muted">ادفع عند الحضور لمكتب الشركة قبل موعد الرحلة.</small>
        </span>
      </div>
    </div>
  )
}
