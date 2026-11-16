import { useState } from 'react'
import { ArrowLeftRight, Calendar, MapPin, Search, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { todayLocalISO } from '@/utils/date'
import { formatPeople } from '@/utils/format'
import { MAX_PEOPLE } from '@/utils/validation'
import { cn } from '@/utils/cn'
import CitySelect from './CitySelect'
import SearchField from './SearchField'

const inputClass =
  'mt-[11px] h-[30px] w-full min-w-0 cursor-default appearance-none border-0 bg-transparent p-0 text-[11px] font-black text-text outline-none focus-visible:outline-none max-sm:mt-2.5'

/**
 * Trip search form (reference `.search-form`). Holds its own input state until submit;
 * validation + navigation are done by the `onSubmit` callback (useTripSearch).
 *
 * @param {{ variant?: 'home'|'compact', cities: object[], initialValues: { originId:number,
 *           destinationId:number, date:string, people:number }, onSubmit: (values) => void }} props
 */
export default function SearchForm({ variant = 'home', cities, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const compact = variant === 'compact'
  const set = (key) => (value) => setValues((v) => ({ ...v, [key]: value }))

  const swap = () => setValues((v) => ({ ...v, originId: v.destinationId, destinationId: v.originId }))

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(values)
      }}
      className={cn(
        'grid items-end',
        'grid-cols-[1.12fr_34px_1.12fr_1fr_.74fr_1.14fr] max-lg:grid-cols-[1fr_27px_1fr_1fr_.7fr_1.1fr] max-md:grid-cols-[1fr_30px_1fr_1fr_1fr]',
        'max-sm:grid-cols-[1fr_29px_1fr] max-xs:grid-cols-[1fr_21px_1fr]',
        compact ? 'gap-[9px]' : 'gap-[11px] max-lg:gap-[7px] max-md:gap-2 max-sm:gap-[9px] max-xs:gap-1.5',
      )}
    >
      <SearchField label="من وين؟" icon={MapPin} compact={compact} className="max-sm:col-start-1">
        <CitySelect name="origin" label="محافظة الانطلاق" cities={cities} value={values.originId} onChange={set('originId')} />
      </SearchField>

      <button
        type="button"
        onClick={swap}
        aria-label="تبديل المحافظات"
        className="mb-[11px] grid h-[38px] w-[34px] place-items-center rounded-[10px] border-0 bg-soft-teal text-primary-deep transition-transform duration-250 hover:rotate-180 max-lg:w-[27px] max-md:mb-2 max-sm:col-start-2 max-xs:w-[21px]"
      >
        <Icon icon={ArrowLeftRight} size={19} />
      </button>

      <SearchField label="لوين؟" icon={MapPin} compact={compact} className="max-sm:col-start-3">
        <CitySelect name="destination" label="محافظة الوصول" cities={cities} value={values.destinationId} onChange={set('destinationId')} />
      </SearchField>

      <SearchField label="تاريخ الرحلة" icon={Calendar} compact={compact} className="max-sm:col-[1/3]">
        <input
          name="date"
          type="date"
          required
          min={todayLocalISO()}
          value={values.date}
          onChange={(event) => set('date')(event.target.value)}
          className={inputClass}
        />
      </SearchField>

      <SearchField label="المسافرين" icon={Users} compact={compact} className="max-sm:col-start-3">
        <select
          name="people"
          aria-label="عدد المسافرين"
          value={values.people}
          onChange={(event) => set('people')(Number(event.target.value))}
          className={cn(inputClass, 'cursor-pointer max-xs:text-[10px]')}
        >
          {Array.from({ length: MAX_PEOPLE }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {formatPeople(n)}
            </option>
          ))}
        </select>
      </SearchField>

      <Button
        type="submit"
        iconStart={Search}
        iconSize={19}
        size="custom"
        className={cn(
          'w-full rounded-xl px-[13px] py-2.5 text-xs max-lg:text-[10px] max-md:col-span-full max-md:text-xs',
          compact ? 'h-[57px] max-sm:h-[45px]' : 'h-[60px] max-md:h-[49px]',
        )}
      >
        ابحث عن رحلات
      </Button>
    </form>
  )
}
