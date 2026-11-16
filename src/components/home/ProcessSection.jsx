import SectionHeading from '@/components/ui/SectionHeading'
import { PROCESS_STEPS } from '@/data/homeContent'
import ProcessCard from './ProcessCard'

/** "3 خطوات... وتكون بالطريق" (reference `.process-section`). */
export default function ProcessSection() {
  return (
    <section className="border-y border-border bg-surface-alt py-[86px] max-sm:py-[58px]">
      <div className="site-container">
        <SectionHeading
          align="center"
          eyebrow="السفر صار أبسط"
          title="3 خطوات..."
          highlight="وتكون بالطريق"
          text="ما في داعي للتعقيد. كل شي مرتب بواجهة وحدة."
        />
        <div className="relative grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-sm:gap-3">
          {PROCESS_STEPS.map((step, i) => (
            <ProcessCard key={step.number} index={i} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
