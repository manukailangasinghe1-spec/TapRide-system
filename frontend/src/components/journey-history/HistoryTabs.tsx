import type { KeyboardEvent } from 'react';
import type { HistoryTab } from '../../features/journey-history/types';

const TABS: ReadonlyArray<{ id: HistoryTab; label: string }> = [
  { id: 'transactions', label: 'Transactions' },
  { id: 'journeys', label: 'Journeys' },
];

interface HistoryTabsProps {
  activeTab: HistoryTab;
  onChange: (tab: HistoryTab) => void;
}

export default function HistoryTabs({ activeTab, onChange }: HistoryTabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = TABS[nextIndex];
    onChange(nextTab.id);
    document.getElementById(`history-tab-${nextTab.id}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="History view"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200/80 bg-[#EFF3FA] p-1 md:max-w-md"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            id={`history-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="history-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`rounded-xl px-4 py-2.5 transition-colors ${
              isActive
                ? 'bg-white text-[#2156E8] shadow-[0_2px_8px_rgba(20,40,80,0.10)]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="text-[12px] font-bold md:text-[13px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
