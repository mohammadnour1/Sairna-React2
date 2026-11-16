import { cn } from '@/utils/cn'

/**
 * Label/value grid for detail pages. Items with `value == null` are skipped,
 * so a field the API did not return is not shown as fake data.
 * @param {{ items: { label: string, value: import('react').ReactNode, ltr?: boolean }[], columns?: 2|3 }} props
 */
export default function DetailList({ items, columns = 2 }) {
  const visible = items.filter((i) => i.value != null && i.value !== '')
  return (
    <dl className={cn('m-0 grid gap-x-5 gap-y-4 max-sm:grid-cols-1', columns === 3 ? 'grid-cols-3 max-md:grid-cols-2' : 'grid-cols-2')}>
      {visible.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="mb-0.5 text-[10px] font-bold text-muted">{item.label}</dt>
          <dd className="m-0 text-[13px] font-extrabold break-words" dir={item.ltr ? 'ltr' : undefined}>
            <span className={item.ltr ? 'block text-end' : undefined}>{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
