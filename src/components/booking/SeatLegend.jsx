const items = [
  { label: 'متاح', className: 'border-[#b5ced2] bg-surface' },
  { label: 'مختار', className: 'border-primary bg-primary' },
  { label: 'محجوز', className: 'border-[#b5ced2] bg-[#c5d1d5]' },
]

/** Colour key under the seat map (reference `.seat-legend`). */
export default function SeatLegend() {
  return (
    <div className="mt-3.5 flex flex-wrap items-center justify-center gap-[13px] border-t border-border pt-[18px]">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-[5px] text-[10px] text-muted">
          <i className={`size-[13px] rounded-[4px] border ${item.className}`} aria-hidden="true" /> {item.label}
        </span>
      ))}
    </div>
  )
}
