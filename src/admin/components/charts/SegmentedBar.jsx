import { cn } from '@/utils/cn'

const fills = { chart: 'bg-chart', danger: 'bg-chart-danger', muted: 'bg-muted/50' }

/**
 * One whole split into parts (thin 10px bar, 2px surface gap between parts) + a legend
 * that names every part with its count and share — identity never relies on color alone.
 *
 * @param {{ parts: { key: string, label: string, value: number, fill: 'chart'|'danger'|'muted' }[], caption: string }} props
 */
export default function SegmentedBar({ parts, caption }) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  const share = (v) => (total ? Math.round((v / total) * 100) : 0)
  const visible = parts.filter((p) => p.value > 0)

  return (
    <figure className="m-0">
      <div
        className="flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-surface-alt"
        role="img"
        aria-label={`${caption}: ${parts.map((p) => `${p.label} ${p.value}`).join('، ')}`}
      >
        {visible.map((p) => (
          <span key={p.key} className={cn('h-full first:rounded-s-full last:rounded-e-full', fills[p.fill])} style={{ width: `${(p.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center gap-2 text-xs">
            <span className={cn('size-2.5 shrink-0 rounded-[3px]', fills[p.fill])} aria-hidden="true" />
            <span className="font-bold">{p.label}</span>
            <span className="ms-auto font-black tabular-nums">{p.value.toLocaleString('en-US')}</span>
            <span className="w-10 text-end text-[10px] font-bold text-muted tabular-nums">{share(p.value)}%</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
