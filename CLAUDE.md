# CLAUDE.md — Sairna (سيرنا) React Rebuild

This file is the single source of instructions for rebuilding the Sairna website in React.
Read it fully before doing anything. Re-read the relevant section at the start of every phase.

---

## 0. Mission

Rebuild the existing **Sairna** website (an Arabic RTL bus-reservation website between Syrian governorates, originally vanilla HTML/CSS/JS with fake local data) as a **component-based React application connected to the real Sairna backend API**.

Three non-negotiable goals:

1. **Visual fidelity.** The React app must look and feel like `reference/SAIRNA_UI.html`. This is a migration, NOT a redesign.
2. **Real data.** All data comes from the Sairna Website API. No fake trips, no fake seats, no local booking storage.
3. **Fix every known bug** listed in section 14 while migrating.

The user is learning. They want to **understand and review** every phase, not just receive code. Work incrementally and stop after every phase (see section 1).

---

## 1. Golden rules (read before every task)

1. **One phase at a time.** Phases are defined in section 17. Complete exactly one phase, verify it, write the report (section 18), then **STOP and wait for the user's explicit approval**. Never start the next phase on your own.
2. **Never modify anything inside `reference/`.** It is read-only source material.
3. **JavaScript + JSX only.** No TypeScript, no `.ts`/`.tsx` files, no `@types/*`.
4. **Allowed dependencies only** (section 3). Ask the user before adding anything else, even dev tools.
5. **Keep the two APIs apart.** Passenger pages call the Website API only. The admin dashboard (section 20) calls the Dashboard API only, through its own axios client. Admin credentials are typed by a human into the admin login form; never write them into code, `.env` files, samples, docs, commits or logs, and never print them back. Do not search the machine for credentials.
6. **Ask before writing to the backend.** GET requests are free to run. Before any request that creates or changes data on the server (register, create booking, cancel booking), tell the user what you will send and wait for approval. Test bookings occupy real seats; cancel them after testing (with approval).
7. **Do not guess API response shapes.** Use the real samples documented in `docs/api/API_NOTES.md` (produced in Phase 0). If a needed field does not exist, say so in the report and propose a solution; do not invent it silently.
8. **Copy Arabic text verbatim** from `reference/SAIRNA_UI.html`, except for the copy changes explicitly listed in section 15.
9. **No `dangerouslySetInnerHTML`** anywhere.
10. **Small, focused components.** A component that grows beyond ~150 lines or mixes data-fetching with layout must be split. Logic goes into hooks; HTTP goes into services.
11. **Commit at the end of each phase** (after verification, before the report) with message `phase-N: <short description>`, so the user can review the diff.
12. **Communicate with the user in Levantine Arabic, keeping English technical terms** (component, hook, props, query, etc.). Code, comments, identifiers and commit messages are in English.

---

## 2. Workspace layout and reference material

Expected layout at project root:

```
sairna-react/                ← project root (this file lives here)
├── CLAUDE.md
├── reference/               ← ORIGINAL PROJECT, READ-ONLY
│   ├── SAIRNA_UI.html       ← ★ visual + behavioral source of truth (inline <style> and <script>)
│   ├── css/styles.css       ← older version, ignore except for history
│   ├── js/app.js            ← older version (Leaflet + offline SVG map), ignore except for history
│   ├── assets/              ← logo.svg, hero.svg, city-aleppo/damascus/homs/latakia.svg
│   └── README.md            ← describes the OLDER version; partly outdated
└── (Vite project files created in Phase 0)
```

How to use the reference:

- **`SAIRNA_UI.html` is the only source of truth.** Its inline `<style>` is the visual spec. Its inline `<script>` is the behavioral spec (page templates, copy, interactions).
- When building a component, find its selectors (section 13 lists them per component) inside the `<style>` block of `SAIRNA_UI.html` and replicate: sizes, spacing, radii, colors, shadows, gradients, hover/focus states, transitions, and every responsive override inside the `@media` blocks.
- The end of that `<style>` block contains later patch layers (photography, maps, image reliability). When the same selector appears several times, **the last definition wins**. Replicate the final computed result, not each layer.
- Ignore dead CSS in the reference: `.google-key-form`, `.google-map-hint`, `.google-map-symbol`, `.leaflet-*`.
- Ignore `reference/.mcp-state/` if present (local tooling, contains keys). Never copy it. Add `.mcp-state/` to `.gitignore`.

---

## 3. Tech stack

Install the latest stable versions at install time.

**Runtime dependencies (allowed):**

| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI |
| `react-router-dom` | Routing (data router: `createBrowserRouter` + `RouterProvider`) |
| `@tanstack/react-query` | Server state |
| `axios` | HTTP |
| `lucide-react` | Icons |
| `maplibre-gl` | Interactive map (kept from the reference) |

**Dev dependencies (allowed):**

- `vite`, `@vitejs/plugin-react`
- `tailwindcss`, `@tailwindcss/vite` (Tailwind **v4**, CSS-first config, no `tailwind.config.js`)
- ESLint packages that come with the Vite React template

**Not allowed without asking:** TypeScript, clsx/classnames (write a tiny `cn()` util), prop-types, UI kits, state libraries (Redux/Zustand), form libraries, date libraries, test frameworks, React Query Devtools.

Fonts: **Cairo** (weights 400–900) via the Google Fonts `<link>` in `index.html`, exactly as the reference does. Fallback stack: `Cairo, "Segoe UI", Tahoma, sans-serif`.

---

## 4. Backend API

### 4.1 Addresses

- Website API base: `https://sairna.abdulrahman-hares.com/api/v1/website`
- Health check: `https://sairna.abdulrahman-hares.com/api/v1/health` → `{"status":"ok","project":"SAIRNA","version":"2.0"}`
- Swagger UI (Website): `https://sairna.abdulrahman-hares.com/api/docs/website`
- Auth: `Authorization: Bearer <JWT>`
- **Dashboard API** (`/api/v1/dashboard`) is used only by the admin area under `/admin`. See section 20.

### 4.2 Endpoints (13), paths relative to the Website base

| # | Method | Path | Auth | Request | Used by |
|---|---|---|---|---|---|
| 1 | POST | `/auth/register` | — | `{ name, email, password }` (password `minLength: 8`) | Register page |
| 2 | POST | `/auth/login` | — | `{ email, password }` | Login page |
| 3 | GET | `/auth/me` | JWT | — | Session restore, Header, Account |
| 4 | GET | `/cities` | — | — | Search form, Home, Results |
| 5 | GET | `/companies` | — | — | Results, Companies, Home metrics |
| 6 | GET | `/companies/{id}` | — | `id: number` | Company details (if needed) |
| 7 | GET | `/trips` | — | query (all optional): `originId: number`, `destinationId: number`, `companyId: number`, `date: "YYYY-MM-DD"` | Results |
| 8 | GET | `/trips/{id}` | — | `id: number` | Booking page summary |
| 9 | GET | `/trips/{id}/seats` | — | `id: number` | Seat map |
| 10 | POST | `/bookings` | JWT | `{ tripId: number, seats: [{ seatNumber: number, passengerName: string, passengerPhone: string }] }` (1–4 seats) | Booking confirmation |
| 11 | GET | `/bookings/me` | JWT | — | My Trips, Account count, Tracking default |
| 12 | GET | `/bookings/{id}` | JWT | `id: number` | Success page, Ticket modal, Tracking |
| 13 | POST | `/bookings/{id}/cancel` | JWT | — | Cancel action (My Trips + Ticket modal) |

Known facts from the spec:

- All IDs are **numbers**.
- POST endpoints are documented with status `201`.
- **Response bodies are NOT documented.** You must discover them in Phase 0 (section 17).
- The backend is NestJS. Expect error bodies like `{ statusCode, message, error }`, where `message` may be a **string or an array of strings**. Verify this in Phase 0.
- There is **no** logout endpoint, no refresh-token endpoint, no forgot-password endpoint, no payment field, no tracking/GPS endpoint, and no profile-update endpoint.

### 4.3 Development connection and CORS

- In development, call the API through a **Vite proxy** so CORS never blocks local work:
  - `.env.development` → `VITE_API_BASE_URL=/api/v1/website`
  - `vite.config.js` → proxy `'/api'` to `https://sairna.abdulrahman-hares.com` with `changeOrigin: true`, `secure: true`.
- `.env.example` documents `VITE_API_BASE_URL` and `VITE_API_PROXY_TARGET`.
- In Phase 0, check whether the backend sends CORS headers for a browser origin (e.g. `curl -I -H "Origin: http://localhost:5173" <url>`). Record the result in `API_NOTES.md`. Production deployment needs either backend CORS for the site origin or same-origin hosting. Report it; don't solve it now.
- No secrets belong in this frontend. Commit `.env.example` only; `.env*.local` are git-ignored.

---

## 5. Architecture

### 5.1 Data flow

```
Page → Section components → Custom hooks (React Query) → Services → Axios client → Website API
                                   ↑
                               Mappers (normalize API data into internal models)
```

Rules:

- **Components never import axios or services directly.** They use hooks.
- **Services** are plain async functions: call the client, return mapped data. No React inside.
- **Mappers** are the only place that knows raw API field names. If the backend changes, only mappers change.
- **Pages** compose sections and read route params. They contain almost no logic.

### 5.2 Folder structure

