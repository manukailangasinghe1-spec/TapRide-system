import { useNavigate } from 'react-router-dom';
import { BarChart3, Bell, Bus, Clock, Users, Wrench, type LucideIcon } from 'lucide-react';

interface QuickAction {
  /** Route segment under /owner, e.g. "fleet" -> /owner/fleet. */
  module: string;
  label: string;
  icon: LucideIcon;
}

const ACTIONS: QuickAction[] = [
  { module: 'fleet', label: 'Fleet', icon: Bus },
  { module: 'crew', label: 'Crew', icon: Users },
  { module: 'reports', label: 'Reports', icon: BarChart3 },
  { module: 'maintenance', label: 'Maintenance', icon: Wrench },
  { module: 'schedules', label: 'Schedules', icon: Clock },
  { module: 'alerts', label: 'Alerts', icon: Bell },
];

// Each action routes to a Sprint 3 placeholder page; the labels match the
// modules in the TAP-84 Figma design.
export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="quick-actions-heading" className="mt-8">
      <h3 id="quick-actions-heading" className="font-['Manrope',sans-serif] text-sm font-extrabold text-[#14213d]">
        Quick Actions
      </h3>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {ACTIONS.map(({ module, label, icon: Icon }) => (
          <button
            key={module}
            type="button"
            onClick={() => navigate(`/owner/${module}`)}
            className="flex flex-col items-center gap-2.5 rounded-2xl border border-[#e4eaf3] bg-white px-2 py-4 text-[11px] font-bold text-[#4f5b71] transition hover:-translate-y-0.5 hover:border-[#cdd9fa] hover:shadow-md"
          >
            <Icon className="h-5 w-5 text-[#2459dc]" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
