import { getStatus, isNetworkError } from '@/api/errors'

const NETWORK_ERROR_MESSAGE = 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.'

// Machine codes the backend returns in `message` (same NestJS app as the Website API).
const CODE_MESSAGES = {
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  Unauthorized: 'انتهت الجلسة، يُرجى تسجيل الدخول من جديد.',
  Forbidden: 'لا يملك هذا الحساب صلاحية الدخول إلى لوحة الإدارة.',
  TRIP_NOT_FOUND: 'الرحلة غير موجودة.',
  BOOKING_NOT_FOUND: 'الحجز غير موجود.',
  COMPANY_NOT_FOUND: 'الشركة غير موجودة.',
  USER_NOT_FOUND: 'المستخدم غير موجود.',
  CITY_NOT_FOUND: 'المدينة غير موجودة.',
  // Found while testing the Dashboard API (docs/api/ADMIN_API_NOTES.md):
  INVALID_COMPANY: 'الشركة موقوفة أو غير موجودة. اختر شركة فعّالة.',
  INVALID_TIMES: 'يجب أن يكون موعد الوصول بعد موعد الانطلاق.',
  SAME_CITY: 'يجب أن تختلف مدينة الوصول عن مدينة الانطلاق.',
}

// Machine codes that belong to one form field.
const CODE_FIELDS = { INVALID_COMPANY: 'companyId', INVALID_TIMES: 'arrivalAt', SAME_CITY: 'destinationId' }

const STATUS_MESSAGES = {
  403: 'لا تملك صلاحية تنفيذ هذه العملية.',
  404: 'العنصر المطلوب غير موجود أو حُذف.',
  409: 'تعذّر تنفيذ العملية لوجود بيانات مرتبطة بها.',
}

// class-validator messages start with the field path: "price must be a positive number".
const FIELD_MESSAGES = {
  email: 'أدخل بريد إلكتروني صحيح.',
  password: 'أدخل كلمة المرور.',
  name: 'أدخل اسماً صالحاً.',
  logoUrl: 'أدخل رابط صورة صالحاً يبدأ بـ https://',
  isActive: 'قيمة الحالة غير صالحة.',
  companyId: 'اختر شركة النقل.',
  originId: 'اختر مدينة الانطلاق.',
  destinationId: 'اختر مدينة الوصول.',
  departureAt: 'موعد الانطلاق غير صالح.',
  arrivalAt: 'موعد الوصول غير صالح.',
  price: 'أدخل سعراً صالحاً.',
  totalSeats: 'أدخل عدد مقاعد صالحاً.',
  status: 'حالة الرحلة غير صالحة.',
}

function rawMessages(error) {
  const message = error?.response?.data?.message
  if (Array.isArray(message)) return message.map(String)
  if (typeof message === 'string') return [message]
  return []
}

/** Field → Arabic message, for showing server validation errors under form inputs. */
export function getAdminFieldErrors(error) {
  const fields = {}
  for (const msg of rawMessages(error)) {
    if (CODE_FIELDS[msg]) {
      fields[CODE_FIELDS[msg]] = CODE_MESSAGES[msg]
      continue
    }
    const field = msg.split(' ')[0]
    if (FIELD_MESSAGES[field]) fields[field] = FIELD_MESSAGES[field]
  }
  return fields
}

/** One Arabic sentence for a toast. Unknown machine codes are shown as-is after the fallback. */
export function getAdminErrorMessage(error, fallback = 'حدث خطأ غير متوقع. حاول مرة أخرى.') {
  if (isNetworkError(error) || error?.code === 'ECONNABORTED') return NETWORK_ERROR_MESSAGE
  const messages = rawMessages(error)
  const translated = messages.map((m) => CODE_MESSAGES[m]).filter(Boolean)
  if (translated.length) return translated.join('، ')
  const fields = Object.values(getAdminFieldErrors(error))
  if (fields.length) return [...new Set(fields)].join('، ')
  const status = getStatus(error)
  // An unknown UPPER_CASE code is still useful to an admin (e.g. COMPANY_HAS_TRIPS).
  const code = messages.find((m) => /^[A-Z][A-Z0-9_]+$/.test(m))
  const base = STATUS_MESSAGES[status] ?? fallback
  return code ? `${base} (${code})` : base
}

export { getStatus }
