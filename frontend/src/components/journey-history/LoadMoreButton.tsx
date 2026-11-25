interface LoadMoreButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  onClick: () => void;
}

export default function LoadMoreButton({
  label,
  loadingLabel,
  isLoading,
  onClick,
}: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className="mt-3.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition-colors hover:border-[#2156E8] hover:text-[#2156E8] disabled:cursor-not-allowed disabled:border-slate-200/70 disabled:text-slate-400 md:mt-5"
    >
      <span className="text-[12px] font-bold">{isLoading ? loadingLabel : label}</span>
    </button>
  );
}
