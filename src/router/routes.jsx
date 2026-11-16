import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import GuestOnlyRoute from './GuestOnlyRoute'
import RouteErrorPage from './RouteErrorPage'
import { adminRoute } from '@/admin/routes'
import Spinner from '@/components/ui/Spinner'

// Each page is its own chunk, loaded on first visit.
const HomePage = lazy(() => import('@/pages/HomePage'))
const ResultsPage = lazy(() => import('@/pages/ResultsPage'))
const BookingPage = lazy(() => import('@/pages/BookingPage'))
const BookingSuccessPage = lazy(() => import('@/pages/BookingSuccessPage'))
const MyTripsPage = lazy(() => import('@/pages/MyTripsPage'))
const TrackingPage = lazy(() => import('@/pages/TrackingPage'))
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const SupportPage = lazy(() => import('@/pages/SupportPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UiShowcasePage = import.meta.env.DEV ? lazy(() => import('@/pages/UiShowcasePage')) : null

const pageRoutes = [
  { index: true, element: <HomePage /> },
  { path: 'results', element: <ResultsPage /> },
  { path: 'booking/:tripId', element: <BookingPage /> },
  { path: 'companies', element: <CompaniesPage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'support', element: <SupportPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: 'booking/success/:bookingId', element: <BookingSuccessPage /> },
      { path: 'trips', element: <MyTripsPage /> },
      { path: 'tracking', element: <TrackingPage /> },
      { path: 'tracking/:bookingId', element: <TrackingPage /> },
      { path: 'account', element: <AccountPage /> },
    ],
  },
  {
    element: <GuestOnlyRoute />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  // Dev-only UI kit showcase (Phase 1). Not registered in production builds.
  ...(UiShowcasePage ? [{ path: '__ui', element: <UiShowcasePage /> }] : []),
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [{ element: <MainLayout />, children: pageRoutes }],
  },
  // Admin dashboard: separate branch (own layout, own auth, lazy-loaded). See CLAUDE.md §20.
  {
    ...adminRoute,
    errorElement: <RouteErrorPage />,
    // Shown while the lazy admin chunks load on a direct visit to /admin/*.
    hydrateFallbackElement: (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <Spinner label="جارٍ تحميل لوحة الإدارة..." />
      </div>
    ),
  },
])
