import { useCallback, useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../services/adminSettingsService';
import { validateGeneralSettings } from '../services/validation';
import type {
  AuditChange,
  GeneralSettings,
  LoadStatus,
  NotificationSettings,
  OperationalPreferences,
  PaymentSettings,
  RouteSettings,
  SaveableCategory,
  SecuritySettings,
  SettingsFormErrors,
  SystemSettings,
  UserManagementSettings,
} from '../types';

export interface Notice {
  kind: 'success' | 'error' | 'info';
  message: string;
}

// Human-readable labels so audit entries read like "System name: A -> B".
const GENERAL_FIELD_LABELS: Record<keyof GeneralSettings, string> = {
  systemName: 'System name',
  timeZone: 'Time zone',
  currency: 'Currency',
  language: 'Language',
};

const OPERATIONAL_FIELD_LABELS: Record<keyof OperationalPreferences, string> = {
  realTimeMonitoring: 'Enable real-time monitoring',
  automaticSettlement: 'Automatic settlement processing',
  requireRouteApproval: 'Require approval for route changes',
};

function formatValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'on' : 'off';
  return String(value);
}

/** Compare one settings slice against the saved copy and list what changed. */
function diffSlice<T>(current: T, saved: T, labels: Record<keyof T & string, string>): AuditChange[] {
  const changes: AuditChange[] = [];
  (Object.keys(labels) as Array<keyof T & string>).forEach((key) => {
    const nextValue = (current as Record<string, unknown>)[key];
    const savedValue = (saved as Record<string, unknown>)[key];
    if (nextValue !== savedValue) {
      changes.push({
        field: labels[key],
        from: formatValue(savedValue),
        to: formatValue(nextValue),
      });
    }
  });
  return changes;
}

/**
 * Loads settings, holds the editable draft, tracks the dirty state per
 * category and runs the validate-then-save flow. The page only renders.
 */
