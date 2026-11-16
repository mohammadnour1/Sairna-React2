import { Phone, User } from 'lucide-react'
import TextField from '@/components/ui/TextField'

/**
 * Name + phone for one traveller (reference `.passenger-card`).
 * @param {{ index: number, seat: number, value: { name:string, phone:string }, errors?: { name?:string, phone?:string },
 *           onChange: (field: 'name'|'phone', value: string) => void, registerRef: (field, el) => void }} props
 */
export default function PassengerCard({ index, seat, value, errors = {}, onChange, registerRef }) {
  return (
    <fieldset className="mb-[17px] rounded-[17px] border border-border p-[22px] max-sm:p-[15px]">
      <legend className="sr-only">بيانات المسافر {index + 1}</legend>
      <div className="mb-[17px] flex items-center gap-2.5">
        <span className="grid size-[30px] place-items-center rounded-full bg-soft-teal font-black text-primary">{index + 1}</span>
        <b>المسافر {index + 1}</b>
        <small className="ms-auto rounded-lg bg-surface-alt px-[9px] py-[5px] text-muted">مقعد رقم {seat ?? '-'}</small>
      </div>
      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        <TextField
          ref={(el) => registerRef('name', el)}
          label="الاسم الكامل"
          icon={User}
          required
          placeholder="مثال: أحمد خالد"
          autoComplete="off"
          value={value.name}
          error={errors.name}
          onChange={(event) => onChange('name', event.target.value)}
        />
        <TextField
          ref={(el) => registerRef('phone', el)}
          label="رقم الموبايل"
          icon={Phone}
          required
          type="tel"
          inputMode="tel"
          dir="ltr"
          placeholder="09xxxxxxxx"
          autoComplete="off"
          value={value.phone}
          error={errors.phone}
          onChange={(event) => onChange('phone', event.target.value)}
        />
      </div>
    </fieldset>
  )
}
