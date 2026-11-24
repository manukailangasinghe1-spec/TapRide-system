import type {
  AuditLogEntry,
  AuditLogPage,
  SaveableCategory,
  SystemSettings,
} from '../types';

// Static snapshot mirroring the TAP-92 Figma design (General Settings panel).
// The UI never knows it is not talking to a real server, so Sprint 3 can swap
// to FastAPI untouched. Inferred panels use small sensible defaults.
const MOCK_SETTINGS: SystemSettings = {
  general: {
    systemName: 'TapRide',
    timeZone: 'Asia/Colombo',
    currency: 'LKR',
    language: 'en',
  },
  operational: {
    realTimeMonitoring: true, // design: ON
    automaticSettlement: true, // design: ON
    requireRouteApproval: false, // design: OFF
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    settlementNotifications: true,
    securityAlerts: true,
    digestFrequency: 'daily',
  },
  security: {
    twoFactorRequired: false,
    sessionTimeoutMinutes: 30,
    passwordExpiryDays: 90,
    restrictLoginToAdminNetwork: false,
  },
  userManagement: {
    defaultNewUserRole: 'viewer',
    requireEmailVerification: true,
    autoApproveBusOwners: false,
    allowConcurrentSessions: true,
  },
  payment: {
    primaryGateway: 'payhere',
    enableCardPayments: true,
    settlementSchedule: 'daily',
    minimumSettlementAmount: 1000,
  },
  route: {
    allowRouteCreation: true,
    routeChangeGraceHours: 24,
    autoPublishFares: false,
    defaultFareCurrency: 'LKR',
  },
  // Matches the design: "August 29, 2026 - 02:14 PM" in Asia/Colombo time.
  lastUpdatedAt: '2026-08-29T14:14:00+05:30',
};

// Seed audit log (inferred rows; timestamps in +05:30 like the design date).
const SEED_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-0003',
    timestamp: '2026-08-29T14:14:00+05:30',
    user: 'System Admin',
    action: 'settings.updated',
    category: 'general',
    details: 'System name: TapRide Lanka -> TapRide',
    changes: [{ field: 'System name', from: 'TapRide Lanka', to: 'TapRide' }],
  },
  {
    id: 'audit-0002',
    timestamp: '2026-08-27T10:03:00+05:30',
    user: 'System Admin',
    action: 'settings.updated',
    category: 'payment',
    details: 'Settlement schedule: weekly -> daily',
    changes: [{ field: 'Settlement schedule', from: 'weekly', to: 'daily' }],
  },
  {
    id: 'audit-0001',
    timestamp: '2026-08-25T09:41:00+05:30',
    user: 'System Admin',
    action: 'settings.updated',
    category: 'security',
    details: 'Require 2FA: on -> off',
    changes: [{ field: 'Require 2FA', from: 'on', to: 'off' }],
  },
];

// Module-level so a successful save stays visible when the user opens System
// Logs. Sprint 3 replaces this with the real GET /api/v1/admin/audit-logs.
let auditLog: AuditLogEntry[] = [...SEED_AUDIT_LOG];
let auditId = 100;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Demo switches enabled with ?mock=slow / error / savefail / empty so we can
// show every state without changing code.
function getMockMode(): string | null {
  return new URLSearchParams(window.location.search).get('mock');
}

export async function fetchMockSettings(): Promise<SystemSettings> {
  const mode = getMockMode();
  if (mode === 'error') {
    await delay(600);
    throw new Error('Simulated server error (?mock=error)');
  }
  // ?mock=slow stretches the delay so the skeleton placeholders are visible.
  await delay(mode === 'slow' ? 3000 : 600);
  // structuredClone deep-copies so callers can never mutate the original mock.
  return structuredClone(MOCK_SETTINGS);
}

/** Mock save: stamps lastUpdatedAt and appends an audit entry (in-memory). */
export async function saveMockSettings(
  settings: SystemSettings,
  category: SaveableCategory,
  changes: Array<{ field: string; from: string; to: string }>,
): Promise<SystemSettings> {
  await delay(700);
  if (getMockMode() === 'savefail') {
    throw new Error('Simulated save failure (?mock=savefail)');
  }
  const saved: SystemSettings = {
    ...structuredClone(settings),
    lastUpdatedAt: new Date().toISOString(),
  };
  auditId += 1;
  auditLog = [
    {
      id: `audit-${String(auditId).padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      user: 'System Admin', // Sprint 3: resolved from the JWT server-side.
      action: 'settings.updated',
      category,
      details: changes.map((c) => `${c.field}: ${c.from} -> ${c.to}`).join('; '),
      changes,
    },
    ...auditLog,
  ];
  return saved;
}

export async function fetchMockAuditLogs(): Promise<AuditLogPage> {
  const mode = getMockMode();
  if (mode === 'error') {
    await delay(600);
    throw new Error('Simulated server error (?mock=error)');
  }
  await delay(mode === 'slow' ? 3000 : 600);
  // ?mock=empty means the audit log has no entries yet.
  const entries = mode === 'empty' ? [] : structuredClone(auditLog);
  return { entries, total: entries.length, page: 1, pageSize: 50 };
}
