# TAP-84 — Owner Dashboard API Contract (Sprint 3)

Contract for the three backend endpoints the owner dashboard will call once the
mock layer is switched off (`VITE_USE_MOCK=false`). The frontend already
implements this contract in
`frontend/src/features/owner-dashboard/services/dashboardService.ts`; the backend
team can build against it without reading any React code.

## General rules

| Rule | Detail |
| --- | --- |
| Base URL | `VITE_API_BASE_URL` (default `http://localhost:8000`); every path below includes `/api/v1`. |
| Auth | `Authorization: Bearer <JWT>` on every request. The **owner is resolved from the JWT** — no owner/operator id appears in paths or query params. |
| Query params | None defined for Sprint 3. The frontend's `?mock=error/empty/slow` params are demo-only and must never be sent to the backend. |
| Timestamps | ISO-8601 UTC with `Z` suffix, e.g. `"2026-11-12T14:02:00Z"`. |
| Money | **Integer** LKR amounts (whole rupees, no decimals/cents), e.g. `48650`. |
| Content type | `application/json` responses. |
| Errors | Any non-2xx response: `{"detail": "<human readable message>"}` (FastAPI default). |

### 401 handling

- Backend: return `401` with `{"detail": "..."}` when the JWT is missing, expired
  or invalid.
- Frontend today: `dashboardService.ts` surfaces the error as
  `Session expired (401): <detail>` and the dashboard shows its error state.
- **TODO(Sprint 3):** once real JWT auth exists, a 401 should redirect to
  `/login`. The hook point is marked with a comment in `dashboardService.ts`.

### Owner identity

`operator` is never passed as a parameter. The backend reads the owner from the
JWT and fills the block below. This is also the payload used for the top bar.

```ts
interface OperatorProfile {
  name: string;     // "Ruwan Perera"
  initials: string; // "RP" — 1–2 characters for the avatar
  role: string;     // "Bus Owner · TapRide"
}
```

## 1. `GET /api/v1/owner/dashboard/summary`

Operator identity, online status and the four "Today's Overview" stat cards.

```ts
interface DashboardSummary {
  operator: OperatorProfile;
  operationsOnline: boolean;
  stats: OverviewStats;
  /** ISO-8601 UTC */
  generatedAt: string;
}

interface OverviewStats {
  totalBuses: number;     // Jira TAP-84: "Total Buses"
  activeBuses: number;    // Jira TAP-84: "Active Buses"
  totalJourneys: number;  // Jira TAP-84: "Total Journeys"
  crewMembers: number;    // Jira TAP-84: "Crew Members" (revenue belongs to /revenue only)
}
```

Example response:

```json
{
  "operator": { "name": "Ruwan Perera", "initials": "RP", "role": "Bus Owner · TapRide" },
  "operationsOnline": true,
  "stats": { "totalBuses": 6, "activeBuses": 4, "totalJourneys": 186, "crewMembers": 12 },
  "generatedAt": "2026-11-12T14:02:00Z"
}
```

## 2. `GET /api/v1/owner/dashboard/revenue`

Today's fare revenue card, including the bar chart series.

```ts
interface RevenueSummary {
  todayTotal: number;       // integer LKR, e.g. 48650
  comparisonPct: number;    // percent change vs yesterday, e.g. 8.4 (may be negative)
  bars: RevenueBar[];
}

interface RevenueBar {
  label: string;            // short axis label, e.g. "7a" for 7 AM
  amount: number;           // integer LKR for that time slot
  highlight?: boolean;      // true marks the current time slot (rendered in white)
}
```

Example response:

```json
{
  "todayTotal": 48650,
  "comparisonPct": 8.4,
  "bars": [
    { "label": "5a", "amount": 1800 },
    { "label": "6a", "amount": 2400 },
    { "label": "5p", "amount": 6100, "highlight": true }
  ]
}
```

Notes:

- Return the full series the chart should draw (the mock uses 16 hourly slots,
  5 AM–8 PM); the frontend scales bar heights to the tallest bar.
- `comparisonPct` is a signed percentage number, not a string.

## 3. `GET /api/v1/owner/dashboard/active-buses`

The "Active Buses" list on the right of the dashboard.

```ts
interface ActiveBusesResponse {
  buses: Bus[];
}

type BusStatus = 'on-time' | 'in-transit' | 'delayed' | 'idle' | 'maintenance';

interface Bus {
  id: string;                 // stable identifier, e.g. bus id from the database
  plate: string;              // display plate, e.g. "NB-4521"
  route: string;              // human readable, e.g. "Route 27 · Nugegoda → Pettah"
  passengersToday: number | null; // null when not carrying passengers (idle/maintenance)
  status: BusStatus;          // drives the pill label and colour
  revenueToday: number | null;    // integer LKR, null when no fares collected
}
```

Example response:

```json
{
  "buses": [
    { "id": "b1", "plate": "NB-4521", "route": "Route 27 · Nugegoda → Pettah", "passengersToday": 186, "status": "on-time", "revenueToday": 3750 },
    { "id": "b6", "plate": "NB-5544", "route": "Scheduled maintenance", "passengersToday": null, "status": "maintenance", "revenueToday": null }
  ]
}
```

Notes:

- `status` must be one of the five enum strings above so the frontend can map it
  to a label/colour without falling back.
- Use `null` (not `0`) for "no value" so the UI can render an em dash (—).

## Frontend mapping

`fetchRealDashboard()` in `dashboardService.ts` calls the three endpoints in
parallel with `Promise.all` and merges them into the single `DashboardData`
view model used by the hook and components:

```ts
{
  operator: summary.operator,
  operationsOnline: summary.operationsOnline,
  stats: summary.stats,
  revenue,                 // response of /revenue
  buses: activeBuses.buses, // response of /active-buses
  generatedAt: summary.generatedAt,
}
```

If any of the three requests fails, the whole refresh fails and the dashboard
shows its error state (or keeps the last good data with a warning banner).
