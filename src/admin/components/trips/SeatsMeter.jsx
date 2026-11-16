/**
 * "12 / 40" booked seats with a thin meter. Hidden values stay '—' (never guessed).
 * @param {{ booked: number|null, total: number|null }} props
 */
export default function SeatsMeter({ booked, total }) {
  if (total == null) return <span className="text-muted">—</span>
  const pct = booked != null && total ? Math.min(100, (booked / total) * 100) : 0
  return (
    <div className="w-[92px]">
      <span className="text-xs font-extrabold tabular-nums" dir="ltr">
        {booked ?? '—'} / {total}
      </span>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
        <div className="h-full rounded-e-[4px] bg-chart" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
