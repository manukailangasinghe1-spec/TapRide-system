import {
  CURRENCIES,
  DEFAULT_ROLES,
  DIGEST_FREQUENCIES,
  GATEWAYS,
  LANGUAGES,
  SETTLEMENT_SCHEDULES,
  TIME_ZONES,
} from '../data/options';
import type {
  GeneralSettings,
  NotificationSettings,
  OperationalPreferences,
  PaymentSettings,
  RouteSettings,
  SaveableCategory,
  SecuritySettings,
  SettingsFormErrors,
  UserManagementSettings,
} from '../types';
import { NumberField, PanelSection, SelectField, TextField, ToggleSwitch } from './fields';

// "August 29, 2026 - 02:14 PM" style, always in Asia/Colombo time so the
// design's date renders identically whatever the browser's time zone is.
function formatInColombo(isoTimestamp: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date(isoTimestamp));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('month')} ${part('day')}, ${part('year')} - ${part('hour')}:${part('minute')} ${part('dayPeriod')}`;
}

interface PanelShellProps {
  title: string;
  subtitle: string;
  category: SaveableCategory;
  dirty: boolean;
  saving: boolean;
  onSave: (category: SaveableCategory) => void;
  children: React.ReactNode;
}

/** White settings card with the panel header and the always-enabled Save bar. */
function PanelShell({ title, subtitle, category, dirty, saving, onSave, children }: PanelShellProps) {
  return (
    <div className="rounded-xl border border-[#e4eaf3] bg-white">
      <div className="border-b border-[#edf1f7] px-5 pt-5 pb-4 sm:px-6">
        <h2 className="font-['Manrope',sans-serif] text-[15px] font-extrabold text-[#14213d]">{title}</h2>
        <p className="mt-0.5 text-[11px] text-[#8a96a9]">{subtitle}</p>
      </div>
      <div className="px-5 sm:px-6">{children}</div>
      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-[#edf1f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p aria-live="polite" className="flex items-center gap-2 text-[11px] font-semibold text-[#8a96a9]">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full transition ${dirty ? 'bg-[#f0a431]' : 'bg-[#d3dce9]'}`}
          />
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </p>
        <button
          type="button"
          onClick={() => onSave(category)}
          disabled={saving}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#2156e8] px-6 text-[12px] font-bold text-white shadow-[0_5px_14px_#2156e82b] transition hover:bg-[#1644ca] disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// General Settings — the only panel with a Figma design; matches it closely.
// ---------------------------------------------------------------------------

interface GeneralPanelProps {
  general: GeneralSettings;
  operational: OperationalPreferences;
  lastUpdatedAt: string;
  errors: SettingsFormErrors;
  dirty: boolean;
  saving: boolean;
  onUpdateGeneral: (patch: Partial<GeneralSettings>) => void;
  onUpdateOperational: (patch: Partial<OperationalPreferences>) => void;
  onSave: (category: SaveableCategory) => void;
}

export function GeneralSettingsPanel({
  general,
  operational,
  lastUpdatedAt,
  errors,
  dirty,
  saving,
  onUpdateGeneral,
  onUpdateOperational,
  onSave,
}: GeneralPanelProps) {
  return (
    <PanelShell
      title="General Settings"
      subtitle="Manage basic system configuration and administrator preferences."
      category="general"
      dirty={dirty}
      saving={saving}
      onSave={onSave}
    >
      <PanelSection title="System Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="system-name"
            label="System Name"
            value={general.systemName}
            error={errors.systemName}
            onChange={(value) => onUpdateGeneral({ systemName: value })}
          />
          <SelectField
            id="time-zone"
            label="Time Zone"
            value={general.timeZone}
            options={TIME_ZONES}
            error={errors.timeZone}
            onChange={(value) => onUpdateGeneral({ timeZone: value })}
          />
          <SelectField
            id="currency"
            label="Currency"
            value={general.currency}
            options={CURRENCIES}
            error={errors.currency}
            onChange={(value) => onUpdateGeneral({ currency: value })}
          />
          <SelectField
            id="language"
            label="Language"
            value={general.language}
            options={LANGUAGES}
            error={errors.language}
            onChange={(value) => onUpdateGeneral({ language: value })}
          />
        </div>
      </PanelSection>

      <PanelSection title="Operational Preferences">
        <div className="divide-y divide-[#f0f3f8]">
          <ToggleSwitch
            id="toggle-monitoring"
            label="Enable real-time monitoring"
            description="Allow administrators to view live fleet and transaction activity."
            checked={operational.realTimeMonitoring}
            onChange={(checked) => onUpdateOperational({ realTimeMonitoring: checked })}
          />
          <ToggleSwitch
            id="toggle-settlement"
            label="Automatic settlement processing"
            description="Automatically process eligible operator settlements each day."
            checked={operational.automaticSettlement}
            onChange={(checked) => onUpdateOperational({ automaticSettlement: checked })}
          />
          <ToggleSwitch
            id="toggle-route-approval"
            label="Require approval for route changes"
            description="Route and fare changes require administrator approval before publishing."
            checked={operational.requireRouteApproval}
            onChange={(checked) => onUpdateOperational({ requireRouteApproval: checked })}
          />
        </div>
      </PanelSection>

      <PanelSection title="Maintenance">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#6e7a91] uppercase">
              Last Configuration Update
            </p>
            <p className="mt-1 text-[12.5px] font-bold text-[#14213d]">
              {formatInColombo(lastUpdatedAt)}
            </p>
          </div>
        </div>
      </PanelSection>
    </PanelShell>
  );
}

