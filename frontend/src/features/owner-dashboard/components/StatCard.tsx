import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  /** Pre-formatted value, e.g. "06", so this component stays purely presentational. */
  value: string;
  icon: LucideIcon;
  /** Tailwind classes tinting the icon chip (background + text colour). */
  iconClass: string;
}

export default function StatCard({ label, value, icon: Icon, iconClass }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#e4eaf3] bg-white p-5">
      <span className={`inline-grid h-9 w-9 place-items-center rounded-xl ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 font-['Manrope',sans-serif] text-2xl font-extrabold tracking-tight text-[#14213d]">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#6e7a91]">
        {label}
      </p>
    </div>
  );
}
