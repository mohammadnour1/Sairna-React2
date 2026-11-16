/**
 * Thin gradient progress bar (reference `.progress-bar`). `value` is 0–1.
 * @param {{ value: number, label?: string }} props
 */
export default function ProgressBar({ value, label }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-[9px] overflow-hidden rounded-[20px] bg-surface-alt"
    >
      <span
        className="block h-full rounded-[20px] bg-[linear-gradient(90deg,#0cb5a3,#69d1b2)] transition-[width] duration-200"
        style={{ width: `${value * 100}%` }}
      />
    </div>
  )
}
