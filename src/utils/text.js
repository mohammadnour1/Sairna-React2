/**
 * Normalizes Arabic text so city names match regardless of hamza/taa-marbuta/diacritics.
 * 'إدلب' → 'ادلب', 'حماة' → 'حماه'
 */
export function normalizeArabic(value) {
  return String(value ?? '')
    .trim()
    .replace(/ـ/g, '') // tatweel
    .replace(/[ً-ْٰ]/g, '') // diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
}

/** First word of a name: 'أحمد خالد' → 'أحمد' */
export function firstName(name) {
  return String(name ?? '').trim().split(/\s+/)[0] || ''
}

/**
 * Letter used in company/user avatars. A leading 'ال' is skipped, so 'الشام' → 'ش'.
 */
export function initial(name, { skipDefiniteArticle = false } = {}) {
  let text = String(name ?? '').trim()
  if (skipDefiniteArticle && text.startsWith('ال') && text.length > 2) text = text.slice(2)
  return text.charAt(0) || 'م'
}
