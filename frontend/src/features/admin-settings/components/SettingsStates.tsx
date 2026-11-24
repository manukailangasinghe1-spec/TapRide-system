import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, RefreshCw, X, XCircle } from 'lucide-react';
import type { Notice } from '../hooks/useAdminSettings';

// Loading skeleton for the settings page (visible with ?mock=slow).
export function SettingsSkeleton() {
  return (
    <div aria-label="Loading settings" className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="h-72 animate-pulse rounded-xl border border-[#e4eaf3] bg-white" />
      <div className="space-y-4 rounded-xl border border-[#e4eaf3] bg-white p-6">
        <div className="h-4 w-40 animate-pulse rounded bg-[#eef2f8]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-16 animate-pulse rounded-lg bg-[#eef2f8]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#eef2f8]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#eef2f8]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#eef2f8]" />
        </div>
        <div className="h-24 animate-pulse rounded-lg bg-[#eef2f8]" />
        <div className="h-12 animate-pulse rounded-lg bg-[#eef2f8]" />
      </div>
    </div>
  );
}

// Full-page load error (visible with ?mock=error), with a retry button.
export function SettingsLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-xl border border-[#e4eaf3] bg-white px-6 py-12 text-center">
      <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#fdeef0] text-[#e04d65]">
        <AlertTriangle size={22} />
      </span>
      <h2 className="font-['Manrope',sans-serif] text-[15px] font-extrabold text-[#14213d]">
        Couldn&apos;t load settings
      </h2>
      <p className="mt-2 text-[12px] leading-relaxed text-[#6e7a91]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2156e8] px-5 text-[12px] font-bold text-white transition hover:bg-[#1644ca]"
      >
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );
}

const NOTICE_STYLES: Record<Notice['kind'], { icon: typeof CheckCircle2; iconClass: string }> = {
  success: { icon: CheckCircle2, iconClass: 'bg-[#e5f8ef] text-[#169966]' },
  error: { icon: XCircle, iconClass: 'bg-[#fdeef0] text-[#e04d65]' },
  info: { icon: Info, iconClass: 'bg-[#edf3ff] text-[#2156e8]' },
};

// Fixed bottom-right toast. Success/info auto-dismiss after ~4s; errors stay
// until the user dismisses them. role="status" + aria-live announce it.
export function Toast({ notice, onDismiss }: { notice: Notice | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!notice || notice.kind === 'error') return; // errors persist
    const timer = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  const { icon: Icon, iconClass } = NOTICE_STYLES[notice.kind];
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm items-center gap-3 rounded-xl border border-[#e4eaf3] bg-white p-3.5 pr-2 shadow-[0_18px_55px_#081a3b25]"
    >
      <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconClass}`}>
        <Icon size={16} />
      </span>
      <p className="flex-1 text-[12px] leading-snug font-semibold text-[#14213d]">{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[#8591a5] transition hover:bg-[#f2f5fa] hover:text-[#14213d]"
      >
        <X size={15} />
      </button>
    </div>
  );
}
