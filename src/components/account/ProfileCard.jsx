import { LogOut, Ticket } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { initial } from '@/utils/text'

/**
 * Avatar, name, e-mail, active bookings count and logout (reference `.account-profile`).
 * @param {{ user: object, activeCount: number|null, onLogout: () => void }} props
 */
export default function ProfileCard({ user, activeCount, onLogout }) {
  return (
    <div className="rounded-[19px] border border-border bg-surface p-[27px] text-center">
      <div className="mx-auto mt-[3px] mb-[13px] grid size-[90px] place-items-center rounded-[30px] bg-soft-teal text-[43px] font-black text-primary" aria-hidden="true">
        {initial(user.name)}
      </div>
      <h2 className="m-0 text-xl tracking-[-.6px]">{user.name}</h2>
      <span className="text-xs text-muted" dir="ltr">
        {user.email}
      </span>
      <div className="my-[22px] flex items-center justify-center gap-[7px] rounded-[11px] bg-surface-alt p-[13px] text-xs">
        <Icon icon={Ticket} size={19} className="text-primary" /> <b>{activeCount ?? '…'}</b> حجوزات محفوظة
      </div>
      <Button variant="outline" fullWidth iconStart={LogOut} onClick={onLogout}>
        تسجيل الخروج
      </Button>
    </div>
  )
}
