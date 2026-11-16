// `/admin/*` routes. Every element is loaded with React Router `route.lazy`, so the passenger
// bundle only contains these few lines; admin code is downloaded on the first /admin visit.

const load = (importer) => async () => ({ Component: (await importer()).default })

const section = (title, parent) => ({ title, ...(parent && { parent }) })
const TRIPS = { label: 'الرحلات', to: '/admin/trips' }
const BOOKINGS = { label: 'الحجوزات', to: '/admin/bookings' }
const USERS = { label: 'المستخدمون', to: '/admin/users' }

export const adminRoute = {
  path: 'admin',
  lazy: load(() => import('./AdminRoot')),
  children: [
    {
      lazy: load(() => import('./components/layout/AdminGuestRoute')),
      children: [{ path: 'login', lazy: load(() => import('./pages/AdminLoginPage')) }],
    },
    {
      lazy: load(() => import('./components/layout/AdminProtectedRoute')),
      children: [
        { index: true, lazy: load(() => import('./pages/OverviewPage')), handle: section('نظرة عامة') },
        { path: 'companies', lazy: load(() => import('./pages/CompaniesPage')), handle: section('شركات النقل') },
        { path: 'trips', lazy: load(() => import('./pages/TripsPage')), handle: section('الرحلات') },
        { path: 'trips/:tripId', lazy: load(() => import('./pages/TripDetailsPage')), handle: section('تفاصيل الرحلة', TRIPS) },
        { path: 'bookings', lazy: load(() => import('./pages/BookingsPage')), handle: section('الحجوزات') },
        { path: 'bookings/:bookingId', lazy: load(() => import('./pages/BookingDetailsPage')), handle: section('تفاصيل الحجز', BOOKINGS) },
        { path: 'users', lazy: load(() => import('./pages/UsersPage')), handle: section('المستخدمون') },
        { path: 'users/:userId', lazy: load(() => import('./pages/UserDetailsPage')), handle: section('تفاصيل المستخدم', USERS) },
        { path: 'cities', lazy: load(() => import('./pages/CitiesPage')), handle: section('المدن') },
        { path: '*', lazy: load(() => import('./pages/AdminNotFoundPage')), handle: section('الصفحة غير موجودة') },
      ],
    },
  ],
}
