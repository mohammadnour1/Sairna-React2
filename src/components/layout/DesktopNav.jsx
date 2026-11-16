import { Link } from 'react-router-dom'
import { MAIN_NAV } from '@/data/navigation'
import { cn } from '@/utils/cn'
import { useNavActive } from './useNavActive'

/** Header links for wide screens (reference `.desktop-nav`, hidden below 901px). */
export default function DesktopNav() {
  const isActive = useNavActive()
  return (
    <nav aria-label="التنقل الرئيسي" className="mx-auto flex items-center gap-[27px] max-lg:gap-[15px] max-md:hidden">
      {MAIN_NAV.map((item) => {
        const active = isActive(item)
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'nav-link relative py-8 text-xs font-extrabold whitespace-nowrap hover:text-text max-lg:text-[11px]',
              active ? 'text-text' : 'text-muted',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
