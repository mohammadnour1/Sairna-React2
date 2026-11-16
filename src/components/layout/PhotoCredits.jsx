import { Fragment } from 'react'
import { PHOTO_CREDITS } from '@/data/cityPhotos'

/** Wikimedia attribution line at the bottom of the footer (reference `.photo-credit`). */
export default function PhotoCredits() {
  return (
    <div className="site-container border-t border-[#254451] py-[18px] text-[10px] leading-[2] text-[#9fb9c3]">
      مصادر الصور (Wikimedia Commons):{' '}
      {PHOTO_CREDITS.map((credit, i) => (
        <Fragment key={credit.href}>
          {i > 0 && ' · '}
          <a href={credit.href} target="_blank" rel="noopener noreferrer" className="text-[#b9eee6] underline underline-offset-[3px]">
            {credit.label}
          </a>
        </Fragment>
      ))}
      . تُحمّل الصور عند الاتصال بالإنترنت؛ تُعرض الروابط البديلة عند فشل المصدر الأول.
    </div>
  )
}
