import { findCityGeo } from '@/data/cityGeo'

const num = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v))

/**
 * Raw: { id, name, latitude, longitude }
 * → City { id, name, slug, lat, lng }  (API coordinates win over the static table)
 */
export function mapCity(raw) {
  if (!raw) return null
  const geo = findCityGeo({ name: raw.name, slug: raw.slug })
  return {
    id: Number(raw.id),
    name: raw.name ?? geo?.name ?? '',
    slug: raw.slug ?? geo?.slug ?? null,
    lat: num(raw.latitude ?? raw.lat) ?? geo?.lat ?? null,
    lng: num(raw.longitude ?? raw.lng) ?? geo?.lng ?? null,
  }
}

export function mapCities(list) {
  return Array.isArray(list) ? list.map(mapCity).filter(Boolean) : []
}
