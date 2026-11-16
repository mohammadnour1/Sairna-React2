import { addMinutesToTime, minutesBetween, toDamascusDateTime } from '@/utils/date'
import { estimateRoadKm } from '@/utils/geo'
import { mapCity } from './city.mapper'
import { mapCompany } from './company.mapper'

/**
 * Raw trip (see docs/api/samples/trip-detail.json):
 *   { id, code, companyId, originId, destinationId, departureAt, arrivalAt, price,
 *     totalSeats, status, company{}, origin{}, destination{}, availableSeats }
 * → Trip model used by every component.
 */
export function mapTrip(raw) {
  if (!raw) return null
  const origin = mapCity(raw.origin ?? { id: raw.originId })
  const destination = mapCity(raw.destination ?? { id: raw.destinationId })
  const company = mapCompany(raw.company ?? { id: raw.companyId })
  const departure = toDamascusDateTime(raw.departureAt)
  const arrival = toDamascusDateTime(raw.arrivalAt)
  const durationMinutes = raw.durationMinutes ?? minutesBetween(raw.departureAt, raw.arrivalAt)
  const arrivalTime = arrival.time ?? addMinutesToTime(departure.time, durationMinutes)
  const distanceKm = raw.distanceKm != null ? Number(raw.distanceKm) : null
  const availableSeats = raw.availableSeats != null ? Number(raw.availableSeats) : null
  const status = raw.status ?? 'AVAILABLE'

  return {
    id: Number(raw.id),
    code: raw.code ?? null,
    origin,
    destination,
    company,
    date: departure.date,
    departureAt: raw.departureAt ?? null,
    arrivalAt: raw.arrivalAt ?? null,
    departureTime: departure.time,
    arrivalTime,
    durationMinutes,
    price: Number(raw.price),
    availableSeats,
    totalSeats: raw.totalSeats != null ? Number(raw.totalSeats) : null,
    // The API has no distance → `distanceKm` stays null and the UI shows `estimatedKm` with "~".
    distanceKm,
    estimatedKm: distanceKm ?? estimateRoadKm(origin, destination),
    status,
    isBookable: status === 'AVAILABLE' && availableSeats !== 0,
  }
}

export function mapTrips(list) {
  return Array.isArray(list) ? list.map(mapTrip).filter(Boolean) : []
}
