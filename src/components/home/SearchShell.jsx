import { Sparkles } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import Skeleton from '@/components/ui/Skeleton'
import SearchForm from '@/components/common/SearchForm'
import { useTripSearch } from '@/hooks/useTripSearch'
import QueryState from '@/components/common/QueryState'

/** White card under the hero holding the home search form (reference `.search-shell`). */
export default function SearchShell() {
  const { citiesQuery, cities, initialValues, search } = useTripSearch()

  return (
    <div className="relative z-3 mt-[22px] rounded-[21px] border border-border bg-surface px-6 pt-[22px] pb-[25px] shadow-[0_21px_58px_rgba(11,71,72,.1)] max-sm:mt-5 max-sm:px-3.5 max-sm:py-[18px]">
      <div className="mb-4 flex items-center justify-between max-sm:items-start max-sm:gap-2.5">
        <div className="flex items-center gap-[11px] max-sm:flex-wrap max-sm:gap-1.5">
          <span className="size-[9px] rounded-full bg-primary shadow-[0_0_0_5px_var(--soft-teal)]" aria-hidden="true" />
          <strong className="text-[15px] max-sm:text-[13px]">وين رحلتك الجاية؟</strong>
          <span className="text-[11px] text-muted max-sm:basis-full max-sm:text-[10px]">اختار وجهتك وباقي التفاصيل علينا</span>
        </div>
        <div className="inline-flex items-center gap-[5px] text-[10px] font-extrabold text-[#14968d] max-sm:hidden">
          <Icon icon={Sparkles} size={16} /> الحجز بـ 3 خطوات
        </div>
      </div>
      <QueryState query={citiesQuery} loading={<Skeleton className="h-[60px] w-full rounded-[11px]" />}>
        {() => <SearchForm cities={cities} initialValues={initialValues} onSubmit={(values) => search(values)} />}
      </QueryState>
    </div>
  )
}