```
src/
├── main.jsx                    # createRoot, providers, RouterProvider
├── App.jsx                     # Providers composition (QueryClientProvider, Theme, Auth, Toast)
├── router/
│   ├── routes.jsx              # createBrowserRouter definition (lazy pages)
│   ├── ProtectedRoute.jsx      # requires session → else /login with `from`
│   ├── GuestOnlyRoute.jsx      # logged-in users are redirected to /account
│   └── RouteErrorPage.jsx      # errorElement
├── api/
│   ├── client.js               # axios instance + interceptors
│   ├── endpoints.js            # path builders (no hard-coded strings elsewhere)
│   ├── queryClient.js          # QueryClient + defaults
│   ├── queryKeys.js            # query key factory
│   ├── errors.js               # getErrorMessage(), isSeatConflict(), field error extraction
│   ├── authEvents.js           # tiny event emitter: 'unauthorized'
│   └── mappers/                # city.mapper.js, company.mapper.js, trip.mapper.js,
│                               # seat.mapper.js, booking.mapper.js, user.mapper.js
├── services/                   # auth.service.js, cities.service.js, companies.service.js,
│                               # trips.service.js, bookings.service.js
├── hooks/
│   ├── queries/                # useCities, useCompanies, useCompany, useTrips, useTrip,
│   │                           # useTripSeats, useMe, useMyBookings, useBooking
│   ├── mutations/              # useLogin, useRegister, useCreateBooking, useCancelBooking
│   ├── useSearchParamsState.js # typed read/write of URL search params
│   ├── useTripSearch.js        # search criteria + defaults + validation
│   ├── useTripFilters.js       # company/time/sort filtering & sorting (client-side)
│   ├── useBookingFlow.js       # useReducer + sessionStorage draft
│   ├── useTrackingSimulation.js
│   ├── useMapLibre.js
│   ├── useImageFallback.js
│   ├── useDocumentTitle.js
│   ├── useLockBodyScroll.js
│   └── useFocusTrap.js
├── context/
│   ├── AuthContext.jsx         # token, user (from useMe), login/logout helpers
│   ├── ThemeContext.jsx        # 'light' | 'dark', persisted
│   └── ToastContext.jsx        # showToast(message, type)
├── data/                       # STATIC UI content and visual fallbacks only (never trips/seats/bookings)
│   ├── navigation.js           # header + footer links
│   ├── cityGeo.js              # coordinates + slugs for the 14 governorates (section 9.2)
│   ├── cityPhotos.js           # photo URL chains + local SVG fallbacks + credits
│   ├── companyPalette.js       # visual fallback colors for companies
│   ├── homeContent.js          # hero points, metrics, process steps, featured destinations
│   └── faq.js
├── utils/
│   ├── cn.js                   # join class names
│   ├── format.js               # formatMoney, formatDate, formatDuration, formatTime
│   ├── date.js                 # todayLocalISO, tomorrowLocalISO, isPastDate
│   ├── geo.js                  # haversineKm, estimateRoadKm, interpolate
│   ├── text.js                 # normalizeArabic, firstName, initial
│   ├── validation.js           # validateSearch, validatePassenger, validateAuth
│   └── storage.js              # safe local/session storage read/write
├── styles/
│   └── index.css               # Tailwind import, tokens, dark mode, base, keyframes, small component layer
├── assets/                     # copied from reference/assets: logo.svg, hero.svg, city-*.svg
├── components/
│   ├── ui/                     # generic, domain-agnostic
│   ├── layout/                 # app shell
│   ├── common/                 # Sairna-specific, reused across pages
│   ├── home/  results/  booking/  success/  trips/  tracking/
│   ├── auth/  account/  companies/  about/  support/
└── pages/                      # one thin file per route
```

Also: `public/favicon.svg` (copy of `logo.svg`), `docs/api/API_NOTES.md`, `docs/api/samples/*.json`.

### 5.3 Conventions

- One component per file, `PascalCase.jsx`, default export. Hooks `useCamelCase.js`. Services `name.service.js`. Mappers `name.mapper.js`.
- Document component props with a short JSDoc block above the component.
- Use `.jsx` only for files that contain JSX.
- Import alias `@` → `src` (configure in `vite.config.js`).
- No inline styles, except dynamic CSS variables, e.g. `style={{ '--logo-color': color }}` like the reference, or a progress width.
- `npm run lint` must pass with zero errors.

---

## 6. HTTP layer

### 6.1 `api/client.js`

- `axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 15000 })`. Don't set `Content-Type` manually.
- **Request interceptor:** read the token via `storage.js` (see 6.3). If present, set `Authorization: Bearer <token>`.
- **Response interceptor:**
  - On `401` for any request **except** `/auth/login` and `/auth/register`: clear the token and emit `authEvents.emit('unauthorized')`.
  - `AuthContext` listens to that event. It clears the user from the React Query cache, shows the toast `انتهت الجلسة، سجّل دخولك من جديد.`, and redirects to `/login` with `state.from`.
  - Reject with the original error. Formatting happens in `errors.js`.
- Never log tokens or passwords.

### 6.2 `api/errors.js`

- `getErrorMessage(error, fallback)`: handles network error / timeout (`تعذّر الاتصال بالخادم. تأكد من الإنترنت وحاول مرة ثانية.`), NestJS `message` as a string or array (join with `، `), and unknown errors (use `fallback`).
- `getFieldErrors(error)`: best-effort mapping of validation messages to form fields (`email`, `password`, `name`, `seats[i].passengerPhone`…). The exact shape comes from Phase 0 findings.
- `isSeatConflict(error)`: true when a booking failed because a seat is already taken. Detect the status/message from Phase 0 testing. If you could not test it, detect `409`, or `400` with a message mentioning seats.

### 6.3 Token storage

- Key: `sairna-token`.
- "تذكرني" checked → `localStorage`. Unchecked → `sessionStorage`.
- Register: same as login with remember = true.
- Reading: check `sessionStorage` first, then `localStorage`.
- Logout: remove from both. Also call `queryClient.removeQueries` for user-scoped keys (`me`, `bookings`).
- Never store the password. Never store the user object as the source of truth; the user always comes from `GET /auth/me`.

### 6.4 React Query

`queryClient.js` defaults:
- `staleTime: 60_000`
- `refetchOnWindowFocus: false`
- `retry`: up to 1 retry, but **never retry 4xx**

`queryKeys.js` (factory):

```
cities:        ['cities']
companies:     ['companies']
company:       ['companies', id]
trips:         ['trips', { originId, destinationId, date }]
trip:          ['trips', 'detail', id]
tripSeats:     ['trips', 'detail', id, 'seats']
me:            ['auth', 'me']
myBookings:    ['bookings', 'me']
booking:       ['bookings', 'detail', id]
```

Hooks:

| Hook | Endpoint | Options |
|---|---|---|
| `useCities()` | GET /cities | `staleTime: 1h` |
| `useCompanies()` | GET /companies | `staleTime: 1h` |
| `useCompany(id)` | GET /companies/{id} | `enabled: !!id` |
| `useTrips(criteria)` | GET /trips | `enabled` only when criteria are valid. Do **not** send `companyId` (filtering is client-side so per-company counts work) |
| `useTrip(id)` | GET /trips/{id} | `enabled: !!id` |
| `useTripSeats(id, { live })` | GET /trips/{id}/seats | `staleTime: 0`, `refetchOnWindowFocus: true`, `refetchInterval: live ? 30_000 : false` |
| `useMe()` | GET /auth/me | `enabled: hasToken`, `staleTime: 5m`, `retry: false` |
| `useMyBookings()` | GET /bookings/me | `enabled: isAuthenticated` |
| `useBooking(id)` | GET /bookings/{id} | `enabled: isAuthenticated && !!id`. Seed from the `myBookings` cache when available (`initialData` lookup) |

Mutations:

| Hook | Endpoint | On success | On error |
|---|---|---|---|
| `useLogin()` | POST /auth/login | save token (respect remember), set/refresh `me`, navigate to `from` or `/account` | inline + toast error |
| `useRegister()` | POST /auth/register | if a token is returned, behave like login. If not, call login with the same credentials. Then navigate | inline field errors |
| `useCreateBooking()` | POST /bookings | invalidate `myBookings`, `trip(id)`, `tripSeats(id)`, `['trips']`; clear the booking draft; `navigate('/booking/success/:id', { replace: true })` | seat conflict → toast `في مقعد انحجز قبل شوي، اختار مقعد بديل.`, refetch seats, go back to the seats step, keep passenger data; other errors → toast |
| `useCancelBooking()` | POST /bookings/{id}/cancel | invalidate `myBookings`, `booking(id)`, related `tripSeats`; toast `تم إلغاء الحجز.` | toast |

---

## 7. Client state

| State | Where |
|---|---|
| Search criteria (`originId`, `destinationId`, `date`, `people`) | **URL search params** on `/results` |
| Filters (`company`, `time`, `sort`) | **URL search params** on `/results`, updated with `replace: true`, no scroll reset |
| Search form inputs before submit | local `useState` inside `SearchForm` |
| Last search | `sessionStorage` key `sairna-last-search`, used to prefill the Home form and destination shortcuts |
| Booking flow (`people`, `step`, `selectedSeats`, `passengers`) | `useBookingFlow` (`useReducer`) + `sessionStorage` draft key `sairna-booking-draft:<tripId>`. Cleared after successful booking |
| Theme | `ThemeContext` + `localStorage` key `sairna-theme` (`'light'` default) |
| Auth session | `AuthContext` (token + `useMe`) |
| Toasts | `ToastContext` |
| Mobile menu, modals, password visibility | local `useState` |
| Tracking progress / play / pause | `useTrackingSimulation` |

