// Every API path lives here — no hard-coded URLs elsewhere.
export const endpoints = {
  register: () => '/auth/register',
  login: () => '/auth/login',
  me: () => '/auth/me',
  cities: () => '/cities',
  companies: () => '/companies',
  company: (id) => `/companies/${id}`,
  trips: () => '/trips',
  trip: (id) => `/trips/${id}`,
  tripSeats: (id) => `/trips/${id}/seats`,
  bookings: () => '/bookings',
  myBookings: () => '/bookings/me',
  booking: (id) => `/bookings/${id}`,
  cancelBooking: (id) => `/bookings/${id}/cancel`,
}

/** Requests whose 401 means "wrong credentials", not "session expired". */
export const AUTH_FORM_PATHS = [endpoints.login(), endpoints.register()]
