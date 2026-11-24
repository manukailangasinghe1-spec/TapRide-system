import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  title: string;
  subtitle: string;
  /** Extra footer note (e.g. the settings page's audit sentence). */
  footerNote?: string;
  children: ReactNode;
}

const DRAWER_BREAKPOINT_QUERY = '(min-width: 1024px)';

/**
 * Shared shell for every Admin Portal page: sidebar rail/drawer, top bar and
 * content area. Other admin tickets reuse this with their own title/subtitle.
 */
export function AdminLayout({ title, subtitle, footerNote, children }: AdminLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Stable so the keydown effect below doesn't re-subscribe every render.
  const closeDrawer = useCallback((returnFocus: boolean) => {
    setDrawerOpen(false);
    if (returnFocus) menuButtonRef.current?.focus(); // hand focus back to the menu button
  }, []);

  // Focus moves into the drawer when it opens; Escape closes it; Tab is
  // trapped inside so keyboard users can't fall behind the overlay.
  useEffect(() => {
    if (!drawerOpen) return;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden'; // stop background scrolling

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer(true);
        return;
      }
      if (event.key !== 'Tab') return;
      // The drawer is rendered by AdminSidebar with this id; Tab cycles inside it.
      const drawer = document.getElementById('admin-drawer');
      if (!drawer) return;
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // If the viewport grows to desktop while open, drop the drawer state.
    const media = window.matchMedia(DRAWER_BREAKPOINT_QUERY);
    const onResize = () => {
      if (media.matches) closeDrawer(false);
    };

    document.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', onResize);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-[#14213d]">
      <AdminSidebar
        mobileOpen={drawerOpen}
        onClose={() => closeDrawer(false)}
        closeButtonRef={closeButtonRef}
      />

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-[248px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[#e4eaf3] bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-[#e4eaf3] text-[#263b64] transition hover:border-[#2156e8] hover:text-[#2156e8] lg:hidden"
            >
              <Menu size={17} aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-['Manrope',sans-serif] text-[14.5px] font-extrabold text-[#14213d] sm:text-[15.5px]">
                {title}
              </h1>
              <p className="hidden truncate text-[11px] text-[#8a96a9] sm:block">{subtitle}</p>
            </div>
            {/* Search + bell: rendered per design; Sprint 3 wires real behavior. */}
            <div className="relative hidden md:block">
              <Search
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9aa5b8]"
              />
              <input
                type="search"
                aria-label="Search admin portal"
                placeholder="Search"
                className="h-9 w-44 rounded-lg border border-[#e4eaf3] bg-[#f7f9fd] pr-3 pl-9 text-[12px] text-[#14213d] placeholder:text-[#9aa5b8] focus:border-[#2156e8] focus:bg-white focus:ring-2 focus:ring-[#2156e8]/20 focus:outline-none xl:w-56"
              />
            </div>
            <button
              type="button"
              aria-label="Notifications (coming soon)"
              title="Notifications (coming soon)"
              className="relative grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-[#e4eaf3] text-[#263b64] transition hover:border-[#2156e8] hover:text-[#2156e8]"
            >
              <Bell size={16} aria-hidden="true" />
              <span aria-hidden="true" className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#e04d65]" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        {/* Footer */}
        <footer className="flex flex-col gap-1.5 border-t border-[#e4eaf3] px-4 py-4 text-[10.5px] text-[#9aa5b8] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 TapRide Admin Portal</p>
          {footerNote && <p>{footerNote}</p>}
        </footer>
      </div>
    </div>
  );
}