Theme application:
- Set `document.documentElement.dataset.theme`.
- Update `<meta name="theme-color">` (light `#0d3043`, as in the reference).
- Add a tiny inline script in `index.html` that applies the saved theme **before React mounts**, so there is no flash.

---

## 8. Routes

Use `createBrowserRouter`. Lazy-load pages with `React.lazy`. All pages are wrapped by `MainLayout` (announcement + header + outlet + footer).

| Path | Page | Access | Notes |
|---|---|---|---|
| `/` | HomePage | public | |
| `/results` | ResultsPage | public | Params: `originId`, `destinationId`, `date`, `people`, `company`, `time`, `sort`. Missing/invalid params → defaults (section 10.2) |
| `/booking/:tripId` | BookingPage | public until confirm | Param `?people=`. Confirm requires auth (section 10.4) |
| `/booking/success/:bookingId` | BookingSuccessPage | protected | |
| `/trips` | MyTripsPage | protected | |
| `/tracking` and `/tracking/:bookingId` | TrackingPage | protected | No footer (reference `body.no-footer`) |
| `/companies` | CompaniesPage | public | |
| `/login` | LoginPage | guest-only | Reference `body.auth-route` styling |
| `/register` | RegisterPage | guest-only | |
| `/account` | AccountPage | protected | |
| `/about` | AboutPage | public | |
| `/support` | SupportPage | public | |
| `*` | NotFoundPage | public | New page, same visual language (empty-state style) |

Behavior:

- `ProtectedRoute`:
  - While a token exists and `me` is loading → show a centered loader.
  - No token, or `me` failed with 401 → `<Navigate to="/login" state={{ from: location }} replace />`.
- `GuestOnlyRoute`: authenticated → `<Navigate to="/account" replace />`.
- **Scroll:** scroll to top on pathname change only. Do NOT scroll when only search params change (filters), matching the reference's `render(true)`.
- **Header active link:** `احجز رحلة` is active on `/results` and `/booking/*` (reference behavior).
- **Document titles:**
  - Home: `سيرنا | الرحلة بتبلّش من هون`
  - Other pages: `سيرنا | <page name>`, e.g. `سيرنا | نتائج البحث`

---

## 9. Data models, mappers and static fallbacks

### 9.1 Internal models (what components receive)

```
City     { id:number, name:string, slug:string|null, lat:number|null, lng:number|null }
Company  { id:number, name:string, initial:string, color:string, bg:string,
           rating:number|null, tag:string|null, features:string[], about:string|null }
Trip     { id:number, origin:City, destination:City, company:Company,
           date:'YYYY-MM-DD', departureTime:'HH:mm', arrivalTime:'HH:mm'|null,
           durationMinutes:number|null, price:number, availableSeats:number|null,
           totalSeats:number|null, distanceKm:number|null }
SeatMap  { totalSeats:number, seats:[{ number:number, status:'available'|'booked' }],
           columns:number /*default 4*/ }
Booking  { id:number, code:string /*display ref, fallback `SR-${id}`*/, status:string,
           isCancelled:boolean, trip:Trip|null, seats:[{ seatNumber, passengerName, passengerPhone }],
           total:number|null, createdAt:string|null }
User     { id, name, email, role }
```

Mappers must:
- Tolerate missing/nullable fields and nested vs flat shapes (e.g. `trip.originId` vs `trip.origin.id`).
- Fill gaps with the fallbacks below.
- **Never** fabricate business data such as prices, seats or times.

If a field the UI needs is missing (e.g. `arrivalTime`), compute it only when it is derivable (`departureTime + durationMinutes`). Otherwise hide that UI element.

### 9.2 `data/cityGeo.js` — coordinates (from the reference)

Match API cities by `normalizeArabic(name)`. Normalization: trim, remove tatweel and diacritics, `أ/إ/آ→ا`, `ة→ه`, `ى→ي`. Also match by English slug if the API provides one.

| slug | name | lat | lng |
|---|---|---|---|
| damascus | دمشق | 33.5138 | 36.2765 |
| aleppo | حلب | 36.2021 | 37.1343 |
| homs | حمص | 34.7324 | 36.7137 |
| hama | حماة | 35.1318 | 36.7578 |
| latakia | اللاذقية | 35.5317 | 35.7901 |
| tartus | طرطوس | 34.8959 | 35.8866 |
| idlib | إدلب | 35.9306 | 36.6339 |
| deir | دير الزور | 35.3359 | 40.1408 |
| raqqa | الرقة | 35.95 | 39.0167 |
| hasakah | الحسكة | 36.5024 | 40.7477 |
| daraa | درعا | 32.6189 | 36.1021 |
| sweida | السويداء | 32.7081 | 36.5695 |
| quneitra | القنيطرة | 33.1265 | 35.8246 |
| rif-damascus | ريف دمشق | 33.63 | 36.46 |

If the API returns coordinates, prefer them.

### 9.3 `data/cityPhotos.js`

Copy `PHOTO_SOURCES` exactly from the reference script: keys `hero`, `damascus`, `aleppo`, `latakia`, `homs`, each an ordered list of 4 URLs (wsrv.nl proxy → Wikimedia thumb → original → Special:Redirect).

**Add a final local fallback** for each:
- `hero` → `assets/hero.svg`
- each city → `assets/city-<slug>.svg`

Credits (footer) are copied verbatim from the reference footer `.photo-credit` block.

### 9.4 `data/companyPalette.js`

The reference companies had these visual pairs `{color, bg}`, in order:

1. `#109d9c` / `#e7f9f6`
2. `#e69a46` / `#fff3df`
3. `#5085e6` / `#e9efff`
4. `#9969ce` / `#f1eafe`

If the API provides no color, assign `palette[(index of company in the list, or id-1) % 4]`. `initial` = first letter of the company name (skip a leading `ال` so `الشام` → `ش`, matching the reference).

Feature → icon mapping for service pills:
- `Wi-Fi` → `Wifi`
- `مكيّف` → `Snowflake`
- anything else → `Plug`

### 9.5 Seat layout

Default layout from the reference:
- 4 seats per row: 2 + aisle + 2.
- Rows numbered `01`, `02`, … on the side.
- Seat numbering row-wise: row `r` (0-based) contains `r*4+1 … r*4+4`.
- Rows = `ceil(totalSeats / 4)`.

If the API returns layout information (rows/columns/positions), use it instead and document it.

---

## 10. Page specifications

General for every data-driven section:
- **Loading:** skeletons shaped like the final content.
- **Error:** message + "حاول مرة ثانية" button (`refetch`).
- **Empty:** a meaningful empty state.

All copy comes from the reference unless section 15 changes it.

### 10.1 Home (`/`)

Sections in order (reference `homePage()`):
1. Hero: eyebrow, h1 with gradient text, paragraph, 3 hero points, social proof, hero photo with caption and 2 floating stats, orbits.
2. Search shell with heading + `SearchForm` (home variant).
3. Metrics strip.
4. Destinations: title row + 4 destination cards (دمشق، حلب، اللاذقية، حمص) with photos and descriptions from the reference.
5. Process: 3 steps.
6. Tracking feature split section with the **map preview** (Aleppo → Damascus, non-interactive preview).
7. CTA banner.

Data:
- `useCities()` → form options; "14 محافظة" values become `cities.length`.
- `useCompanies()` → metrics company count.

Destination card click:
- Resolve the city by name from `/cities`; render only cards whose city exists.
- Set destination = that city. Origin = last search origin, else حلب.
- **If origin equals destination, choose the first different city from [حلب، دمشق، حمص]** (fixes bug B1).
- date = tomorrow, people = 1 (or last search) → navigate to `/results?...`.

### 10.2 Results (`/results`)

Defaults when params are missing or invalid:
- origin = حلب, destination = دمشق (resolved by name)
- date = tomorrow (local)
- people = 1
- company = all, time = all, sort = earliest

If params are invalid (same city, past date, unknown id), correct them with `replace: true` and show a toast explaining what was corrected.

Sections (reference `resultsPage()`):
1. Page banner + breadcrumb.
2. Compact `SearchForm` (submitting updates URL params).
3. Company picker section (step 01/02 heading, "كل الشركات" + one card per company, with rating when available).
4. Results heading: count + route + date + people, plus sort select (`وقت الانطلاق` / `أقل سعر` / `أقصر مدة`).
5. Results layout:
   - Filters panel: company radios **with real counts per company**, time radios, info box.
   - Trip list or empty state.

Filtering (client-side in `useTripFilters`):
- company: id or `all`
- time:
  - `morning` = departure hour < 12
  - `afternoon` = 12 ≤ hour < 17
  - `evening` = hour ≥ 17
- sort:
  - `earliest` = departure time
  - `cheap` = price
  - `quick` = durationMinutes (fallback to departure when null)

