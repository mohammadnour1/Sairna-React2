// GET /overview has no documented schema. Instead of guessing a shape, this mapper walks the
// response and returns EVERY numeric value it contains (max 2 levels deep). Known keys get an
// Arabic label; unknown ones keep their raw key, so nothing the API returns is hidden and nothing
// that it doesn't return is invented.
import { mapAdminBooking, mapAdminTrip, unwrap } from './admin.mappers'

const norm = (key) =>
  String(key)
    .toLowerCase()
    .replace(/[_\s-]/g, '')
    .replace(/^(total|count|num|number)(of)?/, '')
    .replace(/(count|total)$/, '')

// normalized key → [label, kind]. `kind` picks the icon and the format.
const KNOWN = {
  users: ['المستخدمون', 'users'],
  passengers: ['المسافرون', 'users'],
  customers: ['المسافرون المسجّلون', 'users'],
  admins: ['المشرفون', 'users'],
  companies: ['شركات النقل', 'companies'],
  activecompanies: ['شركات فعّالة', 'companies'],
  inactivecompanies: ['شركات موقوفة', 'companies'],
  trips: ['الرحلات', 'trips'],
  availabletrips: ['رحلات متاحة', 'trips'],
  activetrips: ['رحلات فعّالة', 'trips'],
  upcomingtrips: ['رحلات قادمة', 'trips'],
  cancelledtrips: ['رحلات ملغاة', 'trips'],
  bookings: ['الحجوزات', 'bookings'],
  confirmedbookings: ['حجوزات مؤكدة', 'bookings'],
  cancelledbookings: ['حجوزات ملغاة', 'bookings'],
  todaybookings: ['حجوزات اليوم', 'bookings'],
  bookingstoday: ['حجوزات اليوم', 'bookings'],
  cities: ['المدن', 'cities'],
  seats: ['المقاعد', 'seats'],
  bookedseats: ['مقاعد محجوزة', 'seats'],
  seatsbooked: ['مقاعد محجوزة', 'seats'],
  bookingseats: ['مقاعد محجوزة', 'seats'],
  revenue: ['الإيرادات', 'money'],
  income: ['الإيرادات', 'money'],
  sales: ['المبيعات', 'money'],
  confirmedrevenue: ['إيرادات مؤكدة', 'money'],
}

// Labels for child keys inside a group, e.g. { bookings: { confirmed: 12 } }.
const CHILD = {
  '': 'الإجمالي',
  all: 'الإجمالي',
  confirmed: 'مؤكدة',
  cancelled: 'ملغاة',
  canceled: 'ملغاة',
  active: 'فعّالة',
  inactive: 'موقوفة',
  available: 'متاحة',
  upcoming: 'قادمة',
  completed: 'مكتملة',
  today: 'اليوم',
  thismonth: 'هذا الشهر',
  thisweek: 'هذا الأسبوع',
}

const MONEY_HINT = /(revenue|income|sales|amount|price|earning)/i

function describe(path) {
  const [parent, child] = path
  if (child === undefined) {
    const known = KNOWN[norm(parent)]
    if (known) return { label: known[0], kind: known[1], known: true }
  } else {
    const group = KNOWN[norm(parent)]
    const childLabel = CHILD[norm(child)]
    const direct = KNOWN[norm(child)]
    if (direct && !group) return { label: direct[0], kind: direct[1], known: true }
    if (group && childLabel) return { label: childLabel === 'الإجمالي' ? group[0] : `${group[0]} · ${childLabel}`, kind: group[1], known: true }
    if (direct) return { label: direct[0], kind: direct[1], known: true }
  }
  const kind = MONEY_HINT.test(path.join('.')) ? 'money' : 'other'
  return { label: path.join('.'), kind, known: false }
}

const isRecordList = (v) => Array.isArray(v) && v.length > 0 && v.every((x) => x && typeof x === 'object')

/**
 * @returns {{ metrics: {id:string,label:string,value:number,kind:string,known:boolean}[],
 *             recentBookings: object[]|null, recentTrips: object[]|null }}
 */
export function mapOverview(raw) {
  const data = unwrap(raw) ?? {}
  const metrics = []
  let recentBookings = null
  let recentTrips = null

  const visit = (obj, path) => {
    for (const [key, value] of Object.entries(obj ?? {})) {
      const here = [...path, key]
      if (typeof value === 'number' && Number.isFinite(value)) {
        metrics.push({ id: here.join('.'), value, ...describe(here) })
      } else if (isRecordList(value)) {
        if (/booking/i.test(key) && !recentBookings) recentBookings = value.map(mapAdminBooking).filter(Boolean)
        else if (/trip/i.test(key) && !recentTrips) recentTrips = value.map(mapAdminTrip).filter(Boolean)
      } else if (value && typeof value === 'object' && !Array.isArray(value) && path.length === 0) {
        visit(value, here)
      }
    }
  }
  visit(data, [])

  return { metrics, recentBookings, recentTrips }
}
