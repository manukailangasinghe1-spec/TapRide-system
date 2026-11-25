import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import BalanceCard from '../components/journey-history/BalanceCard';
import DemoDataBadge from '../components/journey-history/DemoDataBadge';
import HistoryTabs from '../components/journey-history/HistoryTabs';
import JourneyCard from '../components/journey-history/JourneyCard';
import LoadMoreButton from '../components/journey-history/LoadMoreButton';
import TransactionCard from '../components/journey-history/TransactionCard';
import {
  BalanceCardSkeleton,
  EmptyState,
  ErrorState,
  ListSkeleton,
  LoadMoreError,
} from '../components/journey-history/HistoryStates';
import { useHistoryList } from '../features/journey-history/hooks/useHistoryList';
import { useWalletSummary } from '../features/journey-history/hooks/useWalletSummary';
import {
  IS_DEMO_MODE,
  getJourneys,
  getTransactions,
} from '../features/journey-history/services/journeyHistoryService';
import type { HistoryTab } from '../features/journey-history/types';

const LIST_TITLE: Record<HistoryTab, string> = {
  transactions: 'Recent Transactions',
  journeys: 'Recent Journeys',
};

export default function JourneyHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HistoryTab>('transactions');
  const wallet = useWalletSummary();
  const transactions = useHistoryList(getTransactions);
  const journeys = useHistoryList(getJourneys);
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
            aria-disabled="true"
            aria-label="History options (not available yet)"
            title="History options (not available yet)"
            className="grid h-10 w-10 cursor-not-allowed place-items-center justify-self-end rounded-xl border border-slate-200/70 bg-[#F4F6FB] text-slate-400"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-4 pb-14 pt-3 sm:px-6 md:pt-6">
        {IS_DEMO_MODE && (
          <div className="mb-2 flex justify-end">
            <DemoDataBadge />
          </div>
        )}

        {wallet.status === 'loading' && (
          <BalanceCardSkeleton label="Loading wallet balance…" />
        )}
        {wallet.status === 'error' && (
          <ErrorState
            title="Couldn't load your wallet balance"
            message={wallet.error ?? 'Please try again.'}
            onRetry={wallet.reload}
          />
        )}
        {wallet.status === 'success' && wallet.summary && (
          <BalanceCard summary={wallet.summary} />
        )}

        <div className="mt-3.5 md:mt-5">
          <HistoryTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <section
          id="history-panel"
          role="tabpanel"
          aria-labelledby={`history-tab-${activeTab}`}
          aria-busy={
            isTransactionsTab
              ? transactions.status === 'loading'
              : journeys.status === 'loading'
          }
          className="mt-5"
        >
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <h2 className="font-['Manrope',sans-serif] text-[13px] font-extrabold md:text-[15px]">
              {LIST_TITLE[activeTab]}
            </h2>
            <span className="text-[9px] font-medium text-slate-400 md:text-[10px]">
              Latest activity
            </span>
          </div>

          {isTransactionsTab ? (
            <>
              {transactions.status === 'loading' && (
                <ListSkeleton label="Loading transactions…" />
              )}
              {transactions.status === 'error' && (
                <ErrorState
                  title="Couldn't load transactions"
                  message={transactions.error ?? 'Please try again.'}
                  onRetry={transactions.reload}
                />
              )}
              {transactions.status === 'success' && transactions.items.length === 0 && (
                <EmptyState
                  title="No transactions yet"
                  description="Your top-ups, fares, refunds and holds will appear here."
                />
              )}
              {transactions.status === 'success' && transactions.items.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-4">
                    {transactions.items.map((transaction) => (
                      <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                  {transactions.loadMoreError && (
                    <LoadMoreError
                      message={transactions.loadMoreError}
                      onRetry={transactions.loadMore}
                    />
                  )}
                  {transactions.hasMore && (
                    <LoadMoreButton
                      label="Load More Transactions"
                      loadingLabel="Loading transactions…"
                      isLoading={transactions.isLoadingMore}
                      onClick={transactions.loadMore}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {journeys.status === 'loading' && <ListSkeleton label="Loading journeys…" />}
              {journeys.status === 'error' && (
                <ErrorState
                  title="Couldn't load journeys"
                  message={journeys.error ?? 'Please try again.'}
                  onRetry={journeys.reload}
                />
              )}
              {journeys.status === 'success' && journeys.items.length === 0 && (
                <EmptyState
                  title="No journeys yet"
                  description="Trips you take with TapRide will appear here."
                />
              )}
              {journeys.status === 'success' && journeys.items.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-4">
                    {journeys.items.map((journey) => (
                      <JourneyCard key={journey.id} journey={journey} />
                    ))}
                  </div>
                  {journeys.loadMoreError && (
                    <LoadMoreError
                      message={journeys.loadMoreError}
                      onRetry={journeys.loadMore}
                    />
                  )}
                  {journeys.hasMore && (
                    <LoadMoreButton
                      label="Load More Journeys"
                      loadingLabel="Loading journeys…"
                      isLoading={journeys.isLoadingMore}
                      onClick={journeys.loadMore}
                    />
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