Trip card (reference `tripCard()`):
- company logo/name/rating/tag
- departure → arrival with duration and route line
- price per person
- seats left
- service pills
- distance (API value, or `~estimateRoadKm` labeled approximate)
- Button `اختيار المقاعد` → `/booking/:tripId?people=N`

**If `availableSeats < people`**: the button is disabled and labeled `المقاعد المتاحة ما بتكفي` (fixes B4).

### 10.3 Login / Register (`/login`, `/register`)

Reference `authPage()`: auth panel + auth visual (Damascus photo).

Login:
- Fields: email, password with show/hide toggle.
- `تذكرني` (works, see 6.3).
- `نسيت كلمة المرور؟` → `/support`.

Register:
- Fields: name (min 3), email, password (**min 8**), terms checkbox (required).

Behavior:
- Client validation before submitting; server errors shown inline under fields and as a toast.
- The submit button shows a loading state and is disabled while pending.
- Success → `from` (if present) else `/account`, with toast `أهلاً وسهلاً! تم تسجيل الدخول.`

### 10.4 Booking (`/booking/:tripId`)

Data: `useTrip(tripId)`, `useTripSeats(tripId, { live: step === 'seats' })`.

States:
- Invalid/unknown trip → empty state `الرحلة غير موجودة أو ما عادت متاحة.` with a link back to results (fixes B6).
- Past trip → same pattern with an appropriate message.

People:
- `?people=` clamped to 1–4 and ≤ availableSeats.
- If people is reduced, keep only the first N selected seats.

Layout (reference `bookingPage()`): header with breadcrumb + "تغيير الرحلة", 3-step stepper, main card + sticky summary card.

**Step 1 — seats:**
- Seat map from API.
- Booked seats are disabled.
- Click toggles a seat.
- Selecting more than `people` → toast `مسموح تختار N مقعد فقط.`
- Selected seats always displayed sorted, **without mutating state** (B5).
- Hint card with counter and seat tags.
- "Next" requires exactly `people` seats.

**Step 2 — passengers:**
- One card per selected seat (shows the seat number).
- Name ≥ 3 chars; phone matches `/^[+\d\s-]{9,18}$/` (adapt if the backend enforces a different format; document it).
- The first passenger is prefilled with the user's name if logged in.
- **Data is kept when going back/forward** (B7).
- Errors are shown inline and the first invalid input is focused.

**Step 3 — review:**
- Passenger list with seats.
- Payment section: **one informational card** `الدفع في مكتب الشركة` (the API has no payment field; the second fake option is removed).
- Alert (updated copy, section 15).
- Button `تأكيد الحجز`.

Confirm:
- Not authenticated → toast `سجّل دخولك أولاً لإتمام الحجز.` → navigate to `/login` with `state.from` = current location. The draft persists, and after login the user lands back on the **review** step.
- Authenticated → `useCreateBooking` with `{ tripId, seats: selectedSeats.map((n, i) => ({ seatNumber: n, passengerName, passengerPhone })) }`.

Summary card:
- company, route, times, date (formatted), people, seats (sorted) or `لم تُحدّد بعد`, price per person, total = price × people.
- Trust line: `لا يوجد دفع إلكتروني ضمن المشروع التعليمي.`

### 10.5 Booking success (`/booking/success/:bookingId`)

- Data: `useBooking(bookingId)` (fixes "last booking" bug B24).
- Reference `successPage()`: animated check icon, eyebrow, title, paragraph, confirmation ticket (code, route, seats).
- Actions: `عرض تذكرتي` → `/trips`; `تتبّع الرحلة` → `/tracking/:id`.
- Not found → empty state.

### 10.6 My Trips (`/trips`)

- Data: `useMyBookings()`.
- Reference `tripsPage()`: banner, top row with "حجز جديد", list of `MyTripCard`.
- Card: code, status tag, route, times, date, company, seats, total.
- Actions:
  - `تتبّع الرحلة` — hidden/disabled for cancelled bookings
  - `عرض التذكرة` — opens `TicketModal`
  - **`إلغاء الحجز`** — new; only for cancellable statuses; opens a confirm dialog `أكيد بدك تلغي هالحجز؟` with buttons `إلغاء الحجز` / `رجوع`
- Status tags:
  - confirmed → success tag `تم تأكيد الحجز`
  - cancelled → muted/danger tag `ملغى`
  - other statuses → map them from the real values found in Phase 0
- Sort: upcoming first, cancelled last.
- Empty → empty state `ما عندك حجوزات لسا.` + CTA `احجز رحلة`.
- Remove the fake demo booking entirely.

`TicketModal` (reference `showTicket()`):
- Close via X, scrim click, or Esc.
- **Focus trap, initial focus on close button, return focus to the trigger, body scroll lock** (B15).
- Copy code button: clipboard with fallback toast.
- Cancel action is available here too.

### 10.7 Tracking (`/tracking`, `/tracking/:bookingId`)

Selecting the booking:
- No id → the nearest upcoming non-cancelled booking from `/bookings/me`.
- None → empty state with CTA.
- Cancelled booking → message instead of simulation.

Layout (reference `trackingPage()`):
- Title row.
- Sidebar: status, route heading, company, progress, timeline (origin / on the road / destination), quick stats (distance, remaining time), controls (play/pause, reset), warning text.
- Map panel: toolbar, map, Google Maps directions button, bottom overlay.

`useTrackingSimulation({ durationMinutes, distanceKm })`:
- Progress starts at `0.48` (reference demo start) and advances `+0.006` every `150ms` while playing.
- **Stops at 1.0** with status `وصلت الحافلة إلى الوجهة` (no infinite loop, B8). Reset → 0 and play.
- `prefers-reduced-motion: reduce` → start paused.
- Remaining time = `(1 - p) × durationMinutes`, formatted with `formatDuration`.
  - If duration is unknown, estimate `durationMinutes` from `estimateRoadKm / 63 km/h × 60 + 15` (reference formula) and label it approximate.
- Status text thresholds (reference):
  - `< 0.8` → `الحافلة تتحرك نحو الوجهة`
  - `≥ 0.8` → `اقتربنا من محطة الوصول`
  - `= 1` → arrived
- Distance from one util only (`utils/geo.js`).
- The bus marker position is `interpolate(origin, destination, p)` and is updated **through a ref, without recreating the map**. Theme changes must not reset the map or the simulation (B8, B25).

### 10.8 Account (`/account`)

- Reference `accountPage()`: banner with greeting + hand icon; profile card (avatar initial, name, email, bookings count, logout); details card (name, email, account type, link to trips).
- Bookings count = number of non-cancelled bookings from `/bookings/me`.
- Account type: from `role` if available (`USER` → `حساب مسافر`).
- Logout: clear session (6.3), toast `تم تسجيل الخروج.`, navigate `/`.

### 10.9 Companies (`/companies`)

- Data: `useCompanies()`.
- Reference `companiesPage()`: banner + grid of `CompanyCard` (large logo, rating tag if available, name, about, service pills, meta block, button).
- Meta block: show only values that come from the API. Remove the hard-coded `+12` / `يومياً` unless backed by data (B12).
- Button `عرض رحلات الشركة` → `/results?company=<id>` + default search params.
- Disclaimer line: updated copy (section 15).

### 10.10 About (`/about`), Support (`/support`), NotFound (`*`)

- About: reference `aboutPage()` with Latakia photo (updated copy, section 15).
- Support: reference `supportPage()`; FAQ with native `<details>` (updated answers, section 15) + support aside.
- NotFound: empty-state layout, title `الصفحة مو موجودة`, text `يمكن الرابط غلط أو الصفحة انشالت.`, button `رجوع للرئيسية`.

### 10.11 Shared shell

**Announcement bar:** reference text with dot + sparkle icon.

**Header:**
- logo
- desktop nav: `الرئيسية`، `احجز رحلة`، `شركات النقل`، `حجوزاتي`، `تتبّع الرحلة`
- theme toggle (moon/sun)
- logged out → `دخول` link + `إنشاء حساب` dark button
- logged in → user menu (avatar initial + first name + chevron) → `/account`
- mobile toggle

**Mobile panel:**
- Closes on route change, on Esc, and on outside click.
- Same links as desktop + `حسابي` or `تسجيل الدخول`/`إنشاء حساب`.
- `aria-expanded` and `aria-controls` on the toggle.

**Footer:** brand + text, decorative social icons (`aria-hidden`, not links, B18), 3 link columns, contact email, photo credits.

**Toast:**
- Bottom toast styled like the reference `.toast`; type `info`/`error`; auto-hide after 3600ms.
- Container has `role="status"` `aria-live="polite"`; errors use `role="alert"` (B17).

**Skip link:** `تخطّى إلى المحتوى` → `#main-content` (visually hidden until focused).

---

## 11. Design system (Tailwind v4)

### 11.1 Tokens (exact values from the reference `:root`)

Light:
```
--bg:#f8fafb; --surface:#fff; --surface-alt:#f2f7f8; --text:#112f41; --muted:#718493;
--border:#e4ecef; --primary:#0aa99b; --primary-deep:#078e87; --dark:#103a4e;
--dark-deep:#0a2c3e; --soft-teal:#e6f8f3;
--shadow:0 15px 55px rgba(19,54,72,.065); --shadow-md:0 22px 60px rgba(19,54,72,.11);
--radius:22px; --container:1216px; --font:Cairo,"Segoe UI",Tahoma,sans-serif
```

