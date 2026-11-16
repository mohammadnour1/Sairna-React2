import { useState } from 'react'
import { Armchair, Building2, CalendarClock, Flag, MapPin, Save, Wallet } from 'lucide-react'
import Button from '@/components/ui/Button'
import InfoNote from '@/components/ui/InfoNote'
import TextField from '@/components/ui/TextField'
import { formatDuration } from '@/utils/format'
import { getAdminFieldErrors } from '../../api/adminErrors'
import { useAdminCities, useAdminCompanies } from '../../hooks/queries/useAdminQueries'
import { useSaveTrip } from '../../hooks/mutations/useAdminMutations'
import { damascusInputToISO, isoToDamascusInput, nowDamascusInput } from '../../utils/datetime'
import { diff, MAX_TRIP_SEATS, validateTrip } from '../../utils/validation'
import Drawer from '../ui/Drawer'
import SelectField from '../ui/SelectField'

const FORM_ID = 'trip-form'
const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'متاحة للحجز' },
  { value: 'CANCELLED', label: 'ملغاة' },
]

const toForm = (trip) => ({
  companyId: trip?.companyId ? String(trip.companyId) : '',
  originId: trip?.originId ? String(trip.originId) : '',
  destinationId: trip?.destinationId ? String(trip.destinationId) : '',
  departureAt: trip ? isoToDamascusInput(trip.departureAt) : '',
  arrivalAt: trip ? isoToDamascusInput(trip.arrivalAt) : '',
  price: trip?.price != null ? String(trip.price) : '',
  totalSeats: trip?.totalSeats != null ? String(trip.totalSeats) : '40',
  status: trip?.status ?? 'AVAILABLE',
})

/** Form strings → DTO types (CreateTripDto / UpdateTripDto). Times become UTC ISO. */
const toBody = (v) => ({
  companyId: Number(v.companyId),
  originId: Number(v.originId),
  destinationId: Number(v.destinationId),
  departureAt: damascusInputToISO(v.departureAt),
  arrivalAt: damascusInputToISO(v.arrivalAt),
  price: Number(v.price),
  totalSeats: Number(v.totalSeats),
})

/**
 * Create (trip = null) or edit a trip. Times are typed in Damascus time and sent as UTC.
 * On edit only the changed fields are sent, and `status` can be switched to CANCELLED.
 * @param {{ trip: object|null, defaultCompanyId?: number|null, onClose: () => void }} props
 */
export default function TripFormDrawer({ trip, defaultCompanyId = null, onClose }) {
  const isEdit = Boolean(trip)
  const [values, setValues] = useState(() => ({ ...toForm(trip), ...(!trip && defaultCompanyId && { companyId: String(defaultCompanyId) }) }))
  const [errors, setErrors] = useState({})
  const companies = useAdminCompanies().data ?? []
  const cities = useAdminCities().data ?? []
  const save = useSaveTrip()

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((all) => ({ ...all, [field]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validateTrip(values, { isNew: !isEdit })
    if (isEdit && trip.bookedSeats && Number(values.totalSeats) < trip.bookedSeats) {
      found.totalSeats = `عدد المقاعد المحجوزة ${trip.bookedSeats}، فلا يمكن أن يقلّ العدد عن ذلك.`
    }
    setErrors(found)
    if (Object.keys(found).length) return
    let body = toBody(values)
    if (isEdit) {
      body = diff({ ...body, status: values.status }, { ...toBody(toForm(trip)), status: trip.status })
      if (!Object.keys(body).length) return onClose()
    }
    save.mutate({ id: trip?.id, body }, { onSuccess: onClose, onError: (error) => setErrors(getAdminFieldErrors(error)) })
  }

  const dep = damascusInputToISO(values.departureAt)
  const arr = damascusInputToISO(values.arrivalAt)
  const minutes = dep && arr ? (new Date(arr) - new Date(dep)) / 60000 : null
  const cityOptions = cities.map((c) => ({ value: String(c.id), label: c.name }))

  return (
    <Drawer
      open
      onClose={onClose}
      busy={save.isPending}
      title={isEdit ? 'تعديل الرحلة' : 'إضافة رحلة'}
      description={isEdit ? `رقم الرحلة #${trip.id}${trip.code ? ` · ${trip.code}` : ''}` : 'كل الحقول مطلوبة. الأوقات بتوقيت دمشق.'}
      footer={
        <>
          <Button type="submit" form={FORM_ID} loading={save.isPending} iconStart={Save}>
            {isEdit ? 'حفظ التعديلات' : 'إضافة الرحلة'}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={save.isPending}>
            إلغاء
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <SelectField
          className="col-span-full"
          label="شركة النقل"
          icon={Building2}
          value={values.companyId}
          onChange={set('companyId')}
          error={errors.companyId}
          required
          placeholder="اختر الشركة"
          // The server refuses trips for inactive companies (INVALID_COMPANY), so they can't be picked.
          options={companies.map((c) => ({
            value: String(c.id),
            label: c.isActive ? c.fullName : `${c.fullName} (موقوفة)`,
            disabled: !c.isActive && String(c.id) !== String(trip?.companyId ?? ''),
          }))}
        />
        <SelectField label="من" icon={MapPin} value={values.originId} onChange={set('originId')} error={errors.originId} required placeholder="مدينة الانطلاق" options={cityOptions} />
        <SelectField label="إلى" icon={Flag} value={values.destinationId} onChange={set('destinationId')} error={errors.destinationId} required placeholder="مدينة الوصول" options={cityOptions} />
        <TextField
          label="الانطلاق (بتوقيت دمشق)"
          icon={CalendarClock}
          type="datetime-local"
          dir="ltr"
          min={isEdit ? undefined : nowDamascusInput()}
          value={values.departureAt}
          onChange={set('departureAt')}
          error={errors.departureAt}
          required
        />
        <TextField
          label="الوصول (بتوقيت دمشق)"
          icon={CalendarClock}
          type="datetime-local"
          dir="ltr"
          min={values.departureAt || undefined}
          value={values.arrivalAt}
          onChange={set('arrivalAt')}
          error={errors.arrivalAt}
          required
        />
        {minutes > 0 && <p className="col-span-full -mt-2 mb-0 text-[11px] font-bold text-primary-deep dark:text-primary">مدة الرحلة: {formatDuration(minutes)}</p>}
        <TextField label="السعر للمقعد (ل.س)" icon={Wallet} type="number" inputMode="numeric" min="1" dir="ltr" value={values.price} onChange={set('price')} error={errors.price} required />
        <TextField
          label="عدد المقاعد"
          icon={Armchair}
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX_TRIP_SEATS}
          dir="ltr"
          value={values.totalSeats}
          onChange={set('totalSeats')}
          error={errors.totalSeats}
          required
        />
        {isEdit && (
          <SelectField className="col-span-full" label="حالة الرحلة" value={values.status} onChange={set('status')} error={errors.status} options={STATUS_OPTIONS} />
        )}
        {isEdit && values.status === 'CANCELLED' && trip.status !== 'CANCELLED' && (
          <InfoNote variant="auth" className="col-span-full">
            لا تُعرض الرحلة الملغاة للحجز. ولا يوضّح التوثيق ما إذا كانت حجوزاتها الحالية تُلغى تلقائياً، لذا راجعها من صفحة الرحلة بعد الحفظ.
          </InfoNote>
        )}
      </form>
    </Drawer>
  )
}
