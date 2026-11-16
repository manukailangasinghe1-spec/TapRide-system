import {
  Banknote,
  Bell,
  Bus,
  ClipboardList,
  LayoutDashboard,
  Map,
  Radio,
  Route as RouteIcon,
  Settings,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { RefObject } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number; // demo counts from the design (owned by other tickets later)
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'OVERVIEW',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/live-operations', label: 'Live Operations', icon: Radio, badge: 24 },
    ],
  },
  {
    heading: 'MANAGEMENT',
    items: [
      { to: '/admin/passengers', label: 'Passengers', icon: Users },
      { to: '/admin/bus-owners', label: 'Bus Owners', icon: Bus },
      { to: '/admin/fleet', label: 'Fleet Management', icon: ClipboardList },
      { to: '/admin/conductors', label: 'Conductors', icon: Bell },
      { to: '/admin/routes-fares', label: 'Routes & Fares', icon: RouteIcon },
    ],
  },
  {
    heading: 'FINANCE',
    items: [
      { to: '/admin/transactions', label: 'Transactions', icon: Wallet },
      { to: '/admin/settlements', label: 'Settlements', icon: Banknote, badge: 7 },
    ],
  },
  {
    heading: 'SYSTEM',
    items: [
      { to: '/admin/reports', label: 'Reports', icon: Map },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface SidebarContentProps {
  variant: 'rail' | 'drawer';
  onClose: () => void;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
}

function SidebarContent({ variant, onClose, closeButtonRef }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center gap-2.5 border-b border-[#eef1f7] px-5">
        <img src="/logo.jpeg" alt="TapRide logo" className="h-9 w-9 rounded-xl object-cover" />
        <div className="leading-tight">
          <p className="font-['Manrope',sans-serif] text-[14px] font-extrabold text-[#14213d]">TapRide</p>
          <p className="text-[9.5px] font-semibold tracking-wide text-[#8a96a9]">Admin Portal</p>
        </div>
        {variant === 'drawer' && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="ml-auto grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-[#e4eaf3] text-[#4f5b71] transition hover:text-[#14213d]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation (NavLink adds aria-current="page" to the active item) */}
      <nav aria-label="Admin portal sections" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading} className="mb-5">
            <p className="mb-1.5 px-3 text-[9.5px] font-extrabold tracking-[1.2px] text-[#9aa5b8]">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] font-semibold transition ${
                        isActive
                          ? 'bg-[#edf3ff] text-[#2156e8]'
                          : 'text-[#4f5b71] hover:bg-[#f5f8fd] hover:text-[#14213d]'
                      }`
                    }
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {typeof badge === 'number' && (
                      <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#e04d65] px-1 text-[9.5px] font-extrabold text-white">
                        {badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Signed-in admin (demo identity until Sprint 3 auth) */}
      <div className="flex shrink-0 items-center gap-3 border-t border-[#eef1f7] p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2156e8] text-[11px] font-extrabold text-white">
          AD
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[12px] font-bold text-[#14213d]">System Admin</p>
          <p className="text-[10px] text-[#8a96a9]">Administrator</p>
        </div>
      </div>
    </div>
  );
}

interface AdminSidebarProps {
  /** When true, the sidebar renders as the mobile drawer (overlay behind it). */
  mobileOpen: boolean;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The shared admin sidebar. Desktop (>=1024px): a fixed left rail. Smaller
 * screens: a drawer managed by AdminLayout (overlay, Escape to close).
 */
export function AdminSidebar({ mobileOpen, onClose, closeButtonRef }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed top-0 bottom-0 left-0 z-40 hidden w-[248px] border-r border-[#eef1f7] bg-white lg:block">
        <SidebarContent variant="rail" onClose={onClose} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu overlay"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-pointer bg-[#0c1427]/50"
          />
          <aside
            id="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation menu"
            className="absolute top-0 bottom-0 left-0 w-[280px] max-w-[85vw] bg-white shadow-2xl"
          >
            <SidebarContent variant="drawer" onClose={onClose} closeButtonRef={closeButtonRef} />
          </aside>
        </div>
      )}
    </>
  );
}