Dark (`:root[data-theme=dark]`):
```
--bg:#0b1c29; --surface:#112b3b; --surface-alt:#173748; --text:#eef8fa; --muted:#9eb3be;
--border:#254252; --dark:#0e2634; --dark-deep:#091c27; --soft-teal:#174b49;
--shadow:0 15px 55px rgba(0,0,0,.16); --shadow-md:0 22px 60px rgba(0,0,0,.26)
```

Implementation in `styles/index.css`:
- `@import "tailwindcss";`
- Define the raw variables on `:root` and `:root[data-theme="dark"]`. Set `color-scheme: light` / `dark` accordingly.
- Expose them through `@theme inline { --color-bg: var(--bg); --color-surface: var(--surface); ... --shadow-card: var(--shadow); ... }`. Utilities like `bg-surface text-muted border-border shadow-card` then switch automatically with the theme, without `dark:` everywhere.
- `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` for the few places that need explicit dark overrides (the reference has specific `[data-theme=dark]` rules; replicate them).
- **Breakpoints:** the reference is desktop-first (`max-width: 1150 / 900 / 650 / 370px`). Replace Tailwind's default breakpoints (`--breakpoint-*: initial;`) with:
  - `xs` = 371px
  - `sm` = 651px
  - `md` = 901px
  - `lg` = 1151px
  
  Then write mobile-first styles so each reference `max-width` block maps to "below the corresponding min-width".
- Container utility: `width: min(var(--container), calc(100% - 68px)); margin-inline: auto;` plus the reference's mobile container overrides.
- Base styles from the reference:
  - body: `font-size:14px; line-height:1.75; antialiased`
  - headings: weight 800, line-height 1.5
  - `p { color: var(--muted) }`
  - focus-visible outline `3px solid #4cc8bf`, offset 3px
  - `scroll-behavior: smooth`

### 11.2 Motion

- Copy the keyframes `fade`, `float` (uses `--float-distance`), `pop`, `pulse` from the reference and expose them as `--animate-*` theme values with the reference durations/easings.
- Replicate the reference `prefers-reduced-motion: reduce` block.

### 11.3 Styling rules

- Tailwind utilities first. Arbitrary values (`rounded-[22px]`, `text-[13px]`) are fine to match the reference exactly.
- A small `@layer components` section in `index.css` is allowed **only** for things that are awkward in utilities: gradient text, ticket dashes, seat states, decorative pseudo-elements (`::before`/`::after` overlays), MapLibre overrides. Keep it short and commented.
- No CSS modules, no per-component CSS files.
- `cn()` merges class lists. Variants are defined as plain objects inside the component (e.g. `const variants = { primary: '...', dark: '...' }`).

### 11.4 RTL

- `index.html`: `<html lang="ar" dir="rtl">`.
- Use logical utilities only:
  - `ms-/me-/ps-/pe-` instead of `ml/mr/pl/pr`
  - `start-/end-` instead of `left/right`
  - `text-start/text-end`
  - `border-s/border-e`
- Exceptions:
  - Map containers are `dir="ltr"` (reference).
  - Phone numbers, emails, booking codes and times use `dir="ltr"` where the reference does.
  - The Google directions button sits on the right edge of the map, as in the reference.
- Direction semantics like the reference: `ArrowLeft` / `ChevronLeft` = forward/next, `ArrowRight` = back.

### 11.5 Icons (`lucide-react`, `strokeWidth={1.85}`)

Map the reference names to components. Verify each name exists in the installed version; if one was renamed, use the current name and note it.

| ref | lucide | ref | lucide | ref | lucide |
|---|---|---|---|---|---|
| search | Search | pin | MapPin | calendar | Calendar |
| clock | Clock | arrow-right | ArrowRight | arrow-left | ArrowLeft |
| chevron-down | ChevronDown | chevron-left | ChevronLeft | chevron-right | ChevronRight |
| swap | ArrowLeftRight | user | User | users | Users |
| ticket | Ticket | bus | Bus | route | Route |
| shield | ShieldCheck | headphones | Headphones | check | Check |
| check-circle | CircleCheck | star | Star | heart | Heart |
| hand | Hand | steering | Gauge | wifi | Wifi |
| snow | Snowflake | plug | Plug | filter | Filter (or Funnel) |
| seat | Armchair | wallet | Wallet | info | Info |
| navigation | Navigation | phone | Phone | mail | Mail |
| lock | Lock | eye | Eye | eye-off | EyeOff |
| card | CreditCard | logout | LogOut | menu | Menu |
| x | X | sun | Sun | moon | Moon |
| sparkle | Sparkles | globe | Globe | help | CircleHelp |
| refresh | RefreshCw | copy | Copy | play | Play |
| pause | Pause | minus | Minus | plus | Plus |

Use the icon sizes from the reference call sites (`icon(name, size)`). Decorative icons get `aria-hidden="true"`.

### 11.6 Images

`SmartImage` (with `useImageFallback`):
- Takes a `photoKey`.
- Tries the URL chain in order, then the local SVG.
- `referrerPolicy="no-referrer"`.
- Caches the first successful URL per key in a module-level `Map` so re-renders don't reload.
- Never shows a broken-image icon.
- Supports `loading`, `fetchPriority`, `decoding`, `alt`.
- The hero uses `fetchPriority="high"`; others are lazy.

Logo: import `assets/logo.svg` (no base64 duplication). Favicon: `public/favicon.svg`.

### 11.7 Formatting (unified Latin digits, B11)

- `formatMoney(n)` → `Number(n).toLocaleString('en-US') + ' ل.س'`
- `formatDate('YYYY-MM-DD')` → `new Intl.DateTimeFormat('ar-SY-u-nu-latn', { weekday:'long', day:'numeric', month:'long', year:'numeric' })`, parsing the date at local noon to avoid timezone shifts
- `formatDuration(min)` → `X س Y د` (reference)
- `todayLocalISO()` / `tomorrowLocalISO()` use **local** date parts, never `toISOString()` (B10)

---

## 12. Map (MapLibre, kept from the reference)

`components/common/RouteMap.jsx` + `hooks/useMapLibre.js`.

Props: `origin`, `destination` (with lat/lng), `mode: 'preview' | 'full'`, `progress` (full mode only), `className`.

Implementation:
- **Dynamic import:** `const maplibregl = (await import('maplibre-gl')).default` inside the hook, plus `import 'maplibre-gl/dist/maplibre-gl.css'` in the component. This keeps MapLibre out of the initial bundle.
- Style: `https://tiles.openfreemap.org/styles/liberty`.
- Center: midpoint. Zoom 6. Then `fitBounds` with padding `38` (preview) / `82` (full), `maxZoom: 8`, `duration: 0`.
- Map options: `attributionControl:false`, `dragRotate:false`, `pitchWithRotate:false`, `touchPitch:false`, `cooperativeGestures:false`, `fadeDuration:0`, `scrollZoom: mode==='full'`.
- Attribution control: compact in preview, `bottom-left`.
- **Preview mode:** disable scrollZoom, dragPan, touchZoomRotate, doubleClickZoom, keyboard.
- **Full mode:** NavigationControl `{ showCompass:false }`, `bottom-right`.
- On load:
  - GeoJSON line between the two cities: `line-color:#0aa99b`, `line-width:4`, `line-opacity:.95`, `line-dasharray:[2,2]`, round cap/join.
  - Markers: origin `#0aa99b`, destination `#153c52`, `scale .85`, popups `الانطلاق: X` / `الوصول: Y`.
  - Full mode adds the moving bus marker (`.sairna-moving-bus` element from the reference CSS) with popup `موقع تجريبي تقريبي`.
- **Fallback** (same as the reference):
  - Triggered by a watchdog after `9500ms` without load, a map `error` before load, `maplibregl.supported()` false, or a failed dynamic import.
  - Render an iframe `https://maps.google.com/maps?q=<midLat>,<midLng>&z=7&output=embed` (class `.map-google-embed`).
  - Plus the link `فتح المسار في Google Maps ↗` → `https://www.google.com/maps/dir/?api=1&origin=<name>, Syria&destination=<name>, Syria&travelmode=driving`.
- If coordinates are missing, skip MapLibre and go straight to the fallback using city names.
- Loading note `يتم تحميل الخريطة التفاعلية...` until ready.
- **Cleanup:** `map.remove()` on unmount; clear the watchdog; guard against setting state after unmount (StrictMode double-mount safe).
- Update the bus marker with `marker.setLngLat` from a ref when `progress` changes. Never re-initialize the map for progress or theme changes.
- If Arabic labels on the basemap render disconnected/reversed, tell the user and propose `maplibregl.setRTLTextPlugin(...)`. Do not add it without approval.

---

## 13. Component inventory and reference selectors

Build these components. For each, read the listed selectors in the reference `<style>` and replicate them.

### `components/ui/`

