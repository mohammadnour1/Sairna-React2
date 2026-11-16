// Every admin cache key starts with 'admin', so it can never collide with passenger keys
// (['trips'], ['bookings']…) and one `removeQueries({ queryKey: ['admin'] })` clears it all on logout.
export const adminKeys = {
  all: () => ['admin'],
  me: () => ['admin', 'me'],
  overview: () => ['admin', 'overview'],
  cities: () => ['admin', 'cities'],
  companies: () => ['admin', 'companies'],
  trips: () => ['admin', 'trips'],
  trip: (id) => ['admin', 'trips', 'detail', id],
  bookings: () => ['admin', 'bookings'],
  booking: (id) => ['admin', 'bookings', 'detail', id],
  users: () => ['admin', 'users'],
  user: (id) => ['admin', 'users', 'detail', id],
}
