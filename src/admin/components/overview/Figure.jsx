/**
 * Small label + value pair (chart card summary row).
 * @param {{ label: string, value: import('react').ReactNode }} props
 */
export default function Figure({ label, value }) {
  return (
    <div className="min-w-0">
      <small className="block text-[10px] font-bold text-muted">{label}</small>
      <strong className="block truncate text-lg font-black">{value}</strong>
    </div>
  )
}
