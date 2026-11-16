import { useState } from 'react'
import { Armchair, ArrowLeft, Bus, Route, Star } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import CompanyLogo from '@/components/common/CompanyLogo'
import ServicePills from '@/components/common/ServicePills'
import { formatDuration, formatMoney, formatTime } from '@/utils/format'

/**
 * One trip in the results list (reference `tripCard()`).
 * The button is disabled when the trip has fewer seats than travellers (bug B4) or already left.
 *
 * @param {{ trip: object, people: number }} props
 */
export default function TripCard({ trip, people }) {
  const { company } = trip
  const [now] = useState(Date.now) // captured once per card, keeps render pure
  const departed = trip.departureAt && new Date(trip.departureAt).getTime() <= now
  const notEnoughSeats = trip.availableSeats != null && trip.availableSeats < people
  const disabled = departed || notEnoughSeats || !trip.isBookable
  const buttonLabel = departed ? 'انطلقت الرحلة' : notEnoughSeats ? 'المقاعد المتاحة ما بتكفي' : 'اختيار المقاعد'

  return (
    <article className="overflow-hidden rounded-[17px] border border-border bg-surface transition-[box-shadow,border-color,transform] duration-250 hover:-translate-y-[3px] hover:border-[#b4e4db] hover:shadow-card-md">
      <div className="flex items-center justify-between gap-2.5 px-[23px] pt-[19px] pb-[13px] max-sm:px-3.5 max-sm:pt-[15px] max-sm:pb-2">
        <div className="flex items-center gap-[11px] max-xs:gap-1.5">
          <CompanyLogo company={company} />
          <div>
            <strong className="block text-[13px] max-sm:text-xs">{company.name}</strong>
            {(company.rating != null || company.tag) && (
              <span className="flex items-center gap-1 text-[11px] font-black text-[#edac41]">
                {company.rating != null && (
                  <>
                    <Icon icon={Star} size={14} /> {company.rating} <i className="text-muted not-italic">·</i>
                  </>
                )}
                {company.tag && <span className="text-muted">{company.tag}</span>}
              </span>
            )}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-[20px] border border-border px-[11px] py-[5px] text-[10px] font-bold text-muted max-sm:text-[9px] max-xs:px-1.5 max-xs:py-1">
          <Icon icon={Bus} size={16} /> حافلة سياحية
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_180px] items-center gap-3.5 px-[23px] pt-3.5 pb-[23px] max-lg:grid-cols-[minmax(0,1fr)_159px] max-sm:grid-cols-1 max-sm:gap-[18px] max-sm:px-3.5 max-sm:py-[15px]">
        <div className="flex items-center justify-between gap-[17px] max-sm:gap-[7px] max-xs:gap-[3px]">
          <div className="flex min-w-[60px] flex-col">
            <b className="text-[23px] leading-normal font-black max-sm:text-xl max-xs:text-lg">{formatTime(trip.departureTime)}</b>
            <span className="text-[11px] font-extrabold text-muted">{trip.origin.name}</span>
          </div>
          <div className="flex min-w-[110px] flex-1 flex-col items-center max-sm:min-w-20">
            <span className="text-[10px] font-extrabold text-muted">{formatDuration(trip.durationMinutes)}</span>
            <div className="my-1 flex w-full items-center justify-center gap-[9px] text-primary" aria-hidden="true">
              <i className="h-px flex-1 border-t border-dashed border-[#b6ccd2]" />
              <Icon icon={Bus} size={18} />
              <i className="h-px flex-1 border-t border-dashed border-[#b6ccd2]" />
            </div>
            <small className="text-[10px] font-extrabold text-primary">مباشرة</small>
          </div>
          <div className="flex min-w-[60px] flex-col">
            <b className="text-[23px] leading-normal font-black max-sm:text-xl max-xs:text-lg">{formatTime(trip.arrivalTime)}</b>
            <span className="text-[11px] font-extrabold text-muted">{trip.destination.name}</span>
          </div>
        </div>

        <div className="flex flex-col border-s border-border ps-5 max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:items-center max-sm:gap-x-[9px] max-sm:gap-y-0 max-sm:border-s-0 max-sm:border-t max-sm:ps-0 max-sm:pt-[15px]">
          <small className="text-[10px] text-muted max-sm:col-start-1">السعر للشخص</small>
          <b className="text-[19px] font-black whitespace-nowrap text-dark-deep max-lg:text-base max-sm:col-start-1 max-sm:text-lg dark:text-text">
            {formatMoney(trip.price)}
          </b>
          <span className="mb-[11px] flex items-center gap-[5px] text-[10px] font-extrabold text-primary max-sm:col-start-1 max-sm:mb-0">
            <Icon icon={Armchair} size={15} /> {trip.availableSeats ?? '—'} مقعد متاح
          </span>
          <Button
            to={disabled ? undefined : `/booking/${trip.id}?people=${people}`}
            disabled={disabled}
            iconEnd={disabled ? undefined : ArrowLeft}
            iconSize={16}
            size="custom"
            className="min-h-[38px] rounded-xl px-2.5 py-[7px] text-[11px] max-sm:col-start-2 max-sm:row-[1/4]"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[7px] border-t border-border px-[23px] py-[11px] max-sm:px-3.5">
        <ServicePills features={company.features} />
        {trip.estimatedKm != null && (
          <span className="ms-auto inline-flex items-center gap-[5px] text-[10px] text-muted" title={trip.distanceKm == null ? 'مسافة تقريبية' : undefined}>
            <Icon icon={Route} size={15} /> ~{trip.estimatedKm} كم
          </span>
        )}
      </div>
    </article>
  )
}