// ---------------------------------------------------------------------------
// Inferred panels (not in the Figma) — lean, using the same components.
// ---------------------------------------------------------------------------

interface PanelProps<T> {
  values: T;
  dirty: boolean;
  saving: boolean;
  onChange: (patch: Partial<T>) => void;
  onSave: (category: SaveableCategory) => void;
}

export function NotificationsPanel({ values, dirty, saving, onChange, onSave }: PanelProps<NotificationSettings>) {
  return (
    <PanelShell
      title="Notifications"
      subtitle="Manage system notifications, alerts and administrative communication preferences."
      category="notifications"
      dirty={dirty}
      saving={saving}
      onSave={onSave}
    >
      <PanelSection title="Alert Channels">
        <div className="divide-y divide-[#f0f3f8]">
          <ToggleSwitch id="notif-email" label="Email alerts" description="Send system alerts to administrator email addresses." checked={values.emailAlerts} onChange={(checked) => onChange({ emailAlerts: checked })} />
          <ToggleSwitch id="notif-sms" label="SMS alerts" description="Send critical alerts by SMS to on-call administrators." checked={values.smsAlerts} onChange={(checked) => onChange({ smsAlerts: checked })} />
          <ToggleSwitch id="notif-settlement" label="Settlement notifications" description="Notify finance administrators when settlements are processed." checked={values.settlementNotifications} onChange={(checked) => onChange({ settlementNotifications: checked })} />
          <ToggleSwitch id="notif-security" label="Security alerts" description="Alert administrators about sign-ins and security events." checked={values.securityAlerts} onChange={(checked) => onChange({ securityAlerts: checked })} />
        </div>
      </PanelSection>
      <PanelSection title="Summary Reports">
        <div className="max-w-sm">
          <SelectField id="notif-digest" label="Digest Frequency" value={values.digestFrequency} options={DIGEST_FREQUENCIES} onChange={(value) => onChange({ digestFrequency: value })} />
        </div>
      </PanelSection>
    </PanelShell>
  );
}

export function SecurityPanel({ values, dirty, saving, onChange, onSave }: PanelProps<SecuritySettings>) {
  return (
    <PanelShell
      title="Security"
      subtitle="System security preferences and access-related controls."
      category="security"
      dirty={dirty}
      saving={saving}
      onSave={onSave}
    >
      <PanelSection title="Access Controls">
        <div className="divide-y divide-[#f0f3f8]">
          <ToggleSwitch id="sec-2fa" label="Require two-factor authentication" description="Force a second verification step for every administrator sign-in." checked={values.twoFactorRequired} onChange={(checked) => onChange({ twoFactorRequired: checked })} />
          <ToggleSwitch id="sec-network" label="Restrict logins to admin network" description="Only allow sign-ins from the registered office network." checked={values.restrictLoginToAdminNetwork} onChange={(checked) => onChange({ restrictLoginToAdminNetwork: checked })} />
        </div>
      </PanelSection>
      <PanelSection title="Session Policy">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="sec-timeout" label="Session Timeout" suffix="min" value={values.sessionTimeoutMinutes} onChange={(value) => onChange({ sessionTimeoutMinutes: value })} />
          <NumberField id="sec-expiry" label="Password Expiry" suffix="days" value={values.passwordExpiryDays} onChange={(value) => onChange({ passwordExpiryDays: value })} />
        </div>
      </PanelSection>
    </PanelShell>
  );
}

