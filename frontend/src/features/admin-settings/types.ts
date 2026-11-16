// Data shapes shared by the mock layer, the service and every UI component.
// The real FastAPI endpoints (Sprint 3) only need to return JSON matching these.

export type SettingsCategory =
  | 'general'
  | 'notifications'
  | 'security'
  | 'user-management'
  | 'payment'
  | 'route'
  | 'system-logs';

// The panel the "Save Changes" button belongs to.
export type SaveableCategory = Exclude<SettingsCategory, 'system-logs'>;

export interface GeneralSettings {
  systemName: string; // required, trimmed, max 60 chars
  timeZone: string; // must be one of TIME_ZONES (options.ts)
  currency: string; // must be one of CURRENCIES
  language: string; // must be one of LANGUAGES
}

export interface OperationalPreferences {
  realTimeMonitoring: boolean; // design: ON
  automaticSettlement: boolean; // design: ON
  requireRouteApproval: boolean; // design: OFF
}

// --- The six category panels below are inferred, not in the Figma ---
// (only General Settings has a desktop design). Fields are deliberately
// simple toggles/selects/inputs using the same components as General.

export interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  settlementNotifications: boolean;
  securityAlerts: boolean;
  digestFrequency: string; // select, must be one of DIGEST_FREQUENCIES
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeoutMinutes: number;
  passwordExpiryDays: number;
  restrictLoginToAdminNetwork: boolean;
}

export interface UserManagementSettings {
  defaultNewUserRole: string; // select, must be one of DEFAULT_ROLES
  requireEmailVerification: boolean;
  autoApproveBusOwners: boolean;
  allowConcurrentSessions: boolean;
}

export interface PaymentSettings {
  // No secrets here on purpose: API keys/tokens are handled server-side only.
  primaryGateway: string; // select, must be one of GATEWAYS
  enableCardPayments: boolean;
  settlementSchedule: string; // select, must be one of SETTLEMENT_SCHEDULES
  minimumSettlementAmount: number; // LKR, no cents
}

export interface RouteSettings {
  allowRouteCreation: boolean;
  routeChangeGraceHours: number;
  autoPublishFares: boolean;
  defaultFareCurrency: string; // select, must be one of CURRENCIES
}

export interface SystemSettings {
  general: GeneralSettings;
  operational: OperationalPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
  userManagement: UserManagementSettings;
  payment: PaymentSettings;
  route: RouteSettings;
  /** ISO-8601 timestamp, e.g. "2026-08-29T14:14:00+05:30". Shown as "August 29, 2026 - 02:14 PM" in Asia/Colombo time. */
  lastUpdatedAt: string;
}

export interface AuditChange {
  field: string;
  from: string;
  to: string;
}

export interface AuditLogEntry {
  id: string;
  /** ISO-8601 timestamp. */
  timestamp: string;
  user: string; // Sprint 3: resolved from the JWT, never sent by the client
  action: string; // e.g. "settings.updated"
  category: SaveableCategory;
  /** Human-readable summary, e.g. "System name: TapRide -> TapRide SL". */
  details: string;
  changes: AuditChange[];
}

/** Field-level validation errors for the General panel form. */
export interface SettingsFormErrors {
  systemName?: string;
  timeZone?: string;
  currency?: string;
  language?: string;
}

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AuditLogPage {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}
