import type { DashboardData } from '../types';

// Static snapshot mirroring the TAP-84 Figma design. The whole point of the
// mock layer is that the UI never knows it is not talking to a real server.
const MOCK_DASHBOARD: DashboardData = {
  operator: { name: 'Ruwan Perera', initials: 'RP', role: 'Bus Owner · TapRide' },
  operationsOnline: true,
  stats: { totalBuses: 6, activeBuses: 4, totalJourneys: 186, crewMembers: 12 },
  revenue: {
    todayTotal: 48650,
    comparisonPct: 8.4,
    bars: [
      { label: '5a', amount: 1800 },
      { label: '6a', amount: 2400 },
      { label: '7a', amount: 3100 },
      { label: '8a', amount: 4600 },
      { label: '9a', amount: 5200 },
      { label: '10a', amount: 4300 },
      { label: '11a', amount: 3900 },
      { label: '12p', amount: 5600 },
      { label: '1p', amount: 4800 },
      { label: '2p', amount: 3600 },
      { label: '3p', amount: 4100 },
      { label: '4p', amount: 5400 },
      { label: '5p', amount: 6100, highlight: true },
      { label: '6p', amount: 5800 },
      { label: '7p', amount: 4600 },
      { label: '8p', amount: 3200 },
    ],
  },
  buses: [
    { id: 'b1', plate: 'NB-4521', route: 'Route 27 · Nugegoda → Pettah', passengersToday: 186, status: 'on-time', revenueToday: 3750 },
    { id: 'b2', plate: 'NB-7154', route: 'Route 138 · Moratuwa → Pettah', passengersToday: 142, status: 'in-transit', revenueToday: 3200 },
    { id: 'b3', plate: 'NB-3298', route: 'Route 17 · Maharagama → Kollupitiya', passengersToday: null, status: 'delayed', revenueToday: 1150 },
    { id: 'b4', plate: 'NB-8822', route: 'Route 4 · Borella → Mattakkuliya', passengersToday: 115, status: 'on-time', revenueToday: 2900 },
    { id: 'b5', plate: 'NB-1092', route: 'Route 32 · Kotahena → Kirulapone', passengersToday: 92, status: 'in-transit', revenueToday: 2100 },
    { id: 'b6', plate: 'NB-5544', route: 'Scheduled maintenance', passengersToday: null, status: 'maintenance', revenueToday: null },
  ],
  generatedAt: '',
};

// What the dashboard should look like on a quiet day: nothing to show,
// but the page itself must still render correctly.
const EMPTY_DASHBOARD: DashboardData = {
  operator: { name: 'Ruwan Perera', initials: 'RP', role: 'Bus Owner · TapRide' },
  operationsOnline: true,
  stats: { totalBuses: 0, activeBuses: 0, totalJourneys: 0, crewMembers: 0 },
  revenue: { todayTotal: 0, comparisonPct: 0, bars: [] },
  buses: [],
  generatedAt: '',
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Test hooks for the demo, enabled with ?mock=error, ?mock=empty or ?mock=slow
// in the browser URL. They let us show the loading / error / empty states
// without touching any code.
function getMockMode(): string | null {
  return new URLSearchParams(window.location.search).get('mock');
}

export async function fetchMockDashboard(): Promise<DashboardData> {
  const mode = getMockMode();

  if (mode === 'error') {
    await delay(600);
    throw new Error('Simulated server error (?mock=error)');
  }

  // ?mock=slow stretches the delay so the skeleton loaders are visible.
  await delay(mode === 'slow' ? 3000 : 600);

  const snapshot = mode === 'empty' ? EMPTY_DASHBOARD : MOCK_DASHBOARD;
  // structuredClone deep-copies so callers can never mutate the original mock.
  const data = structuredClone(snapshot);
  data.generatedAt = new Date().toISOString();
  return data;
}
