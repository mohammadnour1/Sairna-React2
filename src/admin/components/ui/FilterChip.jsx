import { X } from 'lucide-react'
import Tag from '@/components/ui/Tag'

/**
 * Removable chip for a filter that came from another page (e.g. ?trip=12).
 * @param {{ label: string, onRemove: () => void }} props
 */
export default function FilterChip({ label, onRemove }) {
  return (
    <Tag tone="teal" className="gap-1.5 py-1 ps-3 pe-1.5 text-[11px]">
      {label}
      <button type="button" onClick={onRemove} aria-label={`إزالة فلتر ${label}`} className="grid size-5 place-items-center rounded-full hover:bg-white/60">
        <X size={13} aria-hidden="true" />
      </button>
    </Tag>
  )
}
