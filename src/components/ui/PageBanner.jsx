import Breadcrumb from './Breadcrumb'
import Eyebrow from './Eyebrow'
import Icon from './Icon'

/**
 * Inner-page header band (reference `.page-banner`).
 * With `art` it uses the two-column `.banner-heading` layout (results page);
 * otherwise eyebrow + `.page-title` + text.
 *
 * @param {{ breadcrumb?: { label: string, to?: string }[], eyebrow?: string, title: import('react').ReactNode,
 *           highlight?: import('react').ReactNode, text?: string, art?: import('react').ComponentType }} props
 */
export default function PageBanner({ breadcrumb, eyebrow, title, highlight, text, art }) {
  const heading = (
    <>
      {title} {highlight && <span className="text-primary">{highlight}</span>}
    </>
  )

  return (
    <section className="banner-ring relative overflow-hidden border-b border-border bg-[linear-gradient(140deg,var(--surface-alt),var(--bg))] pt-[26px] pb-[45px] max-sm:pt-[22px] max-sm:pb-10">
      <div className="site-container">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        {art ? (
          <div className="flex items-center justify-between gap-[25px]">
            <div>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <h1 className="mt-[11px] mb-[5px] text-[36px] max-sm:text-[28px]">{heading}</h1>
              {text && <p className="m-0 text-[13px]">{text}</p>}
            </div>
            <div className="-rotate-7 text-primary opacity-35 max-sm:hidden" aria-hidden="true">
              <Icon icon={art} size={70} />
            </div>
          </div>
        ) : (
          <>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-[11px] mb-1.5 text-[clamp(29px,3.2vw,42px)] max-sm:text-[28px]">{heading}</h1>
            {text && <p className="m-0 text-[13px]">{text}</p>}
          </>
        )}
      </div>
    </section>
  )
}
