// Admin form validation, aligned with the Swagger DTOs (CompanyDto / CreateTripDto / UpdateTripDto).
import { damascusInputToISO } from './datetime'

const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/** { name*, logoUrl? } */
export function validateCompany({ name, logoUrl }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'يجب أن يتكوّن اسم الشركة من حرفين على الأقل.'
  if (logoUrl.trim() && !isHttpUrl(logoUrl.trim())) errors.logoUrl = 'أدخل رابطاً صالحاً يبدأ بـ https://'
  return errors
}

export const MAX_TRIP_SEATS = 60 // backend: totalSeats must not be greater than 60

/**
 * Trip form values (strings from inputs) → errors.
 * `isNew`: a new trip must depart in the future; an edited one may keep its past time.
 */
export function validateTrip(v, { isNew }) {
  const errors = {}
  if (!v.companyId) errors.companyId = 'اختر شركة النقل.'
  if (!v.originId) errors.originId = 'اختر مدينة الانطلاق.'
  if (!v.destinationId) errors.destinationId = 'اختر مدينة الوصول.'
  if (v.originId && v.originId === v.destinationId) errors.destinationId = 'يجب أن تختلف مدينة الوصول عن مدينة الانطلاق.'

  const dep = damascusInputToISO(v.departureAt)
  const arr = damascusInputToISO(v.arrivalAt)
  if (!dep) errors.departureAt = 'حدّد موعد الانطلاق.'
  else if (isNew && new Date(dep).getTime() <= Date.now()) errors.departureAt = 'يجب أن يكون موعد الانطلاق في المستقبل.'
  if (!arr) errors.arrivalAt = 'حدّد موعد الوصول.'
  else if (dep && new Date(arr) <= new Date(dep)) errors.arrivalAt = 'يجب أن يكون موعد الوصول بعد موعد الانطلاق.'

  // Backend: price must be an integer ≥ 0 (we also refuse 0: a free trip is almost certainly a typo).
  const price = Number(v.price)
  if (v.price === '' || !Number.isInteger(price) || price <= 0) errors.price = 'أدخل السعر بالليرة رقماً صحيحاً أكبر من صفر.'
  const seats = Number(v.totalSeats)
  if (!Number.isInteger(seats) || seats < 1 || seats > MAX_TRIP_SEATS) errors.totalSeats = `يجب أن يكون عدد المقاعد بين 1 و${MAX_TRIP_SEATS}.`
  return errors
}

/** Only the keys whose value differs from the original (PATCH sends changes only). */
export function diff(next, original) {
  return Object.fromEntries(Object.entries(next).filter(([key, value]) => value !== original[key]))
}
