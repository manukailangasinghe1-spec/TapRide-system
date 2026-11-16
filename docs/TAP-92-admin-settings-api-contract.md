# TAP-92 — Admin Settings & Audit Log API Contract

Sprint 3 REST contract for the System Oversight & Audit page (Admin Portal).
The frontend service layer (`frontend/src/features/admin-settings/services/adminSettingsService.ts`)
already implements this contract behind a single swap point: setting
`VITE_USE_MOCK=false` switches it from the mock to these endpoints with no UI changes.

## Conventions

- Base URL: `VITE_API_BASE_URL` (default `http://localhost:8000`), no trailing slash.
- All paths are prefixed with `/api/v1`.
- Auth: every endpoint requires the admin JWT (`Authorization: Bearer <token>`).
  The **admin identity is resolved from the JWT on the server** — it is never
  sent in a request body.
- Error format (FastAPI default): `{"detail": "human readable message"}` with a
  non-2xx status. `401` means the session expired; the frontend surfaces the
  message and (Sprint 3) redirects to `/login`.
- Timestamps are ISO-8601 **UTC** (e.g. `2026-08-29T08:44:00Z`); the frontend
  formats them in `Asia/Colombo` for display.

## Settings payload

One settings object covers every category. Category keys:

`general`, `operational`, `notifications`, `security`, `userManagement`,
`payment`, `route`.

```json
{
  "general": {
    "systemName": "TapRide",
    "timeZone": "Asia/Colombo",
    "currency": "LKR",
    "language": "en"
  },
  "operational": {
    "realTimeMonitoring": true,
    "automaticSettlement": true,
    "requireRouteApproval": false
  },
  "notifications": {
    "emailAlerts": true,
    "smsAlerts": false,
    "settlementNotifications": true,
    "securityAlerts": true,
    "digestFrequency": "daily"
  },
  "security": {
    "twoFactorRequired": false,
    "sessionTimeoutMinutes": 30,
    "passwordExpiryDays": 90,
    "restrictLoginToAdminNetwork": false
  },
  "userManagement": {
    "defaultNewUserRole": "viewer",
    "requireEmailVerification": true,
    "autoApproveBusOwners": false,
    "allowConcurrentSessions": true
  },
  "payment": {
    "primaryGateway": "payhere",
    "enableCardPayments": true,
    "settlementSchedule": "daily",
    "minimumSettlementAmount": 1000
  },
  "route": {
    "allowRouteCreation": true,
    "routeChangeGraceHours": 24,
    "autoPublishFares": false,
    "defaultFareCurrency": "LKR"
  },
  "last_updated_at": "2026-08-29T08:44:00Z"
}
```

Wire format is snake_case (`last_updated_at`); the frontend maps it internally.
The `payment` object intentionally contains **no secrets** — API keys, gateway
tokens and webhook secrets must be stored and managed server-side only.

### Allowed values (enums)

| Field | Allowed values |
|---|---|
| `general.timeZone` | `Asia/Colombo`, `Asia/Kolkata`, `Asia/Dubai`, `Asia/Singapore`, `Europe/London`, `UTC` |
| `general.currency` | `LKR`, `USD`, `EUR`, `GBP`, `INR` |
| `general.language` | `en`, `si`, `ta` |
| `notifications.digestFrequency` | `daily`, `weekly`, `never` |
| `userManagement.defaultNewUserRole` | `viewer`, `operator`, `admin` |
| `payment.primaryGateway` | `payhere`, `stripe`, `payoneer` |
| `payment.settlementSchedule` | `daily`, `weekly`, `monthly` |
| `route.defaultFareCurrency` | same as `general.currency` |

The canonical frontend lists live in
`frontend/src/features/admin-settings/data/options.ts` — keep them in sync.

## Endpoints

### `GET /api/v1/admin/settings`

Returns the full settings object (shape above). `200 OK`.

### `PUT /api/v1/admin/settings`

Body: the full settings object (client sends back everything it loaded, with
its edits applied). `200 OK` returns the persisted object with a fresh
`last_updated_at`.

Validation rules (mirror of the client rules; server is authoritative):

- `general.systemName`: required after trimming, max 60 characters.
- `general.timeZone`, `general.currency`, `general.language`: must be one of
  the allowed values above.
- Numeric fields (`sessionTimeoutMinutes`, `passwordExpiryDays`,
  `minimumSettlementAmount`, `routeChangeGraceHours`): positive integers.
- All other fields: booleans or enum strings as listed.

On validation failure: `422 Unprocessable Entity` with
`{"detail": "<first offending field message>"}`.

**The server must write the audit entry itself** after a successful save:
diff the stored settings against the request (or accept the client's change
list only as a hint — the server-side diff is authoritative), resolve the
acting admin from the JWT, and append an `AuditLogEntry` (see below) with
action `settings.updated` and the changed fields as `old -> new`. The client
never sends audit data.

### `GET /api/v1/admin/audit-logs?page=1&page_size=50`

Returns a paginated audit log, newest first.

```json
{
  "entries": [
    {
      "id": "audit-0003",
      "timestamp": "2026-08-29T08:44:00Z",
      "user": "System Admin",
      "action": "settings.updated",
      "category": "general",
      "details": "System name: TapRide Lanka -> TapRide",
      "changes": [
        { "field": "System name", "from": "TapRide Lanka", "to": "TapRide" }
      ]
    }
  ],
  "total": 3,
  "page": 1,
  "page_size": 50
}
```

- `category` is one of `general`, `notifications`, `security`,
  `user-management`, `payment`, `route`.
- Optional future filters: `?category=general`, `?action=settings.updated`.
- `401` on missing/expired JWT; `403` for non-admin tokens.
