// Turns axios/NestJS errors into Arabic messages (formats documented in docs/api/API_NOTES.md).

export const NETWORK_ERROR_MESSAGE = 'تعذّر الاتصال بالخادم. تأكد من الإنترنت وحاول مرة ثانية.'

// Machine codes the backend returns in `message`.
const CODE_MESSAGES = {
  INVALID_CREDENTIALS: 'الإيميل أو كلمة المرور غلط.',
  EMAIL_TAKEN: 'هالإيميل مسجّل من قبل. جرّب تسجّل دخول.',
  SEAT_ALREADY_RESERVED: 'في مقعد انحجز قبل شوي، اختار مقعد بديل.',
  TRIP_NOT_FOUND: 'الرحلة غير موجودة أو ما عادت متاحة.',
  BOOKING_NOT_FOUND: 'الحجز غير موجود.',
  COMPANY_NOT_FOUND: 'الشركة غير موجودة.',
  Unauthorized: 'انتهت الجلسة، سجّل دخولك من جديد.',
}

// class-validator messages start with the field path: "seats.0.passengerPhone must match …"
const FIELD_MESSAGES = {
  name: 'الاسم قصير، اكتب 3 أحرف على الأقل.',
  email: 'أدخل بريد إلكتروني صحيح.',
  password: 'كلمة المرور لازم تكون 8 أحرف على الأقل.',
  passengerName: 'أدخل اسم المسافر (3 أحرف على الأقل).',
  passengerPhone: 'أدخل رقم هاتف صحيح.',
  seatNumber: 'رقم المقعد غير صالح.',
}

function rawMessages(error) {
  const message = error?.response?.data?.message
  if (Array.isArray(message)) return message.map(String)
  if (typeof message === 'string') return [message]
  return []
}

export function isNetworkError(error) {
  return Boolean(error?.isAxiosError && !error.response)
}

export function getStatus(error) {
  return error?.response?.status ?? null
}

/** Field path → Arabic message. 'seats.0.passengerPhone' becomes 'seats[0].passengerPhone'. */
export function getFieldErrors(error) {
  const fields = {}
  for (const msg of rawMessages(error)) {
    const path = msg.split(' ')[0]
    if (!/^[\w.]+$/.test(path) || CODE_MESSAGES[path]) continue
    const key = path.replace(/\.(\d+)\./g, '[$1].')
    const leaf = path.split('.').pop()
    fields[key] = FIELD_MESSAGES[leaf] ?? msg
  }
  return fields
}

/** One human message for a toast or an inline alert. */
export function getErrorMessage(error, fallback = 'صار خطأ غير متوقع. حاول مرة ثانية.') {
  if (isNetworkError(error) || error?.code === 'ECONNABORTED') return NETWORK_ERROR_MESSAGE
  const messages = rawMessages(error)
  const translated = messages.map((m) => CODE_MESSAGES[m]).filter(Boolean)
  if (translated.length) return translated.join('، ')
  const fieldMessages = Object.values(getFieldErrors(error))
  if (fieldMessages.length) return [...new Set(fieldMessages)].join('، ')
  return fallback
}

/** A booking failed because one of the chosen seats was just taken. */
export function isSeatConflict(error) {
  return getStatus(error) === 409 && rawMessages(error).includes('SEAT_ALREADY_RESERVED')
}

export function isNotFound(error) {
  return getStatus(error) === 404
}
