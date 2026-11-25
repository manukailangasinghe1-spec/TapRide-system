import type { WalletSummary } from '../../features/journey-history/types';
import { formatCurrency, formatWholeCurrency } from '../../features/journey-history/format';

interface BalanceCardProps {
  summary: WalletSummary;
}

export default function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <section
      aria-label="Current wallet balance"
      className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2F6BF3] via-[#1F55E6] to-[#123BB8] px-5 py-5 text-white shadow-[0_18px_40px_rgba(29,80,224,0.24)] md:px-8 md:py-7"
    >
      <div aria-hidden="true" className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute -right-2 top-4 h-32 w-32 rounded-full border border-white/10" />

      <div className="relative z-10 md:flex md:items-end md:justify-between md:gap-10">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-100">
            Current wallet balance
          </p>
          <p className="mt-2 font-['Manrope',sans-serif] text-[32px] font-extrabold leading-none tracking-tight md:text-[40px]">
            {formatCurrency(summary.currentBalance)}
          </p>
          <p className="mt-2.5 text-[10px] font-medium text-blue-200">Updated just now</p>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2.5 md:mt-0 md:w-[380px] md:gap-3">
          <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm md:px-4 md:py-3">
            <dt className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-100 md:text-[9px]">
              Total top ups
            </dt>
            <dd className="mt-1 font-['Manrope',sans-serif] text-[13px] font-extrabold md:text-[15px]">
              {formatWholeCurrency(summary.totalTopUps)}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm md:px-4 md:py-3">
            <dt className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-100 md:text-[9px]">
              Journey fares
            </dt>
            <dd className="mt-1 font-['Manrope',sans-serif] text-[13px] font-extrabold md:text-[15px]">
              {formatWholeCurrency(summary.totalJourneyFares)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
