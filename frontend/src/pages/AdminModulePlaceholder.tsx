// Shared placeholder for admin pages owned by other tickets. Explicit routes
// in App.tsx point here until those features are built.
export default function AdminModulePlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-5">
        <h2 className="font-['Manrope',sans-serif] text-[19px] font-extrabold tracking-[-0.3px] text-[#14213d]">
          {title}
        </h2>
        <p className="mt-0.5 text-[11.5px] text-[#8a96a9]">Manage {title.toLowerCase()} across the TapRide system.</p>
      </div>
      <div className="grid place-items-center rounded-xl border border-[#e4eaf3] bg-white px-6 py-20 text-center">
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#edf3ff] font-['Manrope',sans-serif] text-[16px] font-extrabold text-[#2156e8]">
          {title.charAt(0)}
        </span>
        <h3 className="text-[14px] font-extrabold text-[#14213d]">{title} coming soon</h3>
        <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed text-[#6e7a91]">
          This admin module is under development in a separate sprint ticket and will be available
          here soon.
        </p>
      </div>
    </div>
  );
}
