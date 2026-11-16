// Query key factory — one place that defines how cached data is identified.
export const queryKeys = {
  cities: () => ['cities'],
  companies: () => ['companies'],
  company: (id) => ['companies', id],
  trips: ({ originId, destinationId, date }) => ['trips', { originId, destinationId, date }],
  allTrips: () => ['trips'],
  trip: (id) => ['trips', 'detail', id],
  tripSeats: (id) => ['trips', 'detail', id, 'seats'],
  me: () => ['auth', 'me'],
  myBookings: () => ['bookings', 'me'],
  booking: (id) => ['bookings', 'detail', id],
  allBookings: () => ['bookings'],
}
