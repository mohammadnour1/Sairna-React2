import { useCities, useCompanies } from '@/hooks/queries/useCatalog'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import HeroSection from '@/components/home/HeroSection'
import MetricsStrip from '@/components/home/MetricsStrip'
import DestinationsSection from '@/components/home/DestinationsSection'
import ProcessSection from '@/components/home/ProcessSection'
import TrackingFeature from '@/components/home/TrackingFeature'
import CtaBanner from '@/components/home/CtaBanner'

/** `/` — landing page (reference `homePage()`). */
export default function HomePage() {
  useDocumentTitle()
  const cities = useCities()
  const companies = useCompanies()
  const cityCount = cities.data?.length ?? null

  return (
    <main>
      <HeroSection cityCount={cityCount} />
      <MetricsStrip cityCount={cityCount} companyCount={companies.data?.length ?? null} />
      <DestinationsSection />
      <ProcessSection />
      <TrackingFeature cities={cities.data} />
      <CtaBanner />
    </main>
  )
}
