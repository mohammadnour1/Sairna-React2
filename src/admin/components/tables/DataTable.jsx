import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

/**
 * Responsive data table. ≥651px: a real <table> (scrolls sideways if needed).
 * <651px: each row becomes a card (primary column as title, the rest as label/value pairs).
 *
 * @param {{
 *   columns: { key: string, header: string, cell: (row:any) => import('react').ReactNode,
 *              className?: string, primary?: boolean, hideOnMobile?: boolean }[],
 *   rows: any[], getRowKey?: (row:any) => string|number, loading?: boolean, empty?: import('react').ReactNode,
 *   actions?: (row:any) => import('react').ReactNode, caption: string, skeletonRows?: number, minWidth?: string
 * }} props
 */
export default function DataTable({
  columns,
  rows,
  getRowKey = (r) => r.id,
  loading = false,
  empty = null,
  actions,
  caption,
  skeletonRows = 6,
  minWidth = 'min-w-[720px]',
}) {
  if (!loading && rows.length === 0) return empty

  const primary = columns.find((c) => c.primary) ?? columns[0]
  const secondary = columns.filter((c) => c !== primary && !c.hideOnMobile)

  return (
    <>
      <div className="overflow-x-auto rounded-[16px] border border-border bg-surface max-sm:hidden">
        <table className={cn('w-full border-collapse text-start text-xs', minWidth)}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-surface-alt text-[11px] text-muted">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn('px-4 py-3 text-start font-extrabold whitespace-nowrap', c.className)}>
                  {c.header}
                </th>
              ))}
              {actions && (
                <th scope="col" className="px-4 py-3 text-end font-extrabold">
                  <span className="sr-only">إجراءات</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={i} className="border-t border-border">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-4">
                        <Skeleton className="h-3.5 w-[70%]" />
                      </td>
                    ))}
                    {actions && <td className="px-4 py-4" />}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={getRowKey(row)} className="border-t border-border transition-colors hover:bg-surface-alt/60">
                    {columns.map((c) => (
                      <td key={c.key} className={cn('px-4 py-3 align-middle', c.className)}>
                        {c.cell(row)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-2 text-end whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">{actions(row)}</div>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2.5 p-0 sm:hidden" aria-label={caption}>
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="rounded-[14px] border border-border bg-surface p-4">
                <Skeleton className="mb-3 h-4 w-1/2" />
                <Skeleton className="mb-2 h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
              </li>
            ))
          : rows.map((row) => (
              <li key={getRowKey(row)} className="rounded-[14px] border border-border bg-surface p-4">
                <div className="mb-2.5 text-[13px] font-extrabold">{primary.cell(row)}</div>
                <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] max-xs:grid-cols-1">
                  {secondary.map((c) => (
                    <div key={c.key} className="min-w-0">
                      <dt className="text-[10px] font-bold text-muted">{c.header}</dt>
                      <dd className="m-0 min-w-0 font-bold break-words">{c.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
                {actions && <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">{actions(row)}</div>}
              </li>
            ))}
      </ul>
    </>
  )
}
