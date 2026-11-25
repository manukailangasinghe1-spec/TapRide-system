import { useCallback, useEffect, useState } from 'react';
import { getWalletSummary } from '../services/journeyHistoryService';
import type { LoadStatus, WalletSummary } from '../types';

export interface WalletSummaryState {
  status: LoadStatus;
  summary: WalletSummary | null;
  error: string | null;
  reload: () => void;
}

export function useWalletSummary(): WalletSummaryState {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // .then/.catch keep the setState calls out of the effect's synchronous body,
  // which satisfies the react-hooks lint rule for the mount effect below.
  const load = useCallback((): Promise<void> => {
    return getWalletSummary()
      .then((data) => {
        setSummary(data);
        setError(null);
        setStatus('success');
      })
      .catch((cause: unknown) => {
        setError(
          cause instanceof Error ? cause.message : 'Failed to load your wallet balance.',
        );
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reload = useCallback(() => {
    setStatus('loading');
    setError(null);
    void load();
  }, [load]);

  return { status, summary, error, reload };
}
