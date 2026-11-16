import Eyebrow from './Eyebrow'
import { cn } from '@/utils/cn'

/**
 * Section title block. `align="row"` → `.section-title-row` (title + action side by side);
 * `align="center"` → `.section-centered`.
 *
 * @param {{ eyebrow?: string, title: import('react').ReactNode, highlight?: import('react').ReactNode,
 *           text?: string, align?: 'row'|'center', action?: import('react').ReactNode, id?: string }} props
 */
export default function SectionHeading({ eyebrow, title, highlight, text, align = 'row', action, id }) {
  const content = (
    <>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-3 mb-1.5 text-[clamp(25px,3vw,36px)] tracking-[-.6px] max-sm:text-[28px]">
        {title} {highlight && <span className="text-primary">{highlight}</span>}
      </h2>
      {text && <p className="text-xs">{text}</p>}
    </>
  )

  if (align === 'center') return <div className="mb-[35px] text-center">{content}</div>

  return (
    <div
      className={cn(
        'mb-7 flex items-end justify-between gap-[25px]',
        'max-sm:flex-col max-sm:items-start max-sm:gap-2.5',
      )}
    >
      <div>{content}</div>
      {action}
    </div>
  )
}
