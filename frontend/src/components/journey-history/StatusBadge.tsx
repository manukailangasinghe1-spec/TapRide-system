import type { TransactionStatus } from '../../features/journey-history/types';

const statusClasses: Record<TransactionStatus, string> = {
  COMPLETED: 'bg-[#E7F8EF] text-[#159568]',
  'PENDING SYNC': 'bg-[#FFF2E3] text-[#C77A1B]',
  REFUNDED: 'bg-[#EAF0FF] text-[#275CE0]',
};

interface StatusBadgeProps {
  status: TransactionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] md:text-[9px] ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
