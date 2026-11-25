import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// The six quick-action modules all land here until their Sprint 3 pages exist.
const MODULE_LABELS: Record<string, string> = {
  fleet: 'Fleet',
  crew: 'Crew',
  reports: 'Reports',
  maintenance: 'Maintenance',
  schedules: 'Schedules',
  alerts: 'Alerts',
};

export default function OwnerModulePlaceholder() {
  const { module = '' } = useParams();
  const label = MODULE_LABELS[module];

  // Unknown module name -> send the user back to the dashboard.
  if (!label) {
    return <Navigate to="/owner/dashboard" replace />;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f9fd] px-4 text-[#14213d]">
      <div className="w-full max-w-md rounded-2xl border border-[#e4eaf3] bg-white p-10 text-center">
        <p className="font-['Manrope',sans-serif] text-lg font-extrabold">{label} module coming in Sprint 3</p>
        <p className="mt-2 text-xs leading-relaxed text-[#6e7a91]">
          This screen is part of the owner portal roadmap. The dashboard below is live with today&rsquo;s data.
        </p>
        <Link
          to="/owner/dashboard"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#2156e8] px-5 text-xs font-bold text-white shadow-lg shadow-[#2156e8]/25 transition hover:bg-[#1644ca]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
