import { useMemo, useState } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import Skeleton from '@/components/ui/Skeleton'
import QueryState from '@/components/common/QueryState'
import CompanyCard from '@/components/companies/CompanyCard'
import { useCompanies } from '@/hooks/queries/useCatalog'
import { useAllTrips } from '@/hooks/queries/useTrips'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** Routes served and upcoming trips per company, from the real trips list. */
function useCompanyStats(trips, now) {
  return useMemo(() => {
    if (!trips) return null
    const stats = new Map()
    for (const t of trips) {
      const s = stats.get(t.company.id) ?? { routes: new Set(), upcoming: 0 }
      s.routes.add(`${t.origin.id}-${t.destination.id}`)
      if (t.departureAt && new Date(t.departureAt).getTime() > now) s.upcoming += 1
      stats.set(t.company.id, s)
    }
    return new Map([...stats].map(([id, s]) => [id, { routes: s.routes.size, upcoming: s.upcoming }]))
  }, [trips, now])
}

/** `/companies` — transport companies from GET /companies. */
export default function CompaniesPage() {
  useDocumentTitle('شركات النقل')
  const companiesQuery = useCompanies()
  const tripsQuery = useAllTrips()
  const [now] = useState(Date.now)
  const stats = useCompanyStats(tripsQuery.data, now)

  return (
    <main className="min-h-[70vh]">
      <PageBanner
        breadcrumb={[{ label: 'الرئيسية', to: '/' }, { label: 'شركات النقل' }]}
        eyebrow="شركاء الطريق"
        title="شركات بتوصلك"
        highlight="لوين ما بدك."
        text="تعرّف على شركات النقل الموجودة في النموذج واختار الأنسب إلك."
      />
      <section className="site-container py-[86px] max-sm:py-[58px]">
        <div className="grid grid-cols-4 gap-[17px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          <QueryState
            query={companiesQuery}
            loading={[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] rounded-[20px]" />
            ))}
          >
            {(companies) =>
              companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  stats={stats ? (stats.get(company.id) ?? { routes: 0, upcoming: 0 }) : null}
                  to={`/results?company=${company.id}`}
                />
              ))
            }
          </QueryState>
        </div>
        <p className="mt-[23px] mb-0 text-[11px]">
          ملاحظة: بيانات الشركات والرحلات جاية من خادم المشروع التدريبي، وهي ليست معلومات تشغيل حقيقية.
        </p>
      </section>
    </main>
  )
}
