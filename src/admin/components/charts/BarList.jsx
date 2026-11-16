/**
 * Ranked horizontal bars (single series). Few rows, so each value is printed at the bar's tip.
 * Bars grow from the start edge (right in RTL) with a 4px rounded data-end.
 *
 * @param {{ items: { key: string|number, label: string, value: number, hint?: string }[],
 *           format?: (n: number) => string, caption: string }} props
 */
export default function BarList({ items, format = (n) => n.toLocaleString('en-US'), caption }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ol className="m-0 flex list-none flex-col gap-3.5 p-0" aria-label={caption}>
      {items.map((item) => (
        <li key={item.key} className="min-w-0">
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
            <span className="min-w-0 truncate font-bold">{item.label}</span>
            <span className="shrink-0 font-black tabular-nums">
              {format(item.value)}
              {item.hint && <small className="ms-1 text-[10px] font-bold text-muted">{item.hint}</small>}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
            <div className="h-full rounded-e-[4px] bg-chart" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  )
}
