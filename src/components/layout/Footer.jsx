import { Link } from 'react-router-dom'
import { Globe, Mail, Phone } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { CONTACT_EMAIL, FOOTER_COLUMNS } from '@/data/navigation'
import Logo from './Logo'
import PhotoCredits from './PhotoCredits'

/** Site footer (reference `.footer`). Social icons are decorative only, not links (bug B18). */
export default function Footer() {
  return (
    <footer className="bg-dark-deep pt-14 text-[#d2e4e9] max-sm:pt-10">
      <div className="site-container grid grid-cols-[2fr_1fr_1fr_1.25fr] gap-10 pb-[50px] max-md:grid-cols-[1.5fr_1fr_1fr] max-md:gap-[25px] max-sm:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-[26px] max-sm:pb-[33px]">
        <div className="max-sm:col-span-full">
          <Logo onDark />
          <p className="my-[17px] max-w-[290px] text-xs leading-[2.1] text-[#9cb4c0] max-sm:my-3">
            طريقة أجمل وأسهل للسفر بين المحافظات السورية. ابحث، اختار، واحجز بكل راحة.
          </p>
          <div className="flex gap-[9px]" aria-hidden="true">
            {[Globe, Mail, Phone].map((icon, i) => (
              <span key={i} className="grid size-[35px] place-items-center rounded-[10px] border border-[#335362] text-[#cce9e9]">
                <Icon icon={icon} size={17} />
              </span>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((column, i) => (
          <div
            key={column.title}
            className={
              i === FOOTER_COLUMNS.length - 1
                ? 'flex flex-col items-start gap-[13px] max-md:col-[2/4] max-sm:col-auto'
                : 'flex flex-col items-start gap-[13px]'
            }
          >
            <h4 className="mt-1.5 mb-2.5 text-[13px] text-white max-sm:text-xs">{column.title}</h4>
            {column.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[11px] text-[#a3c0ca] transition-colors duration-200 hover:text-[#40d1bb] max-sm:text-[10px]"
              >
                {link.label}
              </Link>
            ))}
            {i === FOOTER_COLUMNS.length - 1 && (
              <div className="flex items-center gap-2 text-[11px] text-[#a3c0ca]" dir="ltr">
                <Icon icon={Mail} size={16} /> {CONTACT_EMAIL}
              </div>
            )}
          </div>
        ))}
      </div>
      <PhotoCredits />
    </footer>
  )
}
