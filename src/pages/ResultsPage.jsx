import { Bus } from 'lucide-react'
import PageBanner from '@/components/ui/PageBanner'
import Skeleton from '@/components/ui/Skeleton'
import SearchForm from '@/components/common/SearchForm'
import CompanyPicker from '@/components/results/CompanyPicker'
import FiltersPanel from '@/components/results/FiltersPanel'
import ResultsHeader from '@/components/results/ResultsHeader'
import TripList from '@/components/results/TripList'
import { useTrips } from '@/hooks/queries/useTrips'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useResultsParams } from '@/hooks/useResultsParams'
import { useTripFilters } from '@/hooks/useTripFilters'
import { useTripSearch } from '@/hooks/useTripSearch'

/** `/results` — search results with company picker, filters and sorting (reference `resultsPage()`). */
export default function ResultsPage() {
  useDocumentTitle('نتائج البحث')
  const { ready, cities, companies, criteria, filters, setFilters, resetFilters } = useResultsParams()
  const { search } = useTripSearch()
  const tripsQuery = useTrips(criteria, { enabled: ready })
  const { filtered, total, countsByCompany } = useTripFilters(tripsQuery.data, filters)

  const origin = cities?.find((c) => c.id === criteria.originId)
  const destination = cities?.find((c) => c.id === criteria.destinationId)
  const formKey = `${criteria.originId}-${criteria.destinationId}-${criteria.date}-${criteria.people}`

  return (
    <main className="min-h-[70vh]">
      <PageBanner
        breadcrumb={[{ label: 'الرئيسية', to: '/' }, { label: 'نتائج البحث' }]}
        eyebrow="لنكمل الطريق"
        title="اختار الرحلة"
        highlight="اللي بتشبهك."
        text="قارن بين الشركات والأوقات، واحجز مقعدك بكل سهولة."
        art={Bus}
      />
      <section className="site-container pb-[90px]">
        <div className="relative z-2 -mt-[25px] rounded-[18px] border border-border bg-surface p-[18px] shadow-card max-sm:p-3">
          {ready ? (
            <SearchForm key={formKey} variant="compact" cities={cities} initialValues={criteria} onSubmit={(values) => search(values)} />
          ) : (
            <Skeleton className="h-[57px] w-full rounded-[11px]" />
          )}
        </div>

        <CompanyPicker
          companies={companies}
          value={filters.company}
          counts={countsByCompany}
          total={total}
          onChange={(company) => setFilters({ company })}
        />

        <ResultsHeader
          count={tripsQuery.data ? filtered.length : null}
          origin={origin}
          destination={destination}
          date={criteria.date}
          people={criteria.people ?? 1}
          sort={filters.sort}
          onSortChange={(sort) => setFilters({ sort })}
        />

        <div className="grid grid-cols-[244px_minmax(0,1fr)] items-start gap-5 max-md:grid-cols-1">
          <FiltersPanel
            companies={companies}
            counts={countsByCompany}
            total={total}
            company={filters.company}
            time={filters.time}
            onChange={setFilters}
            onReset={resetFilters}
          />
          <TripList query={tripsQuery} trips={filtered} total={total} people={criteria.people ?? 1} onClearFilters={resetFilters} />
        </div>
      </section>
    </main>
  )
}
