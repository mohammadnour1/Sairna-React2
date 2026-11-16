import { ArrowLeft } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import CompanyPickCard from './CompanyPickCard'

/**
 * Step 01 "اختار شركة النقل" (reference `.company-pick-section`).
 * Each card shows how many trips that company has on this route/date (real counts).
 *
 * @param {{ companies: object[], value: 'all'|number, counts: Map<number, number>, total: number,
 *           onChange: (value: 'all'|number) => void }} props
 */
export default function CompanyPicker({ companies, value, counts, total, onChange }) {
  return (
    <section className="mt-[31px]" aria-labelledby="pick-company-title">
      <div className="mb-[15px] flex items-center justify-between gap-4 max-sm:items-start">
        <div className="flex items-center gap-[11px]">
          <span className="grid size-9 place-items-center rounded-xl bg-soft-teal text-sm font-black text-primary">01</span>
          <div>
            <h3 id="pick-company-title" className="m-0 text-[15px] max-sm:text-[13px]">
              اختار شركة النقل
            </h3>
            <p className="m-0 text-[11px] max-sm:text-[10px]">حدد الشركة اللي بتفضّلها، ومنعرضلك مواعيدها المتاحة.</p>
          </div>
        </div>
        <span className="flex items-center gap-[7px] text-[11px] font-extrabold text-muted max-sm:hidden">
          02 <Icon icon={ArrowLeft} size={15} /> اختار الوقت والمقعد
        </span>
      </div>
      <div className="grid grid-cols-5 gap-[11px] max-sm:grid-cols-3 max-sm:gap-2">
        <CompanyPickCard caption="قارن الخيارات" active={value === 'all'} onSelect={() => onChange('all')} />
        {companies.map((company) => (
          <CompanyPickCard
            key={company.id}
            company={company}
            caption={`${counts.get(company.id) ?? 0} من ${total} رحلات`}
            active={value === company.id}
            onSelect={() => onChange(company.id)}
          />
        ))}
      </div>
    </section>
  )
}
