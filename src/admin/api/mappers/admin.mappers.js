// Dashboard API → internal models. The Dashboard responses are not documented in Swagger,
// so every mapper accepts a plain array OR a wrapped list, and tolerates missing fields.
// The pure website mappers are reused (same backend models), then extended with admin fields.
import { mapBooking } from '@/api/mappers/booking.mapper'
import { mapCity } from '@/api/mappers/city.mapper'
import { mapCompany } from '@/api/mappers/company.mapper'
import { mapTrip } from '@/api/mappers/trip.mapper'

const num = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v))

/** `[...]`, `{ data: [...] }`, `{ items: [...] }` or `{ results: [...] }` → array. */
export function toList(raw) {
  if (Array.isArray(raw)) return raw
  for (const key of ['data', 'items', 'results', 'rows']) {
    if (Array.isArray(raw?.[key])) return raw[key]
  }
  return []
}

/** Some APIs wrap single objects as `{ data: {...} }`. */
export function unwrap(raw) {
  return raw && typeof raw === 'object' && !Array.isArray(raw) && raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)
    ? raw.data
    : raw
}

export function mapAdminUser(raw) {
  if (!raw) return null
  const bookings = Array.isArray(raw.bookings) ? raw.bookings.map(mapAdminBooking).filter(Boolean) : null
  return {
    id: Number(raw.id),
    name: raw.name ?? '',
    email: raw.email ?? '',
    // null when the API does not send it (never assume a role).
    role: raw.role ? String(raw.role).toUpperCase() : null,
    createdAt: raw.createdAt ?? null,
    bookingsCount: num(raw._count?.bookings ?? raw.bookingsCount) ?? (bookings ? bookings.length : null),
    bookings,
  }
}

export function mapAdminCompany(raw) {
  const company = mapCompany(raw)
  if (!company) return null
  return {
    ...company,
    createdAt: raw.createdAt ?? null,
    tripsCount: num(raw._count?.trips ?? raw.tripsCount),
  }
}

export function mapAdminCity(raw) {
  const city = mapCity(raw)
  if (!city) return null
  return {
    ...city,
    latitude: num(raw.latitude ?? raw.lat),
    longitude: num(raw.longitude ?? raw.lng),
    tripsCount: num(raw._count?.trips ?? raw.tripsCount),
  }
}

export function mapAdminTrip(raw) {
  const trip = mapTrip(raw)
  if (!trip) return null
  const booked = num(raw._count?.bookingSeats ?? raw.bookedSeats)
  const bookedSeats = booked ?? (trip.totalSeats != null && trip.availableSeats != null ? trip.totalSeats - trip.availableSeats : null)
  return {
    ...trip,
    status: String(trip.status).toUpperCase(),
    companyId: num(raw.companyId) ?? trip.company?.id ?? null,
    originId: num(raw.originId) ?? trip.origin?.id ?? null,
    destinationId: num(raw.destinationId) ?? trip.destination?.id ?? null,
    bookedSeats,
    availableSeats: trip.availableSeats ?? (trip.totalSeats != null && booked != null ? trip.totalSeats - booked : null),
    createdAt: raw.createdAt ?? null,
    bookings: Array.isArray(raw.bookings) ? raw.bookings.map(mapAdminBooking).filter(Boolean) : null,
  }
}

export function mapAdminBooking(raw) {
  const booking = mapBooking(raw)
  if (!booking) return null
  return {
    ...booking,
    trip: raw.trip ? mapAdminTrip(raw.trip) : null,
    userId: num(raw.userId) ?? num(raw.user?.id),
    user: raw.user ? mapAdminUser({ ...raw.user, bookings: undefined }) : null,
    seatsCount: booking.seats.length || num(raw._count?.seats) || 0,
  }
}

export const mapList = (mapper) => (raw) => toList(raw).map(mapper).filter(Boolean)
