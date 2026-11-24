import { RefreshCw, ScrollText } from 'lucide-react';
import { useAuditLogs } from '../hooks/useAuditLogs';
import type { AuditLogEntry, LoadStatus } from '../types';

// Same "August 29, 2026 - 02:14 PM" style as the Maintenance block, always in
// Asia/Colombo time so log timestamps render consistently for every admin.
function formatTimestamp(isoTimestamp: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date(isoTimestamp));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('month')} ${part('day')}, ${part('year')} - ${part('hour')}:${part('minute')} ${part('dayPeriod')}`;
}

const CATEGORY_BADGES: Record<string, string> = {
  general: 'bg-[#edf3ff] text-[#2156e8]',
  notifications: 'bg-[#e8fbf1] text-[#168454]',
  security: 'bg-[#fdeef0] text-[#e04d65]',
  'user-management': 'bg-[#f3eefe] text-[#7a4fd0]',
  payment: 'bg-[#fff4e5] text-[#c88921]',
  route: 'bg-[#e6f7fb] text-[#1b8aa8]',
};

function LogRows({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <ul className="divide-y divide-[#edf1f7]">
      {entries.map((entry) => (
        <li key={entry.id} className="grid gap-1 py-3.5 sm:grid-cols-[170px_110px_130px_1fr] sm:items-center sm:gap-4">
          <time dateTime={entry.timestamp} className="text-[11px] font-semibold whitespace-nowrap text-[#6e7a91]">
            {formatTimestamp(entry.timestamp)}
          </time>
          <span className="text-[12px] font-bold text-[#14213d]">{entry.user}</span>
          <span>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${CATEGORY_BADGES[entry.category] ?? 'bg-[#eef2f8] text-[#4f5b71]'}`}
            >
              {entry.category === 'user-management' ? 'User Mgmt' : entry.category}
            </span>
          </span>
          <span className="text-[11.5px] leading-snug text-[#4f5b71]">{entry.details}</span>
        </li>
      ))}
    </ul>
  );
}

function AuditLogBody({ status, entries, error, onRetry }: {
  status: LoadStatus;
  entries: AuditLogEntry[];
  error: string | null;
  onRetry: () => void;
}) {
  if (status === 'loading') {
    return (
      <div aria-label="Loading audit logs" className="space-y-3 py-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-lg bg-[#eef2f8]" />
        ))}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div role="alert" className="py-10 text-center">
        <p className="text-[12.5px] font-bold text-[#14213d]">Couldn&apos;t load audit logs</p>
        <p className="mt-1 text-[11.5px] text-[#6e7a91]">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#e4eaf3] px-4 text-[11.5px] font-bold text-[#4f5b71] transition hover:border-[#2156e8] hover:text-[#2156e8]"
        >
          <RefreshCw size={13} /> Try again
        </button>
      </div>
    );
  }
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#f0f4fa] text-[#9aa5b8]">
          <ScrollText size={20} aria-hidden="true" />
        </span>
        <p className="text-[12.5px] font-bold text-[#14213d]">No audit log entries yet</p>
        <p className="mt-1 text-[11.5px] text-[#6e7a91]">
          Configuration changes and administrative actions will appear here.
        </p>
      </div>
    );
  }
  // Desktop table header + rows; on mobile the grid stacks into a readable list.
  return (
    <div>
      <div aria-hidden="true" className="hidden grid-cols-[170px_110px_130px_1fr] gap-4 border-b border-[#e4eaf3] py-2.5 text-[10px] font-bold tracking-wider text-[#6e7a91] uppercase sm:grid">
        <span>Time</span>
        <span>User</span>
        <span>Category</span>
        <span>Details</span>
      </div>
      <LogRows entries={entries} />
    </div>
  );
}

/** System Logs panel: the audit trail of configuration changes. */
export function SystemLogsPanel() {
  const { status, data, error, reload } = useAuditLogs();
  return (
    <div className="rounded-xl border border-[#e4eaf3] bg-white">
      <div className="border-b border-[#edf1f7] px-5 pt-5 pb-4 sm:px-6">
        <h2 className="font-['Manrope',sans-serif] text-[15px] font-extrabold text-[#14213d]">System Logs</h2>
        <p className="mt-0.5 text-[11px] text-[#8a96a9]">
          System activity, configuration changes and administrative actions.
        </p>
      </div>
      <div className="px-5 sm:px-6">
        <AuditLogBody status={status} entries={data?.entries ?? []} error={error} onRetry={reload} />
      </div>
      <p className="border-t border-[#edf1f7] px-5 py-3.5 text-[10.5px] text-[#9aa5b8] sm:px-6">
        All configuration changes are logged for audit purposes.
      </p>
    </div>
  );
}
