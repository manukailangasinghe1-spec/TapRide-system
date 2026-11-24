import { useCallback, useEffect, useState } from 'react';
import { getAuditLogs } from '../services/adminSettingsService';
import type { AuditLogPage, LoadStatus } from '../types';

/** Loads the system audit log and exposes reload for the error state's retry. */
export function useAuditLogs() {
  const [status, setStatus] = useState<LoadStatus>('loading'); // first load starts immediately
  const [data, setData] = useState<AuditLogPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // .then chains (not async/await) keep the setState calls out of the effect's
  // synchronous body, which satisfies the react-hooks lint rule.
  const applyLogs = useCallback((): Promise<void> => {
    return getAuditLogs(1)
      .then((page) => {
        setData(page);
        setError(null);
        setStatus('success');
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load audit logs.');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    void applyLogs();
  }, [applyLogs]);

  // Runs from the retry button's click event, so sync setState here is fine.
  const reload = useCallback(() => {
    setStatus('loading');
    setError(null);
    void applyLogs();
  }, [applyLogs]);

  return { status, data, error, reload };
}

