import type { ReactNode } from 'react';
import { Bus, CheckCircle2, RefreshCw, Ticket, Users } from 'lucide-react';
import ActiveBusesSection from '../features/owner-dashboard/components/ActiveBusesSection';
import DashboardError, { DashboardSkeleton, SectionEmpty } from '../features/owner-dashboard/components/DashboardStates';
import QuickActions from '../features/owner-dashboard/components/QuickActions';
import RevenueCard from '../features/owner-dashboard/components/RevenueCard';
import StatCard from '../features/owner-dashboard/components/StatCard';
import { useDashboardData } from '../features/owner-dashboard/hooks/useDashboardData';
import type { OverviewStats } from '../features/owner-dashboard/types';

// The page only orchestrates: all fetching lives in the hook and each child
// component receives plain typed props.
export default function OwnerDashboard() {
  const { status, data, error, lastUpdated, refreshing, greeting, refresh } = useDashboardData();

  // Announced to screen readers whenever the load/refresh status changes.
  const liveMessage =
    status === 'loading'
      ? 'Loading dashboard.'
      : status === 'error'
        ? `Dashboard failed to load: ${error}`
        : refreshing
          ? 'Refreshing dashboard data.'
          : error
            ? 'Refresh failed. Showing the last loaded data.'
            : `Dashboard updated at ${lastUpdated?.toLocaleTimeString()}.`;

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-[#14213d]">
      {/* Top bar: operator identity + manual refresh */}
      <header className="sticky top-0 z-10 border-b border-[#e4eaf3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2156e8] font-['Manrope',sans-serif] text-xs font-extrabold text-white">
              {data?.operator.initials ?? '·'}
            </span>
            <div>
              <p className="font-['Manrope',sans-serif] text-[13px] font-extrabold leading-tight">
                {data?.operator.name ?? 'Loading…'}
              </p>
              <p className="text-[10px] font-medium text-[#6e7a91]">{data?.operator.role ?? ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            aria-label="Refresh dashboard data"
            className="grid h-9 w-9 place-items-center rounded-full bg-[#14213d] text-white transition hover:bg-[#2156e8] disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <p aria-live="polite" className="sr-only">{liveMessage}</p>

        <p className="text-[10px] font-bold uppercase tracking-[1.7px] text-[#2459dc]">{greeting}</p>
        <h1 className="mt-1 font-['Manrope',sans-serif] text-3xl font-extrabold tracking-tight">
          Owner Dashboard
        </h1>
        <p className="mt-1 text-xs text-[#6e7a91]">Manage your fleet and monitor today&rsquo;s TapRide operations</p>

        {status === 'loading' && <DashboardSkeleton />}
        {status === 'error' && <DashboardError message={error ?? 'Unknown error'} onRetry={refresh} />}

        {status === 'success' && data && (
          <>
            {/* Non-blocking refresh failure: warn but keep the data on screen. */}
            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-[#f7d9c4] bg-[#fff4e5] px-4 py-3 text-xs font-semibold text-[#c88921]">
                Couldn&rsquo;t refresh the dashboard — showing data from{' '}
                {lastUpdated ? lastUpdated.toLocaleTimeString() : 'the last successful load'}.
              </p>
            )}

            {/* Operations status banner */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#e4eaf3] bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#24b77a]" aria-hidden="true" />
                <div>
                  <p className="font-['Manrope',sans-serif] text-[13px] font-extrabold">TapRide Operations</p>
                  <p className="text-[11px] text-[#6e7a91]">
                    {data.operationsOnline ? 'Fleet is active and running normally' : 'Some services are offline'}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  data.operationsOnline ? 'bg-[#e8fbf1] text-[#168454]' : 'bg-[#f0f2f7] text-[#6e7a91]'
                }`}
              >
                {data.operationsOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <DashboardSections stats={data.stats} />

            <div className="mt-3 grid gap-3 lg:grid-cols-5">
              <div className="lg:col-span-2">
                {data.revenue.bars.length > 0 ? (
                  <RevenueCard revenue={data.revenue} />
                ) : (
                  <SectionShell title="Today's Fare Revenue">
                    <SectionEmpty message="No fare revenue recorded yet today." />
                  </SectionShell>
                )}
              </div>
              <div className="lg:col-span-3">
                {data.buses.length > 0 ? (
                  <ActiveBusesSection buses={data.buses} />
                ) : (
                  <SectionShell title="Active Buses">
                    <SectionEmpty message="No buses in your fleet yet." />
                  </SectionShell>
                )}
              </div>
            </div>

            <QuickActions />
          </>
        )}
      </main>
    </div>
  );
}

/** Stat cards and their section heading, split out to keep the page readable. */
function DashboardSections({ stats }: { stats: OverviewStats }) {
  const cards = [
    { label: 'Total Buses', value: stats.totalBuses, icon: Bus, iconClass: 'bg-[#edf3ff] text-[#2459dc]' },
    { label: 'Active Buses', value: stats.activeBuses, icon: CheckCircle2, iconClass: 'bg-[#e8fbf1] text-[#168454]' },
    { label: 'Total Journeys', value: stats.totalJourneys, icon: Ticket, iconClass: 'bg-[#fff4e5] text-[#c88921]' },
    { label: 'Crew Members', value: stats.crewMembers, icon: Users, iconClass: 'bg-[#f0ecff] text-[#6a4fd8]' },
  ];
  return (
    <section aria-labelledby="overview-heading" className="mt-6">
      <h2 id="overview-heading" className="font-['Manrope',sans-serif] text-sm font-extrabold text-[#14213d]">
        Today&rsquo;s Overview
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={String(card.value).padStart(2, '0')}
            icon={card.icon}
            iconClass={card.iconClass}
          />
        ))}
      </div>
    </section>
  );
}

/** Empty-state wrapper so Revenue/Buses keep their section styling. */
function SectionShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex h-full flex-col rounded-2xl border border-[#e4eaf3] bg-white p-6">
      <h3 className="font-['Manrope',sans-serif] text-sm font-extrabold text-[#14213d]">{title}</h3>
      <div className="mt-3 flex flex-1 items-center">{children}</div>
    </section>
  );
}