export function useAdminSettings() {
  const [status, setStatus] = useState<LoadStatus>('loading'); // first load starts immediately
  const [saved, setSaved] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [errors, setErrors] = useState<SettingsFormErrors>({});
  const [savingCategory, setSavingCategory] = useState<SaveableCategory | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetches settings and applies them. .then chains (not async/await) keep the
  // setState calls out of the effect's synchronous body, which satisfies the
  // react-hooks lint rule for the mount effect below.
  const applySettings = useCallback((): Promise<void> => {
    return getSettings()
      .then((settings) => {
        setSaved(settings);
        setDraft(structuredClone(settings)); // draft starts as a copy of saved
        setLoadError(null);
        setStatus('success');
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'Failed to load settings.');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    void applySettings();
  }, [applySettings]);

  // Retry button handler: explicit re-enter of the loading state is fine here
  // because this runs from a click event, not from an effect.
  const reload = useCallback(() => {
    setStatus('loading');
    setLoadError(null);
    void applySettings();
  }, [applySettings]);

  const updateGeneral = (patch: Partial<GeneralSettings>) => {
    setDraft((current) =>
      current ? { ...current, general: { ...current.general, ...patch } } : current,
    );
    setErrors((current) => {
      // Re-validate only if this patch could clear an existing error.
      if (!draft || Object.keys(current).length === 0) return current;
      const next = { ...draft.general, ...patch };
      const nextErrors = validateGeneralSettings(next);
      const cleared: SettingsFormErrors = {};
      (Object.keys(current) as Array<keyof SettingsFormErrors>).forEach((key) => {
        if (nextErrors[key]) cleared[key] = nextErrors[key]; // keep or update
        // otherwise drop the error: the field is now valid
      });
      return cleared;
    });
  };

  const updateOperational = (patch: Partial<OperationalPreferences>) => {
    setDraft((current) =>
      current ? { ...current, operational: { ...current.operational, ...patch } } : current,
    );
  };

  const updateCategory = (
    category: 'notifications' | 'security' | 'userManagement' | 'payment' | 'route',
    patch:
      | Partial<NotificationSettings>
      | Partial<SecuritySettings>
      | Partial<UserManagementSettings>
      | Partial<PaymentSettings>
      | Partial<RouteSettings>,
  ) => {
    setDraft((current) =>
      current ? { ...current, [category]: { ...current[category], ...patch } } : current,
    );
  };

  const isDirty = useCallback(
    (category: SaveableCategory): boolean => {
      if (!draft || !saved) return false;
      if (category === 'general') {
        return (
          JSON.stringify(draft.general) !== JSON.stringify(saved.general) ||
          JSON.stringify(draft.operational) !== JSON.stringify(saved.operational)
        );
      }
      // Category ids like 'user-management' map to settings keys like 'userManagement'.
      const key = CATEGORY_KEYS[category];
      return JSON.stringify(draft[key]) !== JSON.stringify(saved[key]);
    },
    [draft, saved],
  );

  const save = async (category: SaveableCategory) => {
    if (!draft || !saved) return;
    if (!isDirty(category)) {
      setNotice({ kind: 'info', message: 'No changes to save.' });
      return;
    }

    // General also owns the operational toggles, so both slices are validated
    // and diffed together on that panel's Save button.
    let changes: AuditChange[];
    if (category === 'general') {
      const fieldErrors = validateGeneralSettings(draft.general);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setNotice({ kind: 'error', message: 'Please fix the highlighted fields and try again.' });
        return;
      }
      changes = [
        ...diffSlice(draft.general, saved.general, GENERAL_FIELD_LABELS),
        ...diffSlice(draft.operational, saved.operational, OPERATIONAL_FIELD_LABELS),
      ];
    } else {
      changes = diffSlice(draft[CATEGORY_KEYS[category]], saved[CATEGORY_KEYS[category]], CATEGORY_LABELS[category]);
      if (changes.length === 0) {
        setNotice({ kind: 'info', message: 'No changes to save.' });
        return;
      }
    }

    setSavingCategory(category);
    setNotice(null);
    try {
      const updated = await saveSettings(draft, category, changes);
      setSaved(updated);
      setDraft(structuredClone(updated)); // reset the draft to the saved truth
      setNotice({ kind: 'success', message: 'Settings saved successfully.' });
    } catch (error) {
      setNotice({
        kind: 'error',
        message: `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setSavingCategory(null);
    }
  };

  return {
    status,
    loadError,
    draft,
    errors,
    savingCategory,
    notice,
    setNotice,
    isDirty,
    updateGeneral,
    updateOperational,
    updateCategory,
    save,
    reload,
  };
}

// Settings category id -> the matching key on the SystemSettings object.
const CATEGORY_KEYS: Record<
  'notifications' | 'security' | 'user-management' | 'payment' | 'route',
  'notifications' | 'security' | 'userManagement' | 'payment' | 'route'
> = {
  notifications: 'notifications',
  security: 'security',
  'user-management': 'userManagement',
  payment: 'payment',
  route: 'route',
};

// Labels for the audit diff of each inferred panel (not in the Figma).
const CATEGORY_LABELS: Record<
  'notifications' | 'security' | 'user-management' | 'payment' | 'route',
  Record<string, string>
> = {
  notifications: {
    emailAlerts: 'Email alerts',
    smsAlerts: 'SMS alerts',
    settlementNotifications: 'Settlement notifications',
    securityAlerts: 'Security alerts',
    digestFrequency: 'Digest frequency',
  },
  security: {
    twoFactorRequired: 'Require 2FA',
    sessionTimeoutMinutes: 'Session timeout (minutes)',
    passwordExpiryDays: 'Password expiry (days)',
    restrictLoginToAdminNetwork: 'Restrict logins to admin network',
  },
  'user-management': {
    defaultNewUserRole: 'Default new-user role',
    requireEmailVerification: 'Require email verification',
    autoApproveBusOwners: 'Auto-approve bus owners',
    allowConcurrentSessions: 'Allow concurrent sessions',
  },
  payment: {
    primaryGateway: 'Primary gateway',
    enableCardPayments: 'Card payments',
    settlementSchedule: 'Settlement schedule',
    minimumSettlementAmount: 'Minimum settlement amount',
  },
  route: {
    allowRouteCreation: 'Allow route creation',
    routeChangeGraceHours: 'Route change grace period (hours)',
    autoPublishFares: 'Auto-publish fares',
    defaultFareCurrency: 'Default fare currency',
  },
};
