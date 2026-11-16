import { useEffect, useId, useState } from 'react'
import { Search, X } from 'lucide-react'
import Icon from '@/components/ui/Icon'

/**
 * Search box that writes to the URL after a short pause (no request per key press — filtering is local).
 * @param {{ value: string, onChange: (value: string) => void, placeholder?: string, label?: string }} props
 */
export default function SearchInput({ value, onChange, placeholder = 'ابحث...', label = 'بحث' }) {
  const id = useId()
  const [draft, setDraft] = useState(value)

  // Follow outside changes (e.g. "مسح الفلاتر").
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft === value) return undefined
    const t = setTimeout(() => onChange(draft.trim()), 250)
    return () => clearTimeout(t)
  }, [draft, value, onChange])

  return (
    <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[11px] border border-border bg-surface px-3 text-muted focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(16,169,154,.09)] sm:min-w-[240px] sm:max-w-[360px]">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon icon={Search} size={17} />
      <input
        id={id}
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 border-0 bg-transparent text-xs text-text outline-none placeholder:text-[#a5b4bc] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <button type="button" onClick={() => setDraft('')} aria-label="مسح البحث" className="grid place-items-center rounded-md p-1 hover:text-text">
          <Icon icon={X} size={15} />
        </button>
      )}
    </div>
  )
}
