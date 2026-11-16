# سيرنا — Sairna (React)

An Arabic RTL website for booking bus seats between Syrian governorates.
It is a React rebuild of the original vanilla HTML/CSS/JS prototype in [`reference/`](reference/),
now connected to the real **Sairna Website API**.

> Educational project. No real payment and no real GPS. The bus position on the map is a simulation.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server. `/api/*` is proxied to the backend, so CORS never blocks local work |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves `dist/` locally |
| `npm run lint` | oxlint (0 errors expected) |

## Environment

| Variable | Dev (`.env.development`) | Prod (`.env.production`) |
|---|---|---|
| `VITE_API_BASE_URL` | `/api/v1/website` (through the proxy) | `https://sairna.abdulrahman-hares.com/api/v1/website` |
| `VITE_ADMIN_API_BASE_URL` | `/api/v1/dashboard` | `https://sairna.abdulrahman-hares.com/api/v1/dashboard` |
| `VITE_API_PROXY_TARGET` | defaults to `https://sairna.abdulrahman-hares.com` | — |

See [`.env.example`](.env.example). The backend currently answers with `Access-Control-Allow-Origin: *`,
so the production build can call it directly. There are no secrets in this frontend.

## Stack

React 19 · React Router 7 (data router) · TanStack Query 5 · axios · Tailwind CSS 4 · lucide-react · MapLibre GL 6 · Vite 8.
JavaScript + JSX only.

## How data flows

```
Page → section components → hooks (React Query) → services → axios client → Website API
                                   ↑
                         mappers (raw API → internal models)
```

- **Components never call axios.** They use hooks from `src/hooks`.
- **Mappers** (`src/api/mappers`) are the only code that knows raw API field names.
- Server state lives in React Query; search criteria and filters live in the **URL**;
  the booking wizard lives in a reducer + `sessionStorage` draft.

## Folder structure

```
src/
├── admin/          admin dashboard (own api/, services/, hooks/, context/, components/, pages/)
├── api/            client, endpoints, errors, query keys, mappers
├── services/       one file per API area (plain async functions)
├── hooks/          queries/, mutations/, and UI logic hooks (booking flow, tracking, map…)
├── context/        Auth, Theme, Toast providers
├── router/         routes + ProtectedRoute / GuestOnlyRoute / error page
├── components/
│   ├── ui/         generic kit (Button, Modal, TextField, …)
│   ├── layout/     header, footer, mobile menu
│   ├── common/     Sairna-specific shared pieces (SearchForm, RouteMap, TicketModal, …)
│   └── home/ results/ booking/ success/ trips/ tracking/ auth/ account/ companies/ about/ support/
├── pages/          one thin file per route
├── data/           static UI content (cities geo, photos, palette, FAQ)
├── utils/          formatting, dates, geo, validation, storage
└── styles/         index.css (tokens, dark mode, breakpoints, small component layer)
```

## Routes

| Path | Access |
|---|---|
| `/` | public |
| `/results?originId&destinationId&date&people&company&time&sort` | public |
| `/booking/:tripId?people=N` | public until "تأكيد الحجز" (then login) |
| `/booking/success/:bookingId`, `/trips`, `/tracking[/:bookingId]`, `/account` | signed-in |
| `/login`, `/register` | guests only |
| `/companies`, `/about`, `/support` | public |
| `*` | 404 page |
| `/__ui` | dev only — UI kit showcase |

## Admin dashboard (`/admin`)

A separate Arabic RTL admin area for seeded ADMIN accounts. It runs in the same app and uses the **Dashboard API**.

- **Isolated:** all admin code lives in `src/admin/`. It has its own axios client (`VITE_ADMIN_API_BASE_URL`),
  its own token (`sairna-admin-token`), its own 401 handling and `['admin', …]` query keys.
  It is loaded with `route.lazy`, so passengers never download it.
- **Pages:** overview (server totals + charts computed from real bookings), companies (create / edit / archive / activate),
  trips (create / edit / cancel + details with a seat occupancy map), bookings (details + cancel),
  users (read-only + their bookings) and cities (read-only).
- **Lists:** search, filters, sorting and pagination run in the browser (the API has no query parameters) and are kept in the URL.
- **Times:** admins type Damascus time. It is converted to UTC ISO before sending.

| Path | Access |
|---|---|
| `/admin/login` | signed-out admins |
| `/admin`, `/admin/companies`, `/admin/trips[/:id]`, `/admin/bookings[/:id]`, `/admin/users[/:id]`, `/admin/cities` | ADMIN token |

Real Dashboard API behaviour (archive instead of delete, error codes, missing counts) is documented in
[`docs/api/ADMIN_API_NOTES.md`](docs/api/ADMIN_API_NOTES.md).
A detailed Arabic study guide for the dashboard is in [`docs/ADMIN_GUIDE.html`](docs/ADMIN_GUIDE.html)
(open it in a browser; it sits next to the site guide [`docs/SAIRNA_GUIDE.html`](docs/SAIRNA_GUIDE.html)).

How the frontend talks to the backend (env, proxy, axios client, endpoint → service → hook → component map,
mappers, React Query, JWT session, errors) is explained for frontend developers in
[`docs/BACKEND_GUIDE.html`](docs/BACKEND_GUIDE.html).

## API notes

Everything learned about the backend (real response shapes, error codes, gaps) is in
[`docs/api/API_NOTES.md`](docs/api/API_NOTES.md), with raw samples in `docs/api/samples/`.

### Known backend gaps

- Companies have no rating, description or services → those UI parts are hidden; a "شركة تجريبية" tag is shown.
- Trips have no distance → the UI shows an approximate road distance (`~`) from city coordinates.
- No seat layout → the default 2 + aisle + 2 layout is used.
- After cancelling, a booking's `seats` list is empty → seats show `—` for cancelled bookings.
- The `date` filter uses the UTC day of `departureAt`; times are displayed in `Asia/Damascus`.
- No logout, refresh-token, password-reset, payment or GPS endpoints.

## Fixed bugs from the reference

B1–B27 from `CLAUDE.md` section 14 are addressed. Highlights: real seats per trip, URL-driven booking/success pages,
passenger data kept between steps, tracking that stops at arrival with a real ETA, accessible modal and mobile menu,
local-date handling, unified Latin digits, a 404 page and per-user bookings from the API.
