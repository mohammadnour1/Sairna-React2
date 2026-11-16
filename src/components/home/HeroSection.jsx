import { CircleCheck } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import Icon from '@/components/ui/Icon'
import { HERO_POINTS } from '@/data/homeContent'
import HeroSocialProof from './HeroSocialProof'
import HeroVisual from './HeroVisual'
import SearchShell from './SearchShell'

/**
 * Home hero: copy + photo + search card (reference `.hero-section`).
 * @param {{ cityCount: number|null }} props
 */
export default function HeroSection({ cityCount }) {
  return (
    <section className="hero-glow relative bg-[linear-gradient(160deg,#f5fbfa_0%,#f8fbfc_56%,#f3f9f7_100%)] pt-[65px] pb-[71px] max-sm:pt-8 max-sm:pb-[52px] dark:bg-[linear-gradient(160deg,#102f3d,var(--bg))]">
      <div className="site-container">
        <div className="grid min-h-[420px] grid-cols-[.95fr_1.05fr] items-center gap-9 max-md:grid-cols-2 max-md:gap-2 max-sm:grid-cols-1 max-sm:gap-0">
          <div className="relative z-1 pb-[34px] max-sm:pb-0">
            <Eyebrow>أهلاً فيك بسيرنا</Eyebrow>
            <h1 className="mt-[19px] mb-[11px] text-[clamp(48px,5.15vw,79px)] leading-[1.33] font-black tracking-[-2.4px] text-dark-deep max-lg:text-[clamp(45px,5vw,66px)] max-md:text-[49px] max-sm:mt-4 max-sm:text-[clamp(44px,11vw,62px)] max-sm:tracking-[-1.8px] dark:text-text">
              المحطة الجاية؟
              <br />
              <span className="gradient-text">على كيفك.</span>
            </h1>
            <p className="mb-[22px] max-w-[485px] text-base leading-[2.15] max-lg:text-sm max-md:text-xs max-sm:max-w-[480px] max-sm:text-[13px] max-sm:leading-[2]">
              من حلب لدمشق، ومن الساحل للجزيرة. لاقي الرحلة اللي بتناسبك، اختار مقعدك، وخلّي الطريق علينا.
            </p>
            <div className="flex flex-wrap items-center gap-5 max-md:gap-2.5 max-sm:gap-[13px]">
              {HERO_POINTS.map((point) => (
                <span key={point} className="flex items-center gap-1.5 text-[11px] font-extrabold text-text max-md:text-[10px]">
                  <Icon icon={CircleCheck} size={17} className="text-primary" /> {point}
                </span>
              ))}
            </div>
            <HeroSocialProof />
          </div>
          <HeroVisual cityCount={cityCount} />
        </div>
        <SearchShell />
      </div>
    </section>
  )
}
