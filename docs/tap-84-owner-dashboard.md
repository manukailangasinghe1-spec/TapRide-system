# TAP-84 — Bus Owner Dashboard (frontend)

## What was built
- `frontend/src/pages/OwnerDashboard.tsx` — owner dashboard at `/owner/dashboard`, matching the TAP-84 Figma design (header, operations banner, 4 overview stat cards, revenue card with CSS-only bar chart, active buses list, quick actions).
- `frontend/src/pages/OwnerModulePlaceholder.tsx` — shared Sprint 3 placeholder for Fleet, Crew, Reports, Maintenance, Schedules, Alerts (`/owner/<module>`).
- `/operator` redirects to `/owner/dashboard` (route only; `AuthPortal.tsx` untouched).

## Architecture
```
features/owner-dashboard/
  types.ts                 # all data interfaces (no `any`)
  data/mockDashboard.ts    # mock snapshot + ?mock=error | ?mock=empty | ?mock=slow
  services/dashboardService.ts  # SINGLE SWAP POINT between mock and real API
  hooks/useDashboardData.ts     # loading state, 60s auto-refresh (paused when tab hidden), manual refresh
  components/              # StatCard, RevenueCard, ActiveBusesSection, QuickActions, DashboardStates
```
UI components only receive typed props; all fetching/formatting decisions live in the hook/service.

## Mock vs real API
- `frontend/.env.example` documents `VITE_USE_MOCK` and `VITE_API_BASE_URL`. Copy to `.env` to change (`.env` is git-ignored).
- Only the exact string `VITE_USE_MOCK=false` switches to the real API (Vite env vars are strings). Default/unset = mock.
- `TODO(Sprint 3)` comments mark the swap point in `dashboardService.ts`.
- Backend contract (three endpoints under `/api/v1/owner/dashboard/`): see
  [TAP-84-owner-dashboard-api-contract.md](TAP-84-owner-dashboard-api-contract.md).

## Demo states
- Loading skeleton: open `?mock=slow` (3s delay).
- Error state: `?mock=error`; the refresh button and auto-refresh keep working, cached data survives a failed refresh.
- Empty state: `?mock=empty` (per-section empty messages).

## Accessibility
Semantic landmarks/headings, `aria-live` refresh announcements, `role="img"` + screen-reader summary for the bar chart, visible focus states (existing global `:focus-visible` rule).
