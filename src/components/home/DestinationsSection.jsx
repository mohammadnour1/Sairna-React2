import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import Skeleton from '@/components/ui/Skeleton'
import { FEATURED_DESTINATIONS } from '@/data/homeContent'
import { findCityByName, useTripSearch } from '@/hooks/useTripSearch'
import DestinationCard from './DestinationCard'

const grid = 'grid grid-cols-4 gap-[18px] max-md:grid-cols-2 max-sm:gap-[11px]'

/** "على وين حابب تسافر؟" — 4 destination shortcuts (reference `.destinations`). */
export default function DestinationsSection() {
  const { cities, searchToDestination } = useTripSearch()

  // Only cities that exist in the API are shown.
  const cards = cities
    ? FEATURED_DESTINATIONS.map((d) => ({ ...d, city: findCityByName(cities, d.name) })).filter((d) => d.city)
    : null

  return (
    <section className="py-[86px] max-sm:py-[58px]">
      <div className="site-container">
        <SectionHeading
          eyebrow="اكتشف سوريا"
          title="على وين حابب"
          highlight="تسافر؟"
          text="وجهات مختلفة، ونفس الشعور الحلو لما تكون بالطريق."
          action={
            <Link to="/results" className="group flex items-center gap-2.5 text-xs font-black whitespace-nowrap text-primary-deep">
              استكشف الرحلات
              <Icon icon={ArrowLeft} size={18} className="transition-transform duration-250 group-hover:-translate-x-[5px]" />
            </Link>
          }
        />
        <div className={grid}>
          {cards
            ? cards.map((d) => (
                <DestinationCard
                  key={d.slug}
                  name={d.name}
                  description={d.description}
                  photoKey={d.slug}
                  onSelect={() => searchToDestination(d.city)}
                />
              ))
            : FEATURED_DESTINATIONS.map((d) => (
                <Skeleton key={d.slug} className="aspect-[.87] rounded-[19px] max-md:aspect-[1.35] max-sm:aspect-[.98]" />
              ))}
        </div>
      </div>
    </section>
  )
}
