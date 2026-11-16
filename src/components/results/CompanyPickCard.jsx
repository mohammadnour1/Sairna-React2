import { Bus } from 'lucide-react'
import CompanyLogo from '@/components/common/CompanyLogo'
import Icon from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/**
 * One choice in the company picker (reference `.company-pick`). Without `company` it is "كل الشركات".
 * @param {{ company?: object, caption: string, active: boolean, onSelect: () => void }} props
 */
export default function CompanyPickCard({ company, caption, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'flex min-w-0 flex-col items-center gap-[7px] rounded-[13px] border px-[11px] py-[15px] transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-[3px] hover:border-primary max-sm:px-[5px] max-sm:py-3',
        active ? 'border-primary bg-soft-teal shadow-[0_0_0_2px_rgba(16,177,155,.08)]' : 'border-border bg-surface',
      )}
    >
      {company ? (
        <CompanyLogo company={company} size="pick" />
      ) : (
        <span className="grid size-[27px] place-items-center text-primary">
          <Icon icon={Bus} size={24} />
        </span>
      )}
      <span className="text-[11px] font-black whitespace-nowrap text-text max-sm:text-center max-sm:text-[10px] max-sm:leading-[1.45] max-sm:whitespace-normal">
        {company ? company.name : 'كل الشركات'}
      </span>
      <small className="text-[10px] text-muted">{caption}</small>
    </button>
  )
}
