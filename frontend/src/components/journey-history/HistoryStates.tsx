interface SkeletonProps {
  label: string;
}

export function BalanceCardSkeleton({ label }: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      className="animate-pulse rounded-[24px] bg-slate-200/70 px-5 py-5 md:px-8 md:py-7"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="md:flex md:items-end md:justify-between md:gap-10">
        <div>
          <div className="h-2.5 w-32 rounded bg-slate-300/80" />
          <div className="mt-3 h-8 w-44 rounded bg-slate-300/80 md:h-10" />
          <div className="mt-3 h-2.5 w-24 rounded bg-slate-300/70" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 md:mt-0 md:w-[380px] md:gap-3">
          <div className="h-14 rounded-xl bg-slate-300/60" />
          <div className="h-14 rounded-xl bg-slate-300/60" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ label }: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-4"
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-[92px] animate-pulse rounded-2xl border border-[#EDF0F6] bg-slate-100"
        />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
      <p className="font-['Manrope',sans-serif] text-[13px] font-extrabold text-[#0F1B2D]">
        {title}
      </p>
      <p className="mt-1 text-[10px] font-medium text-slate-400 md:text-[11px]">{description}</p>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-2xl border border-[#F3D5DA] bg-[#FFF7F8] px-4 py-6 text-center">
      <p className="font-['Manrope',sans-serif] text-[12px] font-extrabold text-[#B23A50]">
        {title}
      </p>
      <p className="mt-1 text-[10px] font-medium text-slate-500 md:text-[11px]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-xl border border-[#2156E8] px-4 py-2 text-[11px] font-bold text-[#2156E8] transition-colors hover:bg-[#EAF0FF]"
      >
        Retry
      </button>
    </div>
  );
}

interface LoadMoreErrorProps {
  message: string;
  onRetry: () => void;
}

export function LoadMoreError({ message, onRetry }: LoadMoreErrorProps) {
  return (
    <div
      role="alert"
      className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#F3D5DA] bg-[#FFF7F8] px-3.5 py-2.5 md:mt-5"
    >
      <p className="text-[10px] font-semibold text-[#B23A50] md:text-[11px]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-[#B23A50] px-3 py-1.5 text-[10px] font-bold text-[#B23A50] transition-colors hover:bg-[#FBE9EC] md:text-[11px]"
      >
        Try again
      </button>
    </div>
  );
}