| Component | Props (main) | Reference selectors |
|---|---|---|
| `Button` | `variant: primary\|dark\|outline\|subtle\|white`, `size: md\|sm`, `as` (`button`\|`Link`), `to`, `fullWidth`, `loading`, `iconStart`, `iconEnd` | `.btn`, `.btn-primary`, `.btn-dark`, `.btn-outline`, `.btn-subtle`, `.btn-white`, `.btn-sm`, `.full` |
| `IconButton` | `label` (aria), `onClick`, children | `.icon-button`, `.small-square` |
| `Eyebrow` | children | `.eyebrow`, `.mini-star` |
| `Tag` | `tone: success\|teal\|muted\|danger` | `.tag`, `.tag-success`, `.teal-tag`, `.tag-demo` |
| `TextField` | `label`, `icon`, `error`, `required`, `dir`, input props | `.form-group`, `.field-control` |
| `PasswordField` | like TextField + toggle | `.show-password` |
| `Checkbox` | `label` | `.terms-check` |
| `RadioList` | `name`, `options[{value,label,count}]`, `value`, `onChange` | `.radio-list` |
| `Modal` | `open`, `onClose`, `labelledBy`, children | `.modal-scrim`, `.modal-close` |
| `ConfirmDialog` | `open`, `title`, `confirmLabel`, `onConfirm`, `onCancel`, `loading` | modal styles |
| `Toast` (rendered by ToastContext) | `message`, `type` | `.toast` |
| `EmptyState` | `icon`, `title`, `text`, `action` | `.empty-state`, `.account-guest` |
| `InfoNote` | `icon`, children, `variant: soft\|notice\|warning` | `.soft-info`, `.soft-notice`, `.review-alert`, `.tracking-warning`, `.auth-demo-note` |
| `Breadcrumb` | `items[{label,to}]` | `.breadcrumb` |
| `PageBanner` | `breadcrumb`, `eyebrow`, `title`, `highlight`, `text`, `art` | `.page-banner`, `.banner-heading`, `.banner-art`, `.page-title` |
| `SectionHeading` | `eyebrow`, `title`, `highlight`, `text`, `align`, `action` | `.section-title-row`, `.section-centered` |
| `Stepper` | `steps`, `current` | `.stepper`, `.step`, `.step-connector` |
| `ProgressBar` | `value` | `.progress-bar` |
| `Skeleton` | `className` | new, subtle pulse using surface-alt |
| `Spinner` | — | new, minimal |
| `SmartImage` | see 11.6 | `.hero-photo`, `.auth-photo` |
| `SkipLink` | — | new |

### `components/layout/`

| Component | Reference selectors |
|---|---|
| `MainLayout` | `.app-root`, `body.no-footer`, `body.auth-route` |
| `AnnouncementBar` | `.announcement`, `.announcement-dot`, `.ann-star` |
| `Header`, `Logo`, `DesktopNav`, `UserMenu`, `ThemeToggle`, `MobileMenu` | `.site-header`, `.header-inner`, `.brand`, `.brand-icon`, `.brand-text`, `.brand-dot`, `.desktop-nav`, `.nav-link`, `.header-actions`, `.theme-switch`, `.user-menu`, `.avatar`, `.user-name`, `.login-link`, `.mobile-toggle`, `.mobile-panel`, `.mobile-link` |
| `Footer`, `PhotoCredits` | `.footer`, `.footer-main`, `.footer-brand`, `.footer-social`, `.footer-col`, `.footer-contact`, `.photo-credit` |
| `ScrollManager` | — |

### `components/common/`

| Component | Props | Reference selectors |
|---|---|---|
| `SearchForm` | `variant: home\|compact`, `initialValues`, `onSubmit` | `.search-form`, `.home-search`, `.compact-search`, `.search-field`, `.field-label`, `.swap-button`, `.search-submit`, `.from-field`, `.to-field`, `.date-field`, `.people-field` |
| `CitySelect` | `name`, `label`, `cities`, `value`, `onChange` | `.search-field select` |
| `CompanyLogo` | `company`, `size: tiny\|normal\|large` | `.company-logo` (+ size classes) |
| `ServicePills` | `features` | `.service-pill` |
| `RouteMap` | see section 12 | `.home-route-map`, `.real-tracking-map`, `.map-loading-note`, `.map-google-embed`, `.map-open-directions`, `.sairna-moving-bus`, `.maplibregl-*` |
| `TicketModal` | `booking`, `open`, `onClose`, `onCancel` | `.ticket-modal`, `.ticket-modal-head`, `.ticket-modal-body`, `.ticket-code`, `.ticket-big-route`, `.ticket-meta` |
| `BookingStatusTag` | `status` | `.tag-*` |
| `QueryState` | `query`, `loading`, `empty`, `children` | wraps loading/error/empty patterns |

### Page sections

| Folder | Components | Reference selectors |
|---|---|---|
| `home/` | `HeroSection`, `HeroVisual`, `HeroSocialProof`, `SearchShell`, `MetricsStrip`, `DestinationsSection`, `DestinationCard`, `ProcessSection`, `ProcessCard`, `TrackingFeature`, `CtaBanner` | `.hero-section`, `.hero-grid`, `.hero-copy`, `.gradient-text`, `.hero-points`, `.hero-social-proof`, `.proof-avatars`, `.proof-stars`, `.hero-visual`, `.hero-image-wrap`, `.hero-photo-caption`, `.floating-stat`, `.stat-top`, `.stat-bottom`, `.floating-circle`, `.hero-orbit`, `.orbit-a`, `.orbit-b`, `.search-shell`, `.search-shell-heading`, `.search-small-dot`, `.steps-tag`, `.metrics-strip`, `.metrics-inner`, `.metrics-divider`, `.destinations`, `.destination-grid`, `.destination-card`, `.destination-0..3`, `.destination-overlay`, `.destination-arrow`, `.text-link`, `.process-section`, `.process-grid`, `.process-card`, `.process-number`, `.process-icon`, `.split-feature`, `.feature-content`, `.feature-check`, `.demo-note`, `.feature-map-preview`, `.map-preview-top`, `.live-indicator`, `.map-preview-footer`, `.preview-line`, `.cta-wrap`, `.cta-banner`, `.cta-decor`, `.d1`, `.d2`, `.section` |
| `results/` | `CompanyPicker`, `CompanyPickCard`, `FiltersPanel`, `ResultsHeader`, `SortSelect`, `TripList`, `TripCard`, `TripCardSkeleton` | `.results-content`, `.company-pick-section`, `.pick-heading`, `.pick-step`, `.pick-next`, `.company-pick-grid`, `.company-pick`, `.company-pick-all`, `.company-pick-rating`, `.results-heading`, `.result-counter`, `.sort-box`, `.results-layout`, `.filters-panel`, `.filters-top`, `.quiet-button`, `.filter-group`, `.filter-info`, `.trip-list`, `.trip-card`, `.trip-card-header`, `.trip-company`, `.rating`, `.trip-type`, `.trip-card-body`, `.trip-timing`, `.timing-point`, `.timing-route`, `.route-line`, `.trip-booking`, `.seats-left`, `.trip-card-footer`, `.trip-distance` |
| `booking/` | `BookingHeader`, `SeatStage`, `SeatMap`, `Seat`, `SeatLegend`, `SeatHintCard`, `PassengerStage`, `PassengerCard`, `ReviewStage`, `PaymentInfo`, `BookingControls`, `BookingSummary` | `.booking-page`, `.booking-head`, `.booking-title-row`, `.quiet-back`, `.booking-layout`, `.booking-main-card`, `.booking-controls`, `.stage-head`, `.seat-stage`, `.seat-map-card`, `.bus-driver`, `.steering-wheel`, `.bus-cabin`, `.seat-row`, `.seat-row-index`, `.seat-aisle`, `.seat-btn`, `.seat-btn.busy`, `.seat-btn.selected`, `.seat-legend`, `.legend-available`, `.legend-selected`, `.legend-busy`, `.seat-stage-aside`, `.seat-hint-card`, `.hint-icon`, `.seat-counter`, `.seat-selection-tags`, `.passengers-list`, `.passenger-card`, `.passenger-heading`, `.passenger-index`, `.input-grid`, `.review-panel`, `.review-passenger`, `.review-avatar`, `.payment-choice`, `.payment-icon`, `.summary-card`, `.summary-title`, `.summary-company`, `.summary-route`, `.summary-arrow`, `.summary-details`, `.summary-total`, `.summary-trust` |
| `success/` | `ConfirmationCard`, `ConfirmationTicket` | `.success-page`, `.success-card`, `.success-icon`, `.confirmation-ticket`, `.ticket-dashes`, `.success-actions` |
| `trips/` | `TripsHeader`, `MyTripCard`, `MyTripCardSkeleton` | `.trips-top`, `.my-trips-list`, `.my-trip-card`, `.mytrip-head`, `.mytrip-head-main`, `.ticket-icon`, `.mytrip-center`, `.mytrip-route`, `.mytrip-route-graphic`, `.mytrip-detail`, `.mytrip-actions` |
| `tracking/` | `TrackingTitle`, `TrackingSidebar`, `TrackingStatus`, `TrackRouteHeading`, `TrackingTimeline`, `TrackingQuickStats`, `TrackingControls`, `TrackingMapPanel` | `.tracking-main`, `.tracking-title`, `.tracking-live`, `.tracking-actions`, `.tracking-layout`, `.tracking-sidebar`, `.tracking-status`, `.status-dot`, `.track-route-heading`, `.track-company`, `.track-divider`, `.track-progress-head`, `.track-timeline`, `.timeline-stop`, `.stop-indicator`, `.track-quick-stats`, `.track-controls`, `.tracking-map-panel`, `.map-toolbar`, `.map-green-dot`, `.map-toggle`, `.google-map-actions`, `.map-bottom-overlay`, `.map-caption` |
| `auth/` | `AuthLayout`, `AuthPanel`, `LoginForm`, `RegisterForm`, `AuthVisual` | `.auth-main`, `.auth-grid`, `.auth-panel`, `.auth-top`, `.auth-form`, `.auth-helper`, `.auth-submit`, `.auth-switch`, `.auth-visual`, `.auth-visual-top`, `.auth-visual-bottom` |
| `account/` | `ProfileCard`, `AccountDetails` | `.account-layout`, `.account-profile`, `.account-avatar`, `.account-stat`, `.account-details`, `.account-item` |
| `companies/` | `CompanyCard` | `.companies-grid`, `.company-card`, `.company-card-head`, `.company-amenities`, `.company-meta`, `.disclaimer-line` |
| `about/` | `AboutContent` | `.about-grid` |
| `support/` | `FaqList`, `FaqItem`, `SupportAside` | `.faq-section`, `.faq-list`, `.faq-item`, `.support-aside` |

