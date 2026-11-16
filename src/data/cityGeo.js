import { normalizeArabic } from '@/utils/text'

// Static fallback for the 14 governorates (from the reference).
// The API already returns coordinates; this table supplies the English slug
// (used for photos) and fills coordinates if the API ever omits them.
export const CITY_GEO = [
  { slug: 'damascus', name: 'دمشق', lat: 33.5138, lng: 36.2765 },
  { slug: 'aleppo', name: 'حلب', lat: 36.2021, lng: 37.1343 },
  { slug: 'homs', name: 'حمص', lat: 34.7324, lng: 36.7137 },
  { slug: 'hama', name: 'حماة', lat: 35.1318, lng: 36.7578 },
  { slug: 'latakia', name: 'اللاذقية', lat: 35.5317, lng: 35.7901 },
  { slug: 'tartus', name: 'طرطوس', lat: 34.8959, lng: 35.8866 },
  { slug: 'idlib', name: 'إدلب', lat: 35.9306, lng: 36.6339 },
  { slug: 'deir', name: 'دير الزور', lat: 35.3359, lng: 40.1408 },
  { slug: 'raqqa', name: 'الرقة', lat: 35.95, lng: 39.0167 },
  { slug: 'hasakah', name: 'الحسكة', lat: 36.5024, lng: 40.7477 },
  { slug: 'daraa', name: 'درعا', lat: 32.6189, lng: 36.1021 },
  { slug: 'sweida', name: 'السويداء', lat: 32.7081, lng: 36.5695 },
  { slug: 'quneitra', name: 'القنيطرة', lat: 33.1265, lng: 35.8246 },
  { slug: 'rif-damascus', name: 'ريف دمشق', lat: 33.63, lng: 36.46 },
]

const byName = new Map(CITY_GEO.map((c) => [normalizeArabic(c.name), c]))
const bySlug = new Map(CITY_GEO.map((c) => [c.slug, c]))

/** Finds static geo info by Arabic name (normalized) or English slug. */
export function findCityGeo({ name, slug } = {}) {
  return (slug && bySlug.get(String(slug).toLowerCase())) || byName.get(normalizeArabic(name)) || null
}
