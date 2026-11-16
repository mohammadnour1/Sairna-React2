import { useState } from 'react'
import { cn } from '@/utils/cn'

/**
 * Company logo from `logoUrl`, or the coloured initial (site palette) when there is no logo
 * or the image fails to load — never a broken-image icon.
 * @param {{ company: { name: string, initial: string, color: string, bg: string, logoUrl?: string|null },
 *           size?: 'sm'|'md'|'lg' }} props
 */
export default function CompanyAvatar({ company, size = 'md' }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const showImage = company.logoUrl && failedUrl !== company.logoUrl
  const sizes = { sm: 'size-8 rounded-[9px] text-sm', md: 'size-10 rounded-[11px] text-lg', lg: 'size-14 rounded-[15px] text-2xl' }
  return (
    <span
      aria-hidden="true"
      style={{ '--logo-color': company.color, '--logo-bg': company.bg }}
      className={cn('grid shrink-0 place-items-center overflow-hidden bg-(--logo-bg) font-black text-(--logo-color)', sizes[size])}
    >
      {showImage ? (
        <img src={company.logoUrl} alt="" referrerPolicy="no-referrer" onError={() => setFailedUrl(company.logoUrl)} className="size-full bg-white object-contain" />
      ) : (
        company.initial
      )}
    </span>
  )
}