---

## 14. Bug-fix checklist (all must be fixed, each verifiable)

| ID | Bug in reference | Required fix |
|---|---|---|
| B1 | Clicking the Homs destination card while origin is Homs produces Homs → Homs | Destination shortcut picks a different origin (10.1) |
| B2 | Destination shortcut bypassed search validation | One shared `validateSearch` (different cities, date ≥ today local, people 1–4) used by form, shortcuts and URL params |
| B3 | Booked seats were hard-coded and identical for every trip | Seats from `GET /trips/{id}/seats` |
| B4 | No check that a trip has enough seats for the passenger count | Disabled button + label on the trip card; clamp `people` on booking |
| B5 | `selectedSeats.sort()` mutated state during render | Sort copies only |
| B6 | Refresh on `#booking` silently picked the first trip; `#success` showed "last booking" | URL-driven trip/booking IDs + not-found states |
| B7 | Passenger inputs were lost when going back a step | Reducer + session draft keeps them |
| B8 | Tracking ETA fixed at `5.4h`, infinite loop, duplicated distance formula, theme toggle reset playback | Section 10.7 + single geo util + ref-based marker updates |
| B9 | Booking ID `SR-` + timestamp could collide | Server IDs |
| B10 | Date `min` used UTC, default date used local time | Local-date utils everywhere |
| B11 | Mixed digits (Latin prices, Arabic-Indic dates) | Unified Latin digits (11.7) |
| B12 | Hard-coded counts (`6`, `+12`, `14`, `4`) | Derived from data, or removed |
| B13 | Bookings shared by everyone on the same browser | `/bookings/me` per user |
| B14 | "تذكرني" did nothing | Section 6.3 |
| B15 | Modal: no focus trap, no focus return, no scroll lock | `Modal` component (also closes on Esc and scrim click) |
| B16 | Mobile menu stayed open on Esc / outside click and had no `aria-expanded` | `MobileMenu` behavior (10.11) |
| B17 | Toast not announced to screen readers | aria-live |
| B18 | Footer social icons looked interactive but weren't links | Decorative + `aria-hidden` |
| B19 | Unescaped values from storage inserted as HTML | React rendering; no `dangerouslySetInnerHTML` |
| B20 | Unknown routes silently showed Home | 404 page |
| B21 | No offline fallback for photos (blank areas) | Local SVG as last fallback (11.6) |
| B22 | Whole page re-rendered on every click (lost focus) | React component updates |
| B23 | Password minimum 6 vs backend 8 | 8 everywhere |
| B24 | Success page showed the most recent booking, not the one just made | `/booking/success/:bookingId` |
| B25 | Theme toggle destroyed and rebuilt maps | Map instance independent of theme |
| B26 | Account bookings count counted all local bookings | Count from API (non-cancelled) |
| B27 | Dead code (`pickCity`, `state.mapLayer`, unused CSS) | Not ported |

In each phase report, list which bug IDs that phase fixed.

---

## 15. Copy changes (only these; everything else verbatim from the reference)

The site now uses a real backend, so statements about "local browser storage" and "fake accounts" are no longer true. Disclaimers about education, no real payment and no real GPS stay.

| Where | New text |
|---|---|
| Metrics strip, `4 شركات نقل تجريبية` | `<count> شركات نقل` (count from API) |
| Metrics strip + hero floating stat, `14` | `cities.length` |
| Auth demo note | `هاد مشروع تدريبي. استعمل كلمة مرور خاصة فيه وما تستعمل كلمة مرور حساباتك الحقيقية.` |
| Review alert | `بتأكيد الحجز، رح تنضاف التذكرة لقائمة «حجوزاتي» بحسابك.` |
| Summary trust line | `لا يوجد دفع إلكتروني ضمن المشروع التعليمي.` |
| Payment section | Single card: title `الدفع في مكتب الشركة`, text `ادفع عند الحضور لمكتب الشركة قبل موعد الرحلة.` |
| Account type | `حساب مسافر` (or mapped role) |
| My Trips subtitle | `كل حجوزاتك المحفوظة بحسابك` |
| Companies disclaimer | `ملاحظة: بيانات الشركات والرحلات جاية من خادم المشروع التدريبي، وهي ليست معلومات تشغيل حقيقية.` |
| About paragraph 2 | `تم تطوير هذه النسخة باستخدام React ومربوطة بواجهة API حقيقية للمشروع التدريبي.` |
| FAQ `وين بلاقي حجوزاتي؟` | `من قائمة «حجوزاتي» بعد تسجيل الدخول. الحجوزات محفوظة بحسابك.` |
| FAQ `هل في حسابات حقيقية؟` | `إي، الحساب بينحفظ على خادم المشروع التدريبي. بس الموقع تعليمي، فما تستعمل بيانات حساسة.` |
| FAQ new item | Question `فيني ألغي حجزي؟`, answer `إي، من «حجوزاتي» أو من التذكرة اضغط «إلغاء الحجز».` |

---

## 16. Accessibility and quality floor

- Every interactive element is reachable and operable by keyboard with a visible focus ring (reference outline).
- Every form field has a `<label>`. Errors are linked with `aria-describedby`, and `aria-invalid` is set.
- Seat buttons: `aria-label="مقعد N"`, `aria-pressed`, `disabled` when booked.
- Icon-only buttons have Arabic `aria-label`s (copy from the reference).
- Respect `prefers-reduced-motion`.
- Images: meaningful Arabic `alt` (reference), decorative ones `alt=""`.
- No console errors or React warnings in normal flows.
- Keep the layout working at 360px width minimum.

---

## 17. Phases (stop after each one)

Every phase ends with the verification steps and the report (section 18).

**Phase 0 — Setup, API discovery, foundations**
1. Scaffold the Vite React (JavaScript) app **into the current root without deleting `CLAUDE.md` or `reference/`**. Install the allowed dependencies. Configure the `@` alias, the Vite proxy, `.env.development`, `.env.example` and `.gitignore` (include `.mcp-state/`, `.env*.local`, `dist`). Initialize git if needed.
2. Copy `reference/assets/*` into `src/assets/`; logo → `public/favicon.svg`.
3. **API discovery** (GET only; no writes without approval):
   - Call health, `/cities`, `/companies`, `/companies/{firstId}`, `/trips` (with and without filters), `/trips/{firstId}`, `/trips/{firstId}/seats`.
   - Save raw JSON to `docs/api/samples/`.
   - Check CORS headers.
   - Then **ask the user** for permission to create a test passenger account (or ask for test credentials) to capture `register` / `login` / `me` / `bookings/me` / an error example (wrong password, validation error). Booking/cancel shapes are captured later, in Phase 5, with approval.
   - Write `docs/api/API_NOTES.md`: every endpoint, actual response shape, field types, pagination (if any), error format, status codes, CORS result, gaps vs. this spec, and proposed mapper decisions.
4. Foundations:
   - `styles/index.css` (tokens, dark mode, breakpoints, base, keyframes)
   - `index.html` (lang/dir, Cairo link, theme pre-script, meta, favicon, title)
   - utils (`cn`, `format`, `date`, `geo`, `text`, `validation`, `storage`)
   - api layer (`client`, `errors`, `authEvents`, `queryClient`, `queryKeys`, `endpoints`)
   - mappers (based on real samples) and services
   - contexts (Theme, Toast, Auth skeleton)
   - router with **placeholder pages** for every route + NotFound
5. Verify: `npm run lint`, `npm run build`, `npm run dev` starts, every route renders its placeholder, a dev-only check in the console shows `useCities()` returning mapped data.

**Phase 1 — Layout & UI kit**
- MainLayout, AnnouncementBar, Header (desktop + mobile + theme toggle + auth-aware actions), Footer, ScrollManager, SkipLink, Toast.
- All `components/ui/*`.
- Add a **dev-only route `/__ui`** (registered only when `import.meta.env.DEV`) that showcases every UI component and variant in light/dark, so the user can review visually.

**Phase 2 — Home** (section 10.1), including `SearchForm`, `SmartImage` and `RouteMap` preview mode.

**Phase 3 — Results** (section 10.2), including CompanyLogo, ServicePills and TripCard.

**Phase 4 — Login & Register** (section 10.3), full AuthContext, ProtectedRoute/GuestOnlyRoute, 401 handling.

