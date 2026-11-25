import { Zap } from 'lucide-react';
import type { RevenueSummary } from '../types';

interface RevenueCardProps {
  revenue: RevenueSummary;
}

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-US')}`;
}

export default function RevenueCard({ revenue }: RevenueCardProps) {
  // Bar heights are percentages of the tallest bar, so the chart scales to
  // any data. Math.max(..., 1) avoids dividing by zero when all values are 0.
  const maxAmount = Math.max(...revenue.bars.map((bar) => bar.amount), 1);
  const peak = revenue.bars.reduce((top, bar) => (bar.amount > top.amount ? bar : top), revenue.bars[0]);

  // Screen-reader equivalent of the bar chart (rule 7: accessible data viz).
  const chartSummary = peak
    ? `Bar chart of today's fare revenue by time of day. Total ${formatRs(revenue.todayTotal)}, ` +
      `peaking at ${peak.label} with ${formatRs(peak.amount)}.`
    : 'Bar chart of today’s fare revenue. No revenue recorded yet.';

  return (
    <section aria-labelledby="revenue-heading" className="flex h-full flex-col rounded-2xl bg-gradient-to-br from-[#2158e8] to-[#153db7] p-6 text-white shadow-lg shadow-[#2156e8]/20">
      <h3 id="revenue-heading" className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#b9ccff]">
        Today&rsquo;s Fare Revenue
      </h3>
      <p className="mt-2 font-['Manrope',sans-serif] text-3xl font-extrabold tracking-tight">
        {formatRs(revenue.todayTotal)}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#8ef0c0]">
        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
        {revenue.comparisonPct}% compared with yesterday
      </p>

      <p className="sr-only">{chartSummary}</p>
      <div
        role="img"
        aria-label={chartSummary}
        className="mt-auto flex h-28 items-end gap-[3px] pt-6"
      >
        {revenue.bars.map((bar) => (
          <div
            key={bar.label}
            title={`${bar.label}: ${formatRs(bar.amount)}`}
            className="flex-1 rounded-t-[2px] transition-all hover:opacity-80"
            style={{
              height: `${Math.max((bar.amount / maxAmount) * 100, 3)}%`,
              background: bar.highlight ? '#ffffff' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="mt-1 flex gap-[3px]">
        {revenue.bars.map((bar) => (
          <span key={bar.label} className="flex-1 text-center text-[8px] font-semibold text-[#9db9ff]">
            {bar.label}
          </span>
        ))}
      </div>
    </section>
  );
}
