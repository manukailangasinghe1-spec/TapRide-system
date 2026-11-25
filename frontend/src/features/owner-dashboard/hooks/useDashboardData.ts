import { useCallback, useEffect, useRef, useState } from 'react';
import { getDashboard } from '../services/dashboardService';
import type { DashboardData } from '../types';

export type LoadStatus = 'loading' | 'success' | 'error';

export interface DashboardState {
  status: LoadStatus;
  data: DashboardData | null;
  /** Set when the last fetch failed; may coexist with cached data. */
  error: string | null;
  lastUpdated: Date | null;
  /** true while a background refresh (auto or manual) is in flight. */
  refreshing: boolean;
}

const REFRESH_INTERVAL_MS = 60_000; // auto-refresh every 60 seconds

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    status: 'loading',
    data: null,
    error: null,
    lastUpdated: null,
    refreshing: false,
  });

  // Refs survive re-renders, so the interval/visibility handlers always see
  // the latest fetch time and we can guard setState after unmount.
  const mountedRef = useRef(true);
  const lastFetchRef = useRef(0);

  // Fetches data and setState only inside promise callbacks, so it is safe to
  // call directly from a useEffect (sync setState inside effects causes
  // cascading renders).
  const applyDashboard = useCallback((): Promise<void> => {
    return getDashboard()
      .then((data) => {
        lastFetchRef.current = Date.now();
        if (!mountedRef.current) return;
        setState({
          status: 'success',
          data,
          error: null,
          lastUpdated: new Date(),
          refreshing: false,
        });
      })
      .catch((err: unknown) => {
        if (!mountedRef.current) return;
        const message = err instanceof Error ? err.message : 'Something went wrong';
        // A failed refresh should not wipe data we already have on screen.
        setState((s) => ({
          ...s,
          status: s.data ? 'success' : 'error',
          error: message,
          refreshing: false,
        }));
      });
  }, []);

  // Refresh = flip the refreshing flag (sync) then fetch. Called from event
  // handlers (button click, timer tick), never synchronously in an effect.
  const refresh = useCallback(() => {
    setState((s) => ({ ...s, refreshing: true }));
    void applyDashboard();
  }, [applyDashboard]);

  useEffect(() => {
    mountedRef.current = true;
    void applyDashboard();

    // Auto-refresh on a 60s timer, but skip ticks while the tab is hidden
    // so we do not hammer the API in the background.
    const intervalId = window.setInterval(() => {
      if (!document.hidden) refresh();
    }, REFRESH_INTERVAL_MS);

    // When the user comes back to the tab, catch up if a whole interval
    // passed while it was hidden.
    const handleVisibilityChange = () => {
      if (document.hidden) return;
      if (Date.now() - lastFetchRef.current >= REFRESH_INTERVAL_MS) {
        refresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [applyDashboard, refresh]);

  return {
    ...state,
    greeting: getGreeting(),
    /** Manual refresh, wired to the header button. */
    refresh,
  };
}
