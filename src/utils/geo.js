// The single place for distance math (bug B8 had two copies of the formula).

const toRad = (deg) => (deg * Math.PI) / 180

const hasCoords = (p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lng)

/** Great-circle distance in km. */
export function haversineKm(a, b) {
  if (!hasCoords(a) || !hasCoords(b)) return null
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Approximate road distance (reference formula): straight line in a flat projection × 1.2, min 75 km.
 * It is an estimate — the UI always labels it with "~".
 */
export function estimateRoadKm(a, b) {
  if (!hasCoords(a) || !hasCoords(b)) return null
  const latKm = (a.lat - b.lat) * 110
  const lngKm = (a.lng - b.lng) * 88
  return Math.max(75, Math.round(Math.hypot(latKm, lngKm) * 1.2))
}

/** Reference travel-time estimate: 63 km/h average + 15 minutes of stops. */
export function estimateDurationMinutes(roadKm) {
  if (!roadKm) return null
  return Math.round((roadKm / 63) * 60) + 15
}

/** Point at fraction `t` (0–1) on the straight line between two cities. */
export function interpolate(a, b, t) {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t }
}

export function midpoint(a, b) {
  return interpolate(a, b, 0.5)
}

export function googleDirectionsUrl(origin, destination) {
  const params = new URLSearchParams({
    api: '1',
    origin: `${origin.name}, Syria`,
    destination: `${destination.name}, Syria`,
    travelmode: 'driving',
  })
  return `https://www.google.com/maps/dir/?${params}`
}

export function googleEmbedUrl(center) {
  const q = encodeURIComponent(`${center.lat.toFixed(5)},${center.lng.toFixed(5)}`)
  return `https://maps.google.com/maps?q=${q}&z=7&output=embed`
}