**Phase 5 — Booking** (section 10.4).
- Before the first real booking, ask the user for approval.
- After testing, capture the booking response/error shapes into `API_NOTES.md`, and ask before cancelling the test booking.

**Phase 6 — Booking success** (section 10.5).

**Phase 7 — My Trips + TicketModal + Cancel** (section 10.6). Ask before testing cancel on a real booking.

**Phase 8 — Tracking** (section 10.7) with RouteMap full mode.

**Phase 9 — Account** (section 10.8).

**Phase 10 — Companies** (section 10.9).

**Phase 11 — About, Support, NotFound** (section 10.10).

**Phase 12 — Final QA**
- Full user-journey walkthrough, responsive pass (360 / 390 / 768 / 1024 / 1280 / 1440), dark mode pass, keyboard pass.
- Bundle check (`npm run build` output sizes; MapLibre must be in a separate chunk).
- Remove leftovers. Update `README.md` (setup, env, scripts, structure, API notes link, known backend gaps).

Verification checklist for every phase:
1. `npm run lint` → 0 errors.
2. `npm run build` → succeeds, no warnings you can fix.
3. Run the dev server and exercise every interaction of the phase. If you cannot open a browser, say so clearly and give the user a precise manual test checklist.
4. Check the layout at 360, 768 and 1280 widths in both light and dark themes (or provide the checklist).
5. Re-read the phase's spec section and confirm each item is done; list anything not done and why.
6. Commit.

---

## 18. Phase report template (write it in Levantine Arabic, English technical terms)

```
## المرحلة N — <الاسم>

### شو انعمل
(ملخص قصير)

### الملفات
- جديد: ...
- معدّل: ...

### الـ Components
| Component | الدور | Props أساسية |

### الـ Hooks والمنطق
(كل hook: شو بيعمل وليش)

### الـ API calls
(endpoint ← hook ← component)

### Bugs انحلّت
(B-IDs مع جملة لكل واحد)

### نتيجة الفحص
- lint: ...
- build: ...
- dev / تفاعلات: ...
- responsive / dark: ...

### جرّب بنفسك
(checklist خطوات واضحة للمستخدم)

### ملاحظات وقرارات بحاجة لموافقتك
(أي شي ناقص بالـ API، أي انحراف عن المرجع، أسئلة)
```

Then stop and wait for approval.

---

## 19. Never do

- Never start the next phase without explicit approval.
- Never edit `reference/`.
- Never call `/api/v1/dashboard/*` from passenger code, never call the Website API from admin code, and never persist admin credentials anywhere.
- Never create, change or cancel server data without the user's approval.
- Never add dependencies outside section 3 without approval.
- Never invent API fields or business data. Never keep any fake trips/seats/bookings.
- Never use TypeScript, `dangerouslySetInnerHTML`, `localStorage` for bookings, or inline styles (except CSS variables / dynamic widths).
- Never redesign. When the reference and good practice conflict, follow the reference visually and fix behavior quietly; mention it in the report.

---

## 20. Admin dashboard (`/admin`)

An Arabic RTL admin area for seeded ADMIN accounts, inside the same React app, using the **Dashboard API**.
Swagger: `https://sairna.abdulrahman-hares.com/api/docs/dashboard` (JSON: `/api/docs/dashboard-json`).

### 20.1 Isolation from the passenger site (mandatory)

| Concern | Passenger site | Admin |
|---|---|---|
| Code | `src/…` | **everything under `src/admin/`** (api, services, hooks, context, components, pages) |
| Axios client | `api/client.js` → `VITE_API_BASE_URL` | `admin/api/adminClient.js` → `VITE_ADMIN_API_BASE_URL` (`/api/v1/dashboard` in dev via the same Vite proxy) |
| Token key | `sairna-token` | `sairna-admin-token` (sessionStorage; localStorage only with "تذكرني") |
| 401 event | `authEvents` | `adminAuthEvents` (an expired admin token never signs out a passenger, and vice versa) |
| Query keys | `['trips']`, `['bookings']`… | always prefixed: `['admin', …]` |
| Routes | `MainLayout` branch | separate top-level branch `/admin/*`, loaded with React Router `route.lazy`, so no admin code ships in passenger chunks |

Shared and reusable from the passenger code: `components/ui/*`, `utils/*`, `context/ThemeContext`, `context/ToastContext`, the website mappers for trip/company/city/booking (pure functions), design tokens in `styles/index.css`.
Admin must not use `AuthContext`, `api/client.js`, website services or website hooks.

### 20.2 Endpoints (Dashboard base). All JWT except login. No query parameters are documented on any list.

| Method | Path | Body (Swagger DTO) | Page |
|---|---|---|---|
| POST | `/auth/login` | `LoginDto { email, password }` | Login |
| GET | `/auth/me` | — | session, header |
| GET | `/overview` | — | Overview |
| GET | `/cities` | — | Cities, trip form |
| GET | `/companies` | — | Companies, trip form, filters |
| POST | `/companies` | `CompanyDto { name*, logoUrl? }` | Companies |
| PATCH | `/companies/{id}` | `UpdateCompanyDto { name?, logoUrl?, isActive? }` | Companies |
| DELETE | `/companies/{id}` | — | Companies |
| GET | `/trips` | — | Trips |
| POST | `/trips` | `CreateTripDto { companyId*, originId*, destinationId*, departureAt*, arrivalAt*, price*, totalSeats* }` | Trips |
| GET | `/trips/{id}` | — | Trip details |
| PATCH | `/trips/{id}` | `UpdateTripDto` (all optional, + `status: AVAILABLE \| CANCELLED`) | Trips |
| DELETE | `/trips/{id}` | — | Trips |
| GET | `/bookings` | — | Bookings |
| GET | `/bookings/{id}` | — | Booking details |
| POST | `/bookings/{id}/cancel` | — | Bookings |
| GET | `/users` | — | Users |
| GET | `/users/{id}` | — | User details |

Not available, so not built: user create/edit/delete, city CRUD, booking creation, notifications, server-side search/filter/pagination, logout endpoint.
Response bodies are not documented in Swagger. The real shapes were recorded on 2026-11-12 in `docs/api/ADMIN_API_NOTES.md`, with samples in `docs/api/dashboard-samples/`. Mappers still accept a plain array or `{ data | items | results: [] }`, and tolerate missing fields.

**Verified server behaviour that drives the UI:**
- `DELETE /companies/{id}` **archives** the company (`COMPANY_ARCHIVED`, `isActive:false`). It does not erase anything, so the UI says «أرشفة».
- `DELETE /trips/{id}` **cancels** the trip (`status: CANCELLED`, record kept), so the UI says «إلغاء الرحلة».
- `GET /trips` (list) has no seat counts, and `GET /users` has no booking counts: derive both from `GET /bookings`.
- Error codes: `INVALID_COMPANY` (trip for an inactive company), `SAME_CITY`, `INVALID_TIMES`, `*_NOT_FOUND`.
- The server does not validate `logoUrl`, so the form must.

### 20.3 Rules

- **Search, filters, sorting and pagination are client-side** (the API has no params). Keep them in URL search params (`q`, `status`, `company`, `page`…) with `replace: true`.
- **Derived numbers are allowed only from real responses** (e.g. bookings per day computed from `/bookings`). Never hard-code or fabricate statistics. Label derived figures as such when it matters.
- **Overview:** render every numeric value `/overview` returns. Known keys get Arabic labels and icons; unknown numeric keys are still shown with their raw key. Never show a metric the API did not return.
- **Dates:** the admin enters times in **Damascus time** (`Asia/Damascus`); convert to UTC ISO before sending, and convert API UTC back to Damascus for display and for form defaults. Label the inputs `بتوقيت دمشق`.
- **PATCH sends only the fields that changed.**
- **Role:** after login and on session restore, if `/auth/me` returns a `role` that is not `ADMIN`, sign out with a clear message.
- **Destructive actions** (archive company, cancel trip, cancel booking) always need a confirm dialog that says what the server really does (see 20.2). Show the server message if it refuses.
- **Testing writes on the shared server:** create only clearly named test records (`[TEST] …`), change or archive only records created in the same test session, and cancel only test bookings. Remember that nothing can be hard-deleted: every test record stays on the server, so keep tests minimal and list leftovers in `ADMIN_API_NOTES.md`. Ask the user before any write that touches existing data.
- **Admin credentials given by the user in chat** may be used for that session's live testing only, passed through environment variables to scratch scripts. Never write them to the repo, samples, docs or memory.
- Charts: hand-written SVG/CSS only (no chart library). Single-series charts use `--primary`; status uses labelled tags (never color alone); each chart has a hover/focus tooltip and its values are reachable as text.

### 20.4 Design

The dashboard is an extension of the passenger site, not a generic admin template:
Cairo font, the same tokens (surface, border, primary, dark, soft-teal), the real logo, the same Button/Tag/Modal/TextField components, rounded cards (14–20px) with the soft card shadow, and the same dark mode.
Layout: dark sidebar (`--dark-deep`) with teal active state. It collapses to icons on desktop (persisted) and becomes a drawer below 901px (focus trap, Esc, scrim). The sticky header shows the title, breadcrumb, theme toggle and profile menu.
Tables turn into stacked cards below 651px. The layout must work from 360px.
