import { Link } from 'react-router-dom';
import { Bus, ChevronRight } from 'lucide-react';
import type { BusStatus } from '../types';

// Status -> display label + pill colours in one lookup table, so the row
// markup below stays flat and easy to read.
const STATUS_STYLES: Record<BusStatus, { label: string; pillClass: string }> = {
  'on-time': { label: 'ON TIME', pillClass: 'bg-[#e8fbf1] text-[#168454]' },
  'in-transit': { label: 'IN TRANSIT', pillClass: 'bg-[#e8fbf1] text-[#168454]' },
  delayed: { label: 'DELAYED', pillClass: 'bg-[#fff4e5] text-[#c88921]' },
  idle: { label: 'IDLE', pillClass: 'bg-[#f0f2f7] text-[#6e7a91]' },
  maintenance: { label: 'MAINTENANCE', pillClass: 'bg-[#f0f2f7] text-[#6e7a91]' },
};

export interface BusRowData {
  id: string;
  plate: string;
  route: string;
  passengersToday: number | null;
  status: BusStatus;
  revenueToday: number | null;
}

interface ActiveBusesSectionProps {
  buses: BusRowData[];
}

export default function ActiveBusesSection({ buses }: ActiveBusesSectionProps) {
  return (
    <section aria-labelledby="buses-heading" className="flex h-full flex-col rounded-2xl border border-[#e4eaf3] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 id="buses-heading" className="font-['Manrope',sans-serif] text-sm font-extrabold text-[#14213d]">
          Active Buses
        </h3>
        <Link
          to="/owner/fleet"
          className="flex items-center gap-0.5 text-[11px] font-bold text-[#2156e8] hover:underline"
        >
          View all
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-2 divide-y divide-[#eef2f8]">
        {buses.map((bus) => {
          const status = STATUS_STYLES[bus.status];
          return (
            <li key={bus.id} className="flex items-center gap-3 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#edf3ff] text-[#2459dc]">
                <Bus className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-['Manrope',sans-serif] text-[13px] font-extrabold text-[#14213d]">{bus.plate}</p>
                <p className="truncate text-[11px] text-[#6e7a91]">{bus.route}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="font-['Manrope',sans-serif] text-sm font-extrabold text-[#14213d]">
                  {bus.passengersToday ?? '—'}
                </p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${status.pillClass}`}>
                  {status.label}
                </span>
                {bus.revenueToday !== null && (
                  <p className="text-[9px] font-semibold text-[#159568]">
                    Rs {bus.revenueToday.toLocaleString('en-US')}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
