// Every Dashboard API path (relative to VITE_ADMIN_API_BASE_URL). No hard-coded URLs elsewhere.
export const adminEndpoints = {
  login: () => '/auth/login',
  me: () => '/auth/me',
  overview: () => '/overview',
  cities: () => '/cities',
  companies: () => '/companies',
  company: (id) => `/companies/${id}`,
  trips: () => '/trips',
  trip: (id) => `/trips/${id}`,
  bookings: () => '/bookings',
  booking: (id) => `/bookings/${id}`,
  cancelBooking: (id) => `/bookings/${id}/cancel`,
  users: () => '/users',
  user: (id) => `/users/${id}`,
}
