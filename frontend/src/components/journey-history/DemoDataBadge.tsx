export default function DemoDataBadge() {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full border border-[#F0D9A8] bg-[#FFF8E8] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8A6212]">
      <span aria-hidden="true">●</span>
      Demo data
      <span className="sr-only">Showing demo data, not live account activity.</span>
    </p>
  );
}
