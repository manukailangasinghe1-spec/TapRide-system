import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import BalanceCard from '../components/journey-history/BalanceCard';
import HistoryTabs from '../components/journey-history/HistoryTabs';
import JourneyCard from '../components/journey-history/JourneyCard';
import TransactionCard from '../components/journey-history/TransactionCard';
import {
  INITIAL_VISIBLE_TRANSACTIONS,
  MOCK_JOURNEYS,
  MOCK_TRANSACTIONS,
  TRANSACTIONS_PER_PAGE,
  getWalletSummary,
} from '../features/journey-history/mockData';
import type { HistoryTab } from '../features/journey-history/types';

export default function JourneyHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HistoryTab>('transactions');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TRANSACTIONS);

  const summary = getWalletSummary(MOCK_TRANSACTIONS);
  const visibleTransactions = MOCK_TRANSACTIONS.slice(0, visibleCount);
  const hasMoreTransactions = visibleCount < MOCK_TRANSACTIONS.length;
  const isTransactionsTab = activeTab === 'transactions';

  const handleBack = () => {
    const historyState = window.history.state as { idx?: number } | null;
    if (historyState && typeof historyState.idx === 'number' && historyState.idx > 0) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1B2D] md:bg-[#F5F7FB]">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-[70px] max-w-[1100px] grid-cols-[40px_1fr_40px] items-center gap-3 px-4 sm:px-6 md:h-[76px]">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-[#F4F6FB] text-slate-600 transition-colors hover:bg-[#E9EEF8] hover:text-slate-900"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="font-['Manrope',sans-serif] text-[17px] font-extrabold tracking-tight md:text-[19px]">
              History
            </h1>
            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
              TapRide · Transactions &amp; journeys
            </p>
          </div>

          <button
            type="button"
            aria-label="Open history options"
            className="grid h-10 w-10 place-items-center justify-self-end rounded-xl border border-slate-200/80 bg-[#F4F6FB] text-slate-600 transition-colors hover:bg-[#E9EEF8] hover:text-slate-900"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-4 pb-14 pt-3 sm:px-6 md:pt-6">
        <BalanceCard summary={summary} />

        <div className="mt-3.5 md:mt-5">
          <HistoryTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <section
          id="history-panel"
          role="tabpanel"
          aria-labelledby={`history-tab-${activeTab}`}
          className="mt-5"
        >
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <h2 className="font-['Manrope',sans-serif] text-[13px] font-extrabold md:text-[15px]">
              {isTransactionsTab ? 'Recent Transactions' : 'Recent Journeys'}
            </h2>
            <span className="text-[9px] font-medium text-slate-400 md:text-[10px]">
              Latest activity
            </span>
          </div>

          {isTransactionsTab ? (
            <>
              <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-4">
                {visibleTransactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) =>
                    Math.min(count + TRANSACTIONS_PER_PAGE, MOCK_TRANSACTIONS.length),
                  )
                }
                disabled={!hasMoreTransactions}
                className={`mt-3.5 w-full rounded-xl border bg-white px-4 py-3 transition-colors md:mt-5 ${
                  hasMoreTransactions
                    ? 'border-slate-200 text-slate-700 hover:border-[#2156E8] hover:text-[#2156E8]'
                    : 'cursor-not-allowed border-slate-200/70 text-slate-400'
                }`}
              >
                <span className="text-[12px] font-bold">
                  {hasMoreTransactions ? 'Load More Transactions' : 'All transactions loaded'}
                </span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-4">
              {MOCK_JOURNEYS.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
