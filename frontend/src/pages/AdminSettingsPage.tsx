import { useState } from 'react';
import { SystemLogsPanel } from '../features/admin-settings/components/AuditLogTable';
import { SettingsCategoryNav } from '../features/admin-settings/components/SettingsCategoryNav';
import {
  GeneralSettingsPanel,
  NotificationsPanel,
  PaymentPanel,
  RoutePanel,
  SecurityPanel,
  UserManagementPanel,
} from '../features/admin-settings/components/SettingsPanels';
import { SettingsLoadError, SettingsSkeleton, Toast } from '../features/admin-settings/components/SettingsStates';
import { useAdminSettings } from '../features/admin-settings/hooks/useAdminSettings';
import type { SettingsCategory } from '../features/admin-settings/types';

/**
 * System Oversight & Audit page (route: /admin/settings). The page only
 * orchestrates: the hook owns data + save flow, and each panel renders a
 * slice of the draft settings.
 */
export default function AdminSettingsPage() {
  const settings = useAdminSettings();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Page heading from the design */}
      <div className="mb-5">
        <h2 className="font-['Manrope',sans-serif] text-[19px] font-extrabold tracking-[-0.3px] text-[#14213d]">
          TapRide - System Oversight &amp; Audit
        </h2>
        <p className="mt-0.5 text-[11.5px] text-[#8a96a9]">
          Configure system settings, notifications, security and administrative preferences.
        </p>
      </div>

      {settings.status === 'loading' && <SettingsSkeleton />}
      {settings.status === 'error' && (
        <SettingsLoadError message={settings.loadError ?? 'Unknown error.'} onRetry={settings.reload} />
      )}

      {settings.status === 'success' && settings.draft && (
        <div className="grid items-start gap-5 lg:grid-cols-[280px_1fr]">
          <SettingsCategoryNav active={activeCategory} onSelect={setActiveCategory} />

          <div className="min-w-0">
            {activeCategory === 'general' && (
              <GeneralSettingsPanel
                general={settings.draft.general}
                operational={settings.draft.operational}
                lastUpdatedAt={settings.draft.lastUpdatedAt}
                errors={settings.errors}
                dirty={settings.isDirty('general')}
                saving={settings.savingCategory === 'general'}
                onUpdateGeneral={settings.updateGeneral}
                onUpdateOperational={settings.updateOperational}
                onSave={settings.save}
              />
            )}
            {activeCategory === 'notifications' && (
              <NotificationsPanel
                values={settings.draft.notifications}
                dirty={settings.isDirty('notifications')}
                saving={settings.savingCategory === 'notifications'}
                onChange={(patch) => settings.updateCategory('notifications', patch)}
                onSave={settings.save}
              />
            )}
            {activeCategory === 'security' && (
              <SecurityPanel
                values={settings.draft.security}
                dirty={settings.isDirty('security')}
                saving={settings.savingCategory === 'security'}
                onChange={(patch) => settings.updateCategory('security', patch)}
                onSave={settings.save}
              />
            )}
            {activeCategory === 'user-management' && (
              <UserManagementPanel
                values={settings.draft.userManagement}
                dirty={settings.isDirty('user-management')}
                saving={settings.savingCategory === 'user-management'}
                onChange={(patch) => settings.updateCategory('userManagement', patch)}
                onSave={settings.save}
              />
            )}
            {activeCategory === 'payment' && (
              <PaymentPanel
                values={settings.draft.payment}
                dirty={settings.isDirty('payment')}
                saving={settings.savingCategory === 'payment'}
                onChange={(patch) => settings.updateCategory('payment', patch)}
                onSave={settings.save}
              />
            )}
            {activeCategory === 'route' && (
              <RoutePanel
                values={settings.draft.route}
                dirty={settings.isDirty('route')}
                saving={settings.savingCategory === 'route'}
                onChange={(patch) => settings.updateCategory('route', patch)}
                onSave={settings.save}
              />
            )}
            {activeCategory === 'system-logs' && <SystemLogsPanel />}
          </div>
        </div>
      )}

      <Toast notice={settings.notice} onDismiss={() => settings.setNotice(null)} />
    </div>
  );
}
