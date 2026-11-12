// Data shapes shared by the mock layer, the service and every UI component.
// The real API (Sprint 3) only has to return JSON matching these interfaces.

export type BusStatus = 'on-time' | 'in-transit' | 'delayed' | 'idle' | 'maintenance';

export interface OperatorProfile {
  name: string;
  initials: string;
  role: string;
}

export interface OverviewStats {
  totalBuses: number;
  activeBuses: number;
  totalJourneys: number;
  crewMembers: number;
}

export interface RevenueBar {
  /** Short axis label, e.g. "7a" for 7 AM. */
  label: string;
  amount: number;
  /** Marks the current time slot, rendered in white on the chart. */
  highlight?: boolean;
}

export interface RevenueSummary {
  todayTotal: number;
  /** Percentage change vs yesterday, e.g. 8.4 means "+8.4%". */
  comparisonPct: number;
  bars: RevenueBar[];
}

export interface Bus {
  id: string;
  plate: string;
  route: string;
  /** null when the bus is not carrying passengers (idle / maintenance). */
  passengersToday: number | null;
  status: BusStatus;
  /** null when no fares were collected. */
  revenueToday: number | null;
}

export interface DashboardData {
  operator: OperatorProfile;
  operationsOnline: boolean;
  stats: OverviewStats;
  revenue: RevenueSummary;
  buses: Bus[];
  /** ISO timestamp of when this snapshot was produced. */
  generatedAt: string;
}

// ---- Real API response shapes (Sprint 3, /api/v1/owner/dashboard/*) ----

export interface DashboardSummary {
  operator: OperatorProfile;
  operationsOnline: boolean;
  stats: OverviewStats;
  /** ISO-8601 UTC, e.g. "2026-11-12T14:02:00Z". */
  generatedAt: string;
}

export interface ActiveBusesResponse {
  buses: Bus[];
}
