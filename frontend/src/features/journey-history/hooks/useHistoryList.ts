import { useCallback, useEffect, useState } from 'react';
import type { LoadStatus, PageResult } from '../types';

export interface HistoryListState<T> {
  status: LoadStatus;
  items: T[];
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  reload: () => void;
  loadMore: () => void;
}

function toMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback;
}

export function useHistoryList<T>(
  fetchPage: (page: number) => Promise<PageResult<T>>,
): HistoryListState<T> {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const loadFirstPage = useCallback((): Promise<void> => {
    return fetchPage(1)
      .then((result) => {
        setItems(result.items);
        setHasMore(result.hasMore);
        setNextPage(result.nextPage);
        setError(null);
        setStatus('success');
      })
      .catch((cause: unknown) => {
        setError(toMessage(cause, 'We could not load this history. Please try again.'));
        setStatus('error');
      });
  }, [fetchPage]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  const reload = useCallback(() => {
    setStatus('loading');
    setItems([]);
    setError(null);
    setHasMore(false);
    setNextPage(1);
    setLoadMoreError(null);
    void loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = useCallback(() => {
    if (nextPage === null || isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    fetchPage(nextPage)
      .then((result) => {
        setItems((current) => [...current, ...result.items]);
        setHasMore(result.hasMore);
        setNextPage(result.nextPage);
      })
      .catch((cause: unknown) => {
        setLoadMoreError(toMessage(cause, 'We could not load more. Please try again.'));
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  }, [fetchPage, nextPage, isLoadingMore]);

  return {
    status,
    items,
    error,
    hasMore,
    isLoadingMore,
    loadMoreError,
    reload,
    loadMore,
  };
}
