import { Bus } from 'lucide-react';
import type { Journey } from '../../features/journey-history/types';
import { formatSignedAmount } from '../../features/journey-history/format';
import StatusBadge from './StatusBadge';

interface JourneyCardProps {
  journey: Journey;
}

export default function JourneyCard({ journey }: JourneyCardProps) {
  return (
    <article className="rounded-2xl border border-[#EDF0F6] bg-white p-3.5 shadow-[0_1px_2px_rgba(18,35,70,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(18,35,70,0.08)] md:p-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EAF0FF] text-[#275CE0]"
        >
          <Bus className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-['Manrope',sans-serif] text-[12px] font-extrabold text-[#0F1B2D] md:text-[13px]">
                {journey.routeNumber}
              </h3>
              <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500 md:text-[11px]">
                {journey.from} → {journey.to}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <p className="text-[9px] font-medium text-slate-400 md:text-[10px]">
                  {journey.dateTime}
                </p>
                {journey.hasReceipt && (
                  <button
                    type="button"
                    className="text-[#2156E8] hover:underline"
                    aria-label={`View digital receipt for ${journey.routeNumber}`}
                  >
                    <span className="text-[10px] font-semibold md:text-[11px]">
                      View digital receipt
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-[#E04D65] md:text-[12px]">
                {formatSignedAmount(journey.fare, 'debit')}
              </span>
              <StatusBadge status={journey.status} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