export function UserManagementPanel({ values, dirty, saving, onChange, onSave }: PanelProps<UserManagementSettings>) {
  return (
    <PanelShell
      title="User Management"
      subtitle="Manage user access, roles, permissions and account configuration."
      category="user-management"
      dirty={dirty}
      saving={saving}
      onSave={onSave}
    >
      <PanelSection title="Account Defaults">
        <div className="max-w-sm">
          <SelectField id="um-role" label="Default New-User Role" value={values.defaultNewUserRole} options={DEFAULT_ROLES} onChange={(value) => onChange({ defaultNewUserRole: value })} />
        </div>
      </PanelSection>
      <PanelSection title="Access Rules">
        <div className="divide-y divide-[#f0f3f8]">
          <ToggleSwitch id="um-verify" label="Require email verification" description="New users must verify their email address before first sign-in." checked={values.requireEmailVerification} onChange={(checked) => onChange({ requireEmailVerification: checked })} />
          <ToggleSwitch id="um-approve" label="Auto-approve bus owners" description="Register bus owner accounts without manual administrator review." checked={values.autoApproveBusOwners} onChange={(checked) => onChange({ autoApproveBusOwners: checked })} />
          <ToggleSwitch id="um-concurrent" label="Allow concurrent sessions" description="Let a user stay signed in on more than one device at a time." checked={values.allowConcurrentSessions} onChange={(checked) => onChange({ allowConcurrentSessions: checked })} />
        </div>
      </PanelSection>
    </PanelShell>
  );
}

export function PaymentPanel({ values, dirty, saving, onChange, onSave }: PanelProps<PaymentSettings>) {
  return (
    <PanelShell
      title="Payment Settings"
      subtitle="Payment gateway integration and payment-related preferences."
      category="payment"
      dirty={dirty}
      saving={saving}
      onSave={onSave}
    >
      {/* Deliberately no secret fields: API keys/tokens are handled server-side only. */}
      <PanelSection title="Gateway">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="pay-gateway" label="Primary Gateway" value={values.primaryGateway} options={GATEWAYS} onChange={(value) => onChange({ primaryGateway: value })} />
          <SelectField id="pay-schedule" label="Settlement Schedule" value={values.settlementSchedule} options={SETTLEMENT_SCHEDULES} onChange={(value) => onChange({ settlementSchedule: value })} />
        </div>
      </PanelSection>
      <PanelSection title="Payment Rules">
        <div className="divide-y divide-[#f0f3f8]">
          <ToggleSwitch id="pay-cards" label="Enable card payments" description="Allow passengers to pay fares by debit or credit card." checked={values.enableCardPayments} onChange={(checked) => onChange({ enableCardPayments: checked })} />
        </div>
        <div className="mt-4 max-w-xs">
          <NumberField id="pay-min" label="Minimum Settlement Amount" suffix="LKR" value={values.minimumSettlementAmount} onChange={(value) => onChange({ minimumSettlementAmount: value })} />
        </div>
      </PanelSection>
    </PanelShell>
  );
}

export function RoutePanel({ values, dirty, saving, onChange, onSave }: PanelProps<RouteSettings>) {
  return (
    <PanelShell
      title="Route Settings"
      subtitle="System-wide route management preferences and operational settings."
      category="route"
      dirty={dirty}
      saving={saving}
      onSave={onSave}
    >
      <PanelSection title="Route Operations">
        <div className="divide-y divide-[#f0f3f8]">
          <ToggleSwitch id="route-create" label="Allow route creation" description="Let authorised operators propose new bus routes." checked={values.allowRouteCreation} onChange={(checked) => onChange({ allowRouteCreation: checked })} />
          <ToggleSwitch id="route-publish" label="Auto-publish fares" description="Publish fare changes immediately without administrator approval." checked={values.autoPublishFares} onChange={(checked) => onChange({ autoPublishFares: checked })} />
        </div>
      </PanelSection>
      <PanelSection title="Fare Defaults">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="route-grace" label="Route Change Grace Period" suffix="hrs" value={values.routeChangeGraceHours} onChange={(value) => onChange({ routeChangeGraceHours: value })} />
          <SelectField id="route-currency" label="Default Fare Currency" value={values.defaultFareCurrency} options={CURRENCIES} onChange={(value) => onChange({ defaultFareCurrency: value })} />
        </div>
      </PanelSection>
    </PanelShell>
  );
}
