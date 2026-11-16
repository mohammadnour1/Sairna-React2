import { paletteFor } from '@/data/companyPalette'
import { initial } from '@/utils/text'

const DEMO_SUFFIX = /\s*\(تجريبي\)\s*$/

/**
 * Raw: { id, name, logoUrl, isActive }  — no rating/features/about in the API.
 * → Company { id, name, fullName, isDemo, initial, color, bg, rating, tag, features, about, logoUrl, isActive }
 *
 * The backend marks demo companies with the suffix " (تجريبي)". We show the clean name
 * and turn the suffix into a small "تجريبي" tag, so nothing is hidden or invented.
 */
export function mapCompany(raw) {
  if (!raw) return null
  const id = Number(raw.id)
  const fullName = String(raw.name ?? '')
  const isDemo = DEMO_SUFFIX.test(fullName)
  const name = fullName.replace(DEMO_SUFFIX, '')
  const palette = paletteFor(id - 1)
  return {
    id,
    name,
    fullName,
    isDemo,
    initial: initial(name, { skipDefiniteArticle: true }),
    color: raw.color ?? palette.color,
    bg: raw.bg ?? palette.bg,
    rating: raw.rating != null ? Number(raw.rating) : null,
    tag: raw.tag ?? (isDemo ? 'شركة تجريبية' : null),
    features: Array.isArray(raw.features) ? raw.features : [],
    about: raw.about ?? raw.description ?? null,
    logoUrl: raw.logoUrl ?? null,
    isActive: raw.isActive !== false,
  }
}

export function mapCompanies(list) {
  return Array.isArray(list) ? list.map(mapCompany).filter((c) => c && c.isActive) : []
}
