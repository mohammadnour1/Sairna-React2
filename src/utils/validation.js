import { isPastDate, isValidISODate } from './date'

export const MAX_PEOPLE = 4
export const PHONE_PATTERN = /^[+\d\s-]{9,18}$/ // same rule the backend enforces
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_MIN = 8 // backend minimum (bug B23)

/**
 * One shared search validator for the form, destination shortcuts and URL params (bug B2).
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 */
export function validateSearch({ originId, destinationId, date, people }, cityIds = null) {
  const errors = {}
  const known = (id) => !cityIds || cityIds.includes(id)
  if (!originId || !known(originId)) errors.originId = 'اختار محافظة الانطلاق.'
  if (!destinationId || !known(destinationId)) errors.destinationId = 'اختار محافظة الوصول.'
  if (!errors.originId && !errors.destinationId && originId === destinationId) {
    errors.destinationId = 'اختار محافظتين مختلفتين حتى نعرض الرحلات.'
  }
  if (!isValidISODate(date)) errors.date = 'اختار تاريخ الرحلة.'
  else if (isPastDate(date)) errors.date = 'تاريخ الرحلة لازم يكون اليوم أو بعده.'
  const n = Number(people)
  if (!Number.isInteger(n) || n < 1 || n > MAX_PEOPLE) errors.people = `عدد المسافرين من 1 لـ ${MAX_PEOPLE}.`
  return { valid: Object.keys(errors).length === 0, errors }
}

/** Passenger card fields (step 2 of booking). */
export function validatePassenger({ name, phone }) {
  const errors = {}
  if (!name || name.trim().length < 3) errors.name = 'أدخل اسم المسافر (3 أحرف على الأقل).'
  if (!PHONE_PATTERN.test((phone || '').trim())) errors.phone = 'أدخل رقم هاتف صحيح.'
  return errors
}

/** Login / register forms. */
export function validateAuth({ name, email, password, terms }, mode) {
  const errors = {}
  if (mode === 'register' && (!name || name.trim().length < 3)) errors.name = 'أدخل اسمك الكامل (3 أحرف على الأقل).'
  if (!EMAIL_PATTERN.test((email || '').trim())) errors.email = 'أدخل بريد إلكتروني صحيح.'
  if (!password || password.length < PASSWORD_MIN) errors.password = `كلمة المرور لازم تكون ${PASSWORD_MIN} أحرف على الأقل.`
  if (mode === 'register' && !terms) errors.terms = 'لازم توافق على الشروط لتكمل.'
  return errors
}
