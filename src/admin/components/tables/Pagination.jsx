import { ChevronLeft, ChevronRight } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/** Page numbers with gaps: 1 … 4 5 6 … 12 */
function pageList(page, pages) {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages))
  const sorted = [...set].sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

const btn =
  'inline-grid h-9 min-w-9 place-items-center rounded-[10px] border px-2 text-xs font-extrabold transition-colors disabled:pointer-events-none disabled:opacity-40'
const idle = 'border-border bg-surface hover:border-primary hover:text-primary'

/**
 * Client-side pagination (RTL: "السابق" points right, "التالي" points left).
 * @param {{ page: number, pages: number, total: number, size: number, onChange: (page: number) => void }} props
 */
export default function Pagination({ page, pages, total, size, onChange }) {
  if (pages <= 1) return null
  const from = (page - 1) * size + 1
  const to = Math.min(total, page * size)
  return (
    <nav aria-label="ترقيم الصفحات" className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <span className="text-[11px] font-bold text-muted">
        عرض <bdi>{from}</bdi>–<bdi>{to}</bdi> من <bdi>{total}</bdi>
      </span>
      <div className="flex items-center gap-1.5">
        <button type="button" className={cn(btn, idle)} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="الصفحة السابقة">
          <Icon icon={ChevronRight} size={16} />
        </button>
        {pageList(page, pages).map((p) =>
          typeof p === 'string' ? (
            <span key={p} className="px-1 text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`الصفحة ${p}`}
              className={cn(btn, p === page ? 'border-primary bg-primary text-white' : idle)}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" className={cn(btn, idle)} onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="الصفحة التالية">
          <Icon icon={ChevronLeft} size={16} />
        </button>
      </div>
    </nav>
  )
}
