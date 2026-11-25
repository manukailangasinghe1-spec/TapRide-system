import { fetchMockDashboard } from '../data/mockDashboard';
import type {
  ActiveBusesResponse,
  DashboardData,
  DashboardSummary,
  RevenueSummary,
} from '../types';

// Mock data is only allowed when it is an explicit opt-in:
//  - VITE_USE_MOCK === 'true' (works in any build, e.g. a backend-less demo), or
//  - running under the dev server and VITE_USE_MOCK is not 'false'.
// A production build without VITE_USE_MOCK=true always calls the real API.
const USE_MOCK: boolean =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false');
// No trailing slash; endpoint paths below include /api/v1 themselves.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

/** True while the dashboard renders built-in demo data instead of the API. */
export const IS_DEMO_MODE: boolean = USE_MOCK;

interface ApiErrorBody {
  detail?: string;
}

/** GET a JSON endpoint, surfacing FastAPI's {"detail": "..."} error text. */
async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.detail) detail = body.detail;
    } catch {
      // Body was not JSON; keep the HTTP status fallback message.
    }
    // TODO(Sprint 3): redirect to /login once real JWT auth is wired.
    if (response.status === 401) {
      throw new Error(`Session expired (401): ${detail}`);
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

async function fetchRealDashboard(): Promise<DashboardData> {
  // TODO(Sprint 3): replace mock with real API. This function is the single
  // swap point; the hook and all components stay untouched. Contract:
  // docs/TAP-84-owner-dashboard-api-contract.md
  const [summary, revenue, activeBuses] = await Promise.all([
    fetchJson<DashboardSummary>('/api/v1/owner/dashboard/summary'),
    fetchJson<RevenueSummary>('/api/v1/owner/dashboard/revenue'),
    fetchJson<ActiveBusesResponse>('/api/v1/owner/dashboard/active-buses'),
  ]);

  // Merge the three endpoint responses into the single view model the UI uses.
  return {
    operator: summary.operator,
    operationsOnline: summary.operationsOnline,
    stats: summary.stats,
    revenue,
    buses: activeBuses.buses,
    generatedAt: summary.generatedAt,
  };
}

/** The one place that decides where dashboard data comes from. */
export function getDashboard(): Promise<DashboardData> {
  return USE_MOCK ? fetchMockDashboard() : fetchRealDashboard();
}
