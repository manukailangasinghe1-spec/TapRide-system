import { SETTINGS_CATEGORIES } from '../data/categories';
import type { SettingsCategory } from '../types';

/**
 * The white "Settings" category card from the design. Desktop (>=1024px):
 * vertical list inside its card. Smaller screens: a horizontal scrollable tab
 * row so it never crushes the form below it.
 */
export function SettingsCategoryNav({
  active,
  onSelect,
}: {
  active: SettingsCategory;
  onSelect: (category: SettingsCategory) => void;
}) {
  return (
    <nav aria-label="Settings categories">
      {/* Mobile/tablet: scrollable tab row */}
      <div
        role="tablist"
        aria-label="Settings categories"
        className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
      >
        {SETTINGS_CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            onClick={() => onSelect(id)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-[12px] font-bold whitespace-nowrap transition ${
              active === id
                ? 'border-transparent bg-[#2156e8] text-white'
                : 'border-[#e4eaf3] bg-white text-[#4f5b71] hover:border-[#c6d2e8] hover:text-[#14213d]'
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Desktop: vertical list in a white card */}
      <div className="hidden rounded-xl border border-[#e4eaf3] bg-white p-3 lg:block">
        <p className="px-3 pt-2 pb-3 text-[12px] font-extrabold text-[#14213d]">Settings</p>
        <ul className="space-y-0.5">
          {SETTINGS_CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelect(id)}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                    isActive
                      ? 'bg-[#edf3ff] text-[#2156e8]'
                      : 'text-[#4f5b71] hover:bg-[#f5f8fd] hover:text-[#14213d]'
                  }`}
                >
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
