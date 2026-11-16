import { Link } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { cn } from '@/utils/cn'

/**
 * The real Sairna logo + wordmark, on the dark sidebar. `compact` = icon only (collapsed sidebar).
 * @param {{ compact?: boolean }} props
 */
export default function AdminBrand({ compact = false }) {
  return (
    <Link to="/admin" className={cn('flex items-center gap-2.5', compact && 'justify-center')} aria-label="سيرنا - لوحة الإدارة">
      <img src={logo} alt="" className="size-10 shrink-0" />
      {!compact && (
        <span className="flex min-w-0 flex-col leading-[1.15]">
          <strong className="text-[25px] font-black tracking-[-1.2px] text-white">
            سيرنا<span className="text-primary">.</span>
          </strong>
          <small className="mt-1 text-[10px] font-bold whitespace-nowrap text-[#8fb8c3]">لوحة الإدارة</small>
        </span>
      )}
    </Link>
  )
}
