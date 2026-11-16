import { cn } from '@/utils/cn'

const sizes = {
  normal: 'size-[49px] basis-[49px] rounded-[14px] text-[27px] max-sm:size-[42px] max-sm:basis-[42px] max-sm:text-[23px]',
  large: 'size-[68px] basis-[68px] rounded-[19px] text-[36px]',
  tiny: 'size-[27px] basis-[27px] rounded-[9px] text-sm',
  pick: 'size-8 basis-8 rounded-[9px] text-lg',
}

/**
 * Coloured letter badge for a company (reference `.company-logo`).
 * Colours come from CSS variables, like the reference `--logo-color` / `--logo-bg`.
 * @param {{ company: { name:string, initial:string, color:string, bg:string, logoUrl?:string|null },
 *           size?: 'normal'|'large'|'tiny'|'pick', className?: string }} props
 */
export default function CompanyLogo({ company, size = 'normal', className }) {
  return (
    <span
      aria-hidden="true"
      style={{ '--logo-color': company.color, '--logo-bg': company.bg }}
      className={cn(
        'grid shrink-0 grow-0 place-items-center overflow-hidden bg-(--logo-bg) font-black text-(--logo-color) shadow-[inset_0_0_0_1px_rgba(0,0,0,.02)]',
        sizes[size],
        className,
      )}
    >
      {company.logoUrl ? <img src={company.logoUrl} alt="" className="size-full object-cover" /> : company.initial}
    </span>
  )
}
