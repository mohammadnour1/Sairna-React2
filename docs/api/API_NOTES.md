# Sairna Website API — Notes (Phase 0 discovery)

Discovered on 2026-11-10 against `https://sairna.abdulrahman-hares.com/api/v1/website`.
Raw samples live in [`samples/`](samples/). Tokens and the test e-mail were redacted.

## General

| Topic | Finding |
|---|---|
| Health | `GET /api/v1/health` → `{"status":"ok","project":"SAIRNA","version":"2.0"}` |
| Server | Express (NestJS). Responses are plain JSON — **no envelope** (`data`, `items`) and **no pagination** |
| IDs | Numbers |
| Dates | ISO-8601 UTC strings (`2026-11-11T07:00:00.000Z`) |
| CORS | `Access-Control-Allow-Origin: *` — a browser on any origin can call the API directly. The Vite proxy is still used in dev (spec), production can call the API directly |
| Connectivity | The host intermittently times out on TCP connect (seen ~1 in 4 requests from this machine). The client uses a 15s timeout and React Query retries once for network errors |
| POST status | All POSTs return `201`, including login and cancel |

### Error format

```json
{ "message": "TRIP_NOT_FOUND", "error": "Not Found", "statusCode": 404 }
{ "message": ["email must be an email"], "error": "Bad Request", "statusCode": 400 }
{ "message": "Unauthorized", "statusCode": 401 }
```

- `message` is either a **machine code string** (`EMAIL_TAKEN`, `INVALID_CREDENTIALS`, `SEAT_ALREADY_RESERVED`, `TRIP_NOT_FOUND`, `COMPANY_NOT_FOUND`, `BOOKING_NOT_FOUND`) or an **array of class-validator English messages** that start with the field path (`email …`, `seats.0.passengerPhone …`).
- `errors.js` translates known codes to Arabic and maps validation arrays to fields by their first word (path).

| Code / message | Status | Arabic shown to the user |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | الإيميل أو كلمة المرور غلط. |
| `EMAIL_TAKEN` | 409 | هالإيميل مسجّل من قبل. جرّب تسجّل دخول. |
| `SEAT_ALREADY_RESERVED` | 409 | في مقعد انحجز قبل شوي، اختار مقعد بديل. |
| `TRIP_NOT_FOUND` | 404 | الرحلة غير موجودة أو ما عادت متاحة. |
| `BOOKING_NOT_FOUND` | 404 | الحجز غير موجود. |
| `COMPANY_NOT_FOUND` | 404 | الشركة غير موجودة. |
| `Unauthorized` (no/invalid token) | 401 | triggers session expiry flow |

## Endpoints

### `GET /cities` → `City[]` (14 items)
```json
{ "id": 1, "name": "دمشق", "latitude": 33.5138, "longitude": 36.2765 }
```
Coordinates are provided → `cityGeo.js` is only used for the English `slug` (photos) and as a fallback.

### `GET /companies` → `Company[]` (4 items) · `GET /companies/{id}` → `Company`
```json
{ "id": 1, "name": "الشام للنقل (تجريبي)", "logoUrl": null, "isActive": true }
```
**Gaps:** no `rating`, `tag`, `features`, `about`, colour. The UI hides rating stars/tags, hides service pills and uses `companyPalette.js` for colours. Names contain the suffix ` (تجريبي)`; the mapper keeps the full name for display and derives `initial` from the name without `ال`.

### `GET /trips?originId&destinationId&companyId&date` → `Trip[]`
- No pagination. Without filters returns all trips (117, including past dates).
- `date=YYYY-MM-DD` filters by the **UTC** day of `departureAt`. Bad formats → `400`.
- `GET /trips/{id}` returns the same shape.

```json
{
  "id": 1, "code": "DEMO-2026-11-05-1", "companyId": 1, "originId": 2, "destinationId": 1,
  "departureAt": "2026-11-05T07:00:00.000Z", "arrivalAt": "2026-11-05T13:00:00.000Z",
  "price": 145000, "totalSeats": 40, "status": "AVAILABLE",
  "company": { "id": 1, "name": "…", "logoUrl": null },
  "origin": { "id": 2, "name": "حلب", "latitude": 36.2021, "longitude": 37.1343 },
  "destination": { … },
  "_count": { "bookingSeats": 0 }, "availableSeats": 40
}
```
Seeded data: 7 routes (حلب↔دمشق, حمص→دمشق, اللاذقية→حلب, حماة→حمص, طرطوس→دمشق, إدلب→حلب), dates 2026-11-05 … 2026-11-17, all `status: AVAILABLE`, 40 seats.

