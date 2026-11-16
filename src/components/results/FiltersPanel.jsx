import { Filter, ShieldCheck } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import RadioList from '@/components/ui/RadioList'
import { TIME_FILTERS } from '@/hooks/useTripFilters'

/**
 * Sidebar filters (reference `.filters-panel`): company radios with real counts + departure time.
 * @param {{ companies: object[], counts: Map<number,number>, total: number, company: 'all'|number,
 *           time: string, onChange: (patch: object) => void, onReset: () => void }} props
 */
export default function FiltersPanel({ companies, counts, total, company, time, onChange, onReset }) {
  const companyOptions = [
    { value: 'all', label: 'كل الشركات', count: total },
    ...companies.map((c) => ({ value: String(c.id), label: c.name, count: counts.get(c.id) ?? 0 })),
  ]

  return (
    <aside className="sticky top-[103px] rounded-[17px] border border-border bg-surface p-[22px] max-md:static max-md:grid max-md:grid-cols-2 max-md:gap-x-[25px] max-md:gap-y-2.5 max-md:p-[18px] max-sm:gap-3 max-sm:p-3.5">
      <div className="flex items-center justify-between gap-[7px] border-b border-border pb-[19px] max-md:col-span-full">
        <h3 className="m-0 flex items-center gap-2 text-[13px]">
          <Icon icon={Filter} size={19} /> تصفية النتائج
        </h3>
        <button type="button" onClick={onReset} className="border-0 bg-transparent text-xs font-extrabold text-primary">
          إعادة ضبط
        </button>
      </div>

      <div className="pt-[22px] max-md:p-[5px] max-sm:p-0">
        <h4 className="mb-[13px] text-xs max-sm:text-[11px]">شركة النقل</h4>
        <RadioList
          name="company-filter"
          legend="شركة النقل"
          options={companyOptions}
          value={String(company)}
          onChange={(v) => onChange({ company: v === 'all' ? 'all' : Number(v) })}
        />
      </div>

      <div className="pt-[22px] max-md:p-[5px] max-sm:p-0">
        <h4 className="mb-[13px] text-xs max-sm:text-[11px]">وقت الانطلاق</h4>
        <RadioList name="time-filter" legend="وقت الانطلاق" options={TIME_FILTERS} value={time} onChange={(v) => onChange({ time: v })} />
      </div>

      <div className="mt-[27px] flex gap-[9px] rounded-xl bg-soft-teal p-[13px] text-primary-deep max-md:m-0 max-sm:col-span-full">
        <Icon icon={ShieldCheck} size={22} className="shrink-0" />
        <p className="m-0 text-[10px] leading-[2] text-text">
          <b className="text-[11px]">الحجز بشكل واضح</b>
          <br />
          كل تفاصيل الرحلة قدامك قبل التأكيد.
        </p>
      </div>
    </aside>
  )
}
