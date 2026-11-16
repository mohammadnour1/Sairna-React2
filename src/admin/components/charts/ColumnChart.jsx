import { useState } from 'react'
import { cn } from '@/utils/cn'

/** Clean, even axis maximum (so the middle tick is a whole number): 7 → 8, 23 → 30, 140 → 200. */
function niceMax(value) {
  if (value <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(value))
  return [2, 4, 6, 8, 10].map((s) => s * pow).find((c) => c >= value) ?? 10 * pow
}

/**
 * Single-series column chart (hand-written, no library). In RTL the first point sits on the right,
 * so time reads right → left like the rest of the page.
 * - columns ≤ 22px thick, 4px rounded data-end, square at the baseline
 * - hairline gridlines; every column is focusable and shows a tooltip on hover/focus
 * - a screen-reader table carries every value
 *
 * @param {{ data: { key: string, label: string, shortLabel: string, value: number }[], unit: string,
 *           labelEvery?: number, caption: string }} props
 */
export default function ColumnChart({ data, unit, labelEvery = 1, caption }) {
  const [active, setActive] = useState(null)
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)))
  const ticks = [max, max * 0.5, 0]

  return (
    <figure className="m-0">
      <div className="relative flex h-[210px] gap-3 max-sm:h-[180px]">
        {/* y axis */}
        <div className="flex w-7 shrink-0 flex-col justify-between pb-6 text-end text-[10px] text-muted tabular-nums" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* gridlines */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} className="h-px bg-border" />
            ))}
          </div>

          <div className="absolute inset-x-0 top-0 bottom-0 flex items-stretch">
            {data.map((d, i) => {
              const pct = max ? (d.value / max) * 100 : 0
              const isActive = active === d.key
              return (
                <div key={d.key} className="relative flex min-w-0 flex-1 flex-col items-center">
                  <button
                    type="button"
                    className="group relative flex w-full flex-1 cursor-default items-end justify-center rounded-md px-[1px] outline-none focus-visible:bg-soft-teal/60"
                    onPointerEnter={() => setActive(d.key)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(d.key)}
                    onBlur={() => setActive(null)}
                    aria-label={`${d.label}: ${d.value} ${unit}`}
                  >
                    <span
                      className={cn('block w-full max-w-[22px] rounded-t-[4px] bg-chart transition-opacity', active && !isActive && 'opacity-45', d.value === 0 && 'min-h-px opacity-40')}
                      style={{ height: `${pct}%` }}
                    />
                    {isActive && (
                      <span className="pointer-events-none absolute bottom-[calc(100%+6px)] z-10 rounded-[9px] border border-border bg-surface px-2.5 py-1.5 text-center whitespace-nowrap shadow-card-md">
                        <strong className="block text-sm text-text">{d.value}</strong>
                        <small className="block text-[10px] text-muted">{d.label}</small>
                      </span>
                    )}
                  </button>
                  <span className="h-6 pt-1.5 text-[9px] leading-none whitespace-nowrap text-muted" aria-hidden="true">
                    {i % labelEvery === 0 || i === data.length - 1 ? d.shortLabel : ''}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.label}</th>
              <td>
                {d.value} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