**Decisions**
- Times are displayed in **`Asia/Damascus`** (UTC+3) with `Intl`. `07:00Z` → `10:00`.
- `durationMinutes` = `arrivalAt − departureAt`.
- No `distanceKm` → the UI shows `~estimateRoadKm()` labelled approximate.
- `date` sent to the API is the Damascus calendar date chosen by the user. All seeded departures are 07:00–16:00 UTC, so UTC day = Damascus day; a trip departing 21:00–24:00 UTC would be a mismatch (backend limitation, noted).

### `GET /trips/{id}/seats`
```json
{ "tripId": 117, "totalSeats": 40, "status": "AVAILABLE", "occupiedSeats": [7, 8], "availableSeats": 38 }
```
No layout information → default 2 + aisle + 2 layout, `ceil(totalSeats / 4)` rows. Validation caps `seatNumber` at 60.

### `POST /auth/register` `{ name, email, password }` → 201
### `POST /auth/login` `{ email, password }` → 201
```json
{ "accessToken": "<jwt>", "tokenType": "Bearer", "portal": "website",
  "user": { "id": 31, "name": "…", "email": "…", "role": "USER" } }
```
- Register returns a token directly → no extra login call.
- Validation: `name` ≥ 2 chars (UI keeps 3 per spec), email format, password ≥ 8.
- JWT lifetime: 7 days (`exp − iat`). No refresh endpoint.

### `GET /auth/me` → `{ id, name, email, role: "USER", createdAt }`

### `POST /bookings` (JWT) → 201 `Booking`
```json
{
  "id": 1, "code": "SR-0184FF29", "userId": 31, "tripId": 117, "status": "CONFIRMED",
  "totalPrice": 90000, "createdAt": "…", "cancelledAt": null,
  "trip": { …Trip without availableSeats/_count, company has isActive… },
  "seats": [ { "id": 1, "bookingId": 1, "tripId": 117, "seatNumber": 7,
               "passengerName": "مسافر تجريبي", "passengerPhone": "0999999999" } ]
}
```
- Phone rule from backend: `/^[+0-9\s-]{9,18}$/` (same as the UI rule).
- Seat taken → `409 SEAT_ALREADY_RESERVED`.

### `GET /bookings/me` → `Booking[]` · `GET /bookings/{id}` → `Booking`
Same shape as create. Unknown id → `404 BOOKING_NOT_FOUND`.

### `POST /bookings/{id}/cancel` → 201 `{ "id": 1, "status": "CANCELLED" }`
- Idempotent (cancelling twice still returns 201).
- After cancel the booking keeps `code`, `trip`, `totalPrice`, `cancelledAt`, but **`seats` becomes `[]`** — seat numbers and passenger names are no longer available for cancelled bookings. The UI shows `—` for seats of cancelled bookings.

## Statuses

| Entity | Values seen | UI |
|---|---|---|
| Trip | `AVAILABLE` | other values are treated as not bookable |
| Booking | `CONFIRMED`, `CANCELLED` | `تم تأكيد الحجز` / `ملغى` |

## Gaps vs. CLAUDE.md

1. Companies have no rating/tag/features/about → those UI elements are hidden (no invented data).
2. Trips have no distance → approximate road distance from coordinates, clearly labelled.
3. Seats have no layout → default reference layout.
4. Cancelled bookings lose their seat list.
5. `date` filter uses the UTC day.
6. Test data created during discovery: one account (`USER`) and booking `SR-0184FF29` (cancelled immediately).

## Phase 5 notes (booking from the UI)

- The UI booking flow was tested end-to-end: booking id `2` (trip 117, seats 5 + 6) was created from the React app on 2026-11-10 and is cancelled during the Phase 7 cancel test.
- A seat conflict was tested with an intercepted `409 SEAT_ALREADY_RESERVED` response (no data written): the UI shows the toast, refetches seats and returns to the seat step while keeping passenger data.
- Company names: the mapper strips the ` (تجريبي)` suffix and shows a `شركة تجريبية` tag instead (nothing hidden, nothing invented).
