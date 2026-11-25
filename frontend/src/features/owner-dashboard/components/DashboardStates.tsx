// Loading, empty and error states for the dashboard, kept in one file
// because each is only a few lines of presentational markup.

/** Grey placeholder blocks shown while the first load is in flight. */
export function DashboardSkeleton() {
  const pulse = 'animate-pulse rounded-2xl bg-[#e9eef7]';
  return (
    <div aria-label="Loading dashboard" role="status">
      <div className={`h-16 ${pulse}`} />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`h-28 ${pulse}`} />
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <div className={`h-72 lg:col-span-2 ${pulse}`} />
        <div className={`h-72 lg:col-span-3 ${pulse}`} />
      </div>
      <span className="sr-only">Loading dashboard data…</span>
    </div>
  );
}

/** Shown inside a section (e.g. Active Buses) when there is nothing to list. */
export function SectionEmpty({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-[#d7e0ee] bg-[#f7f9fd] px-4 py-6 text-center text-xs font-medium text-[#6e7a91]">
      {message}
    </p>
  );
}

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

/** Full-page error shown when the very first load fails (no cached data). */
export default function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div role="alert" className="mx-auto mt-16 max-w-md rounded-2xl border border-[#e4eaf3] bg-white p-10 text-center">
      <p className="font-['Manrope',sans-serif] text-lg font-extrabold text-[#14213d]">
        Couldn&rsquo;t load the dashboard
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#6e7a91]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2156e8] px-5 text-xs font-bold text-white shadow-lg shadow-[#2156e8]/25 transition hover:bg-[#1644ca]"
      >
        Try again
      </button>
    </div>
  );
}
