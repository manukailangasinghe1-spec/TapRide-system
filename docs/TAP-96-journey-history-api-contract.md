# TAP-96 Journey History API Contract

Passenger wallet summary, transaction history and journey history for the
History screen (`/journey-history`).

## Conventions

- **Base URL:** `VITE_API_BASE_URL` (for example `http://localhost:8000`), then `/api/v1`.
- **Auth:** every request carries the passenger JWT as
  `Authorization: Bearer <token>`. The backend resolves the passenger from the
  JWT claims — the passenger id is never sent in the path or query string.
- **Money:** integer LKR (no decimal minor units). The client only formats for display.
- **Timestamps:** ISO-8601 with timezone, e.g. `2026-08-29T11:18:00+05:30`.
  The client converts them for display.
- **Ordering:** newest first (`occurred_at` / `updated_at` descending).
- **Errors:** FastAPI format `{"detail": "..."}` with the matching HTTP status.
  - `401` — missing/expired session. The client shows a "session expired" message.
  - `403` — the account may not read this passenger's data.
  - `422` — invalid query parameters.
  - `5xx` — unexpected server failure. The client shows the error state with retry.

## Endpoints

### 1. GET /api/v1/passenger/wallet/summary

Wallet ledger totals for the authenticated passenger. The client displays these
values as-is and never derives the balance from transaction rows.

Response `200`:

```json
{
  "current_balance": 2398,
  "total_top_ups": 5000,
  "total_journey_fares": 2602,
  "updated_at": "2026-08-29T11:18:00+05:30"
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `current_balance` | integer | Spendable balance including all ledger effects. |
| `total_top_ups` | integer | Lifetime top-ups credited to the wallet. |
| `total_journey_fares` | integer | Lifetime journey fares debited. |
| `updated_at` | string (ISO-8601) | When the ledger totals were last recalculated. |

### 2. GET /api/v1/passenger/transactions?page=1&page_size=5

Paginated wallet transactions, newest first. Includes top-ups, journey fares,
released holds, refunds and pending offline transactions.

Response `200`:

```json
{
  "items": [
    {
      "id": "txn_01J9Z3K4",
      "kind": "journey-fare",
      "title": "Journey Fare",
      "subtitle": "Route 138 · Colombo Fort → Kaduwela",
      "occurred_at": "2026-08-29T11:18:00+05:30",
      "amount": 52,
      "direction": "debit",
      "status": "COMPLETED",
      "has_receipt": true
    },
    {
      "id": "txn_01J9Z3K5",
      "kind": "offline",
      "title": "Offline Transaction",
      "subtitle": "Stored locally · Waiting for sync",
      "occurred_at": "2026-08-28T20:35:00+05:30",
      "amount": null,
      "direction": "debit",
      "status": "PENDING SYNC"
    }
  ],
  "page": 1,
  "page_size": 5,
  "has_more": true,
  "next_page": 2
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `kind` | enum | `top-up`, `journey-fare`, `hold-released`, `offline`, `refund` |
| `direction` | enum | `credit`, `debit` |
| `status` | enum | `COMPLETED`, `PENDING SYNC`, `REFUNDED` |
| `amount` | integer or null | Integer LKR. `null` for pending offline items until synced. |
| `has_receipt` | boolean | Whether a digital receipt exists for this transaction. |

### 3. GET /api/v1/passenger/journeys?page=1&page_size=5

Paginated completed/pending journeys, newest first.

Response `200`:

```json
{
  "items": [
    {
      "id": "journey_01J9Z3K6",
      "route_number": "Route 138",
      "from": "Colombo Fort",
      "to": "Kaduwela",
      "occurred_at": "2026-08-29T11:18:00+05:30",
      "fare": 52,
      "status": "COMPLETED",
      "has_receipt": true
    }
  ],
  "page": 1,
  "page_size": 5,
  "has_more": false,
  "next_page": null
}
```

`status` uses the same enum as transactions. `has_receipt` marks journeys that
will get digital receipts once that endpoint exists.

## Pagination

- `page` starts at 1. `page_size` defaults to 5.
- The client loads the first page on mount and appends subsequent pages.
- `has_more` and `next_page` are authoritative; `next_page` is `null` when there
  is nothing more. The client hides "Load More" when `has_more` is false.
- Page size is fixed at 5 on the client for both tabs.

## Sprint 3 integration checklist

- [ ] The displayed balance comes from the backend wallet ledger summary, not from
      summing the transaction categories shown on the screen.
- [ ] Refunds, released holds and ledger adjustments are applied by the backend
      before the summary and transaction list are returned.
- [ ] Pending offline transactions are returned with `status: "PENDING SYNC"` and
      a `null` amount; they are excluded from `current_balance` until synced, and
      the screen must reflect the post-sync values on refresh.
- [ ] Digital receipts need a receipt endpoint. Until then the "View digital
      receipt" controls stay disabled. Connect them once the endpoint ships.
- [ ] The header options/filter button stays disabled until the filtering
      requirements and endpoint exist.
- [ ] Authenticated access is enforced by the backend (valid JWT, passenger owns
      the data). The client sends the bearer token only.
- [ ] Wire `getWalletSummary`, `getTransactions` and `getJourneys` in
      `frontend/src/features/journey-history/services/journeyHistoryService.ts`
      to these endpoints (single swap point; no other file changes needed).

## Tests to add

- Empty transaction and journey histories (empty states, not blank screens).
- Large histories and pagination: multiple pages, `has_more` transitions,
  duplicate-free appends, last page hides "Load More".
- All transaction statuses (`COMPLETED`, `PENDING SYNC`, `REFUNDED`).
- Refunds and released holds are reflected in the balance and the list.
- Failed API requests: initial load error with retry, load-more failure with
  retry, slow responses showing loading skeletons.
- Receipt availability: disabled controls today, connected once the receipt
  endpoint exists.

## Frontend demo modes (mock branch only)

In demo mode (`VITE_USE_MOCK=true`, or unset during `npm run dev`) the screen
supports query parameters for manual checks: `?mock=slow`, `?mock=error`,
`?mock=empty`, `?mock=loadmorefail`. A production build without
`VITE_USE_MOCK=true` always calls these real endpoints.
