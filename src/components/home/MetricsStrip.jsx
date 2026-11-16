import { Fragment } from 'react'
import { STATIC_METRICS } from '@/data/homeContent'

/**
 * Numbers strip under the hero (reference `.metrics-strip`).
 * City and company counts come from the API (bug B12).
 * @param {{ cityCount: number|null, companyCount: number|null }} props
 */
export default function MetricsStrip({ cityCount, companyCount }) {
  const metrics = [
    { value: cityCount ?? '—', label: 'محافظة سورية' },
    { value: companyCount ?? '—', label: 'شركات نقل' },
    ...STATIC_METRICS,
  ]
  return (
    <section className="border-y border-border bg-surface">
      <div className="site-container flex min-h-[107px] items-center justify-around max-sm:grid max-sm:min-h-[140px] max-sm:grid-cols-2 max-sm:gap-x-[7px] max-sm:gap-y-[17px] max-sm:py-5">
        {metrics.map((metric, i) => (
          <Fragment key={metric.label}>
            {i > 0 && <span className="h-9 w-px bg-border max-sm:hidden" aria-hidden="true" />}
            <div className="flex flex-col text-center">
              <strong className="text-[27px] leading-[1.4] font-black text-dark-deep max-sm:text-[23px] dark:text-text">{metric.value}</strong>
              <span className="text-[11px] font-bold text-muted max-sm:text-[10px]">{metric.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
