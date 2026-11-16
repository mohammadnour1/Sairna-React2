# Dashboard API — real behaviour (discovered 2026-11-12)

Base: `https://sairna.abdulrahman-hares.com/api/v1/dashboard` · Swagger: `/api/docs/dashboard` (JSON: `/api/docs/dashboard-json`).
Samples: [`dashboard-samples/`](dashboard-samples/). Tokens are redacted, and real users' names, emails and phones are replaced.
Admin credentials are **not** stored anywhere in this repo.

Swagger documents request DTOs only. It documents no response bodies and no query parameters.
Everything below was observed by calling the live API with a seeded ADMIN account.

## Auth

| Call | Result |
|---|---|
| `POST /auth/login` `{ email, password }` | `201 { accessToken, tokenType: "Bearer", portal: "dashboard", user: { id, name, email, role: "ADMIN" } }` |
| wrong password | `401 { message: "INVALID_CREDENTIALS" }` |
| invalid email | `400 { message: ["email must be an email"] }` |
| `GET /auth/me` | `200 { id, name, email, role, createdAt }` |
| any endpoint without a token | `401 { message: "Unauthorized" }` |

## Reads (all plain arrays, no pagination, no query params)

| Endpoint | Shape | Notes |
|---|---|---|
| `GET /overview` | `{ customers, companies, upcomingTrips, totalBookings, confirmedBookings }` | numbers only; no lists |
| `GET /cities` | `[{ id, name, latitude, longitude }]` | 14 items |
| `GET /companies` | `[{ id, name, logoUrl, isActive }]` | includes inactive/archived companies |
| `GET /trips` | `[{ id, code, companyId, originId, destinationId, departureAt, arrivalAt, price, totalSeats, status, company, origin, destination }]` | **no `_count` / `availableSeats` in the list** |
| `GET /trips/{id}` | list item + `_count: { bookingSeats }` + `availableSeats` | 404 `TRIP_NOT_FOUND` |
| `GET /bookings` | `[{ id, code, userId, tripId, status, totalPrice, createdAt, cancelledAt, trip{…}, seats[…], user{ id, name, email } }]` | statuses seen: `CONFIRMED`, `CANCELLED` |
| `GET /bookings/{id}` | same as a list item | 404 `BOOKING_NOT_FOUND` |
| `GET /users` | `[{ id, name, email, role, createdAt }]` | no booking counts |
| `GET /users/{id}` | same as a list item (no bookings) | 404 `USER_NOT_FOUND` |

**Mapper decisions:**
- Booked seats per trip in lists = the seats of CONFIRMED bookings from `GET /bookings` (`useBookedSeatsByTrip`).
- Bookings per user = a count over `GET /bookings`.
- A user's bookings and a trip's bookings = filters over `GET /bookings`.

## Writes (tested only on records created for the test, named `[TEST] …`)

| Call | Result |
|---|---|
| `POST /companies { name }` | `201 { id, name, logoUrl, isActive: true }` |
| `PATCH /companies/{id}` | `200` updated company. **`logoUrl` is not validated by the server** (accepted `"not-a-url"`) → the form validates it |
| `DELETE /companies/{id}` | `200 { message: "COMPANY_ARCHIVED" }`. **Not a delete**: the company stays with `isActive: false` (hidden from the website) and can be re-activated with PATCH |
| `POST /trips` (CreateTripDto) | `201` flat trip (no nested company/origin/destination). Code generated as `TR-XXXXXXXX` |
| `POST /trips` for an inactive company | `400 INVALID_COMPANY` |
| `POST /trips` with origin = destination | `400 SAME_CITY` |
| `PATCH /trips/{id}` with arrival ≤ departure | `400 INVALID_TIMES` |
| `PATCH /trips/{id} { status: "CANCELLED" }` | `200` flat trip |
| `DELETE /trips/{id}` | `200` the trip with `status: "CANCELLED"`. **Not a delete**: the record stays |
| `POST /trips {}` | `400` class-validator list: integer ids ≥ 1, ISO 8601 dates, `price` integer ≥ 0, `totalSeats` integer 1–60 |
| `POST /bookings/999999/cancel` | `404 BOOKING_NOT_FOUND` |

Booking cancellation (`POST /bookings/{id}/cancel`) was **not** run against a real booking: every existing booking belongs to a real person. The website API answers it with `201 { id, status: "CANCELLED" }`, and the admin UI only needs the status code.

## Leftovers on the server from testing

The API has no hard delete, so these records stay on the server:
- company **#17** `[TEST] شركة فحص (معدّلة)`: archived (`isActive: false`), not visible on the website
- trip **#118** `TR-1445F351`: `CANCELLED`, belongs to company #17, not bookable

## UI consequences

- Companies: the row action is **«أرشفة»** (DELETE) for active companies and **«تفعيل»** (PATCH `isActive: true`) for inactive ones. Inactive companies cannot be picked in the trip form.
- Trips: the row action is **«إلغاء الرحلة»** (DELETE → CANCELLED). A trip is restored by editing its status back to `AVAILABLE`.
- The server error codes above are translated in `src/admin/api/adminErrors.js` and shown under the related form field.
