import { ArrowLeft, Info, Star } from 'lucide-react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import CompanyLogo from '@/components/common/CompanyLogo'
import ServicePills from '@/components/common/ServicePills'

/**
 * One transport company (reference `.company-card`).
 * The meta block shows only numbers computed from real trips — the reference `+12` / `يومياً`
 * were hard-coded (bug B12).
 *
 * @param {{ company: object, stats: { routes: number, upcoming: number }|null, to: string }} props
 */
export default function CompanyCard({ company, stats, to }) {
  return (
    <article className="rounded-[20px] border border-border bg-surface p-[22px] transition-[transform,box-shadow] duration-250 hover:-translate-y-1.5 hover:shadow-card">
      <div className="mb-5 flex items-start justify-between gap-2">
        <CompanyLogo company={company} size="large" />
        {company.rating != null ? (
          <Tag tone="teal" icon={Star} iconSize={14}>
            {company.rating} / 5
          </Tag>
        ) : (
          company.tag && (
            <Tag tone="teal" icon={Info} iconSize={14}>
              {company.tag}
            </Tag>
          )
        )}
      </div>
      <h2 className="mt-0 mb-[7px] text-[17px] tracking-[-.6px]">{company.name}</h2>
      {company.about && <p className="min-h-[74px] text-[11px] leading-[2] max-lg:min-h-0">{company.about}</p>}
      {company.features.length > 0 && (
        <div className="my-3.5 flex flex-wrap gap-[5px]">
          <ServicePills features={company.features} />
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-2 gap-3 border-t border-border py-[15px]">
          <div className="flex flex-col">
            <b className="text-base">{stats.routes}</b>
            <small className="text-[10px] text-muted">خطوط سفر</small>
          </div>
          <div className="flex flex-col">
            <b className="text-base">{stats.upcoming}</b>
            <small className="text-[10px] text-muted">رحلة قادمة</small>
          </div>
        </div>
      )}
      <Button to={to} variant="outline" fullWidth iconEnd={ArrowLeft} size="custom" className="min-h-[49px] rounded-xl px-2 py-[11px] text-[11px]">
        عرض رحلات الشركة
      </Button>
    </article>
  )
}
