import {
  fetchMockAuditLogs,
  fetchMockSettings,
  saveMockSettings,
} from '../data/mockSettings';
import type {
  AuditLogPage,
  SaveableCategory,
  SystemSettings,
} from '../types';

// Vite exposes env vars as strings, so import.meta.env.VITE_USE_MOCK is
// 'true' | 'false' | undefined. Only the exact string 'false' disables mocks.
const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK !== 'false';
// No trailing slash; the endpoint paths below include /api/v1 themselves.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface ApiErrorBody {
  detail?: string;
}

// Wire shapes follow the FastAPI contract in docs/TAP-92-admin-settings-api-contract.md.
interface WireSettings extends Omit<SystemSettings, 'lastUpdatedAt'> {
  last_updated_at: string;
}

interface WireAuditChange {
  field: string;
  from: string;
  to: string;
}

interface WireAuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: SaveableCategory;
  details: string;
  changes: WireAuditChange[];
}

interface WireAuditLogPage {
  entries: WireAuditLogEntry[];
  total: number;
  page: number;
  page_size: number;
}

/** GET or PUT a JSON endpoint, surfacing FastAPI's {"detail": "..."} error text. */
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.detail) detail = body.detail;
    } catch {
      // Body was not JSON; keep the HTTP status fallback message.
    }
    // TODO(Sprint 3): redirect to /login once real JWT auth is wired.
    if (response.status === 401) {
      throw new Error(`Session expired (401): ${detail}`);
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

function wireToSettings(wire: WireSettings): SystemSettings {
  const { last_updated_at, ...rest } = wire;
  return { ...rest, lastUpdatedAt: last_updated_at };
}

function settingsToWire(settings: SystemSettings): WireSettings {
  const { lastUpdatedAt, ...rest } = settings;
  return { ...rest, last_updated_at: lastUpdatedAt };
}

async function fetchRealSettings(): Promise<SystemSettings> {
  // TODO(Sprint 3): this is the single swap point for loading settings.
  const wire = await fetchJson<WireSettings>('/api/v1/admin/settings');
  return wireToSettings(wire);
}

async function saveRealSettings(settings: SystemSettings): Promise<SystemSettings> {
  // TODO(Sprint 3): this is the single swap point for saving settings.
  // The server validates, persists AND writes the audit entry itself;
  // the client never sends audit data.
  const wire = await fetchJson<WireSettings>('/api/v1/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsToWire(settings)),
  });
  return wireToSettings(wire);
}

async function fetchRealAuditLogs(page: number): Promise<AuditLogPage> {
  // TODO(Sprint 3): this is the single swap point for the audit log list.
  const wire = await fetchJson<WireAuditLogPage>(
    `/api/v1/admin/audit-logs?page=${page}&page_size=50`,
  );
  return {
    entries: wire.entries,
    total: wire.total,
    page: wire.page,
    pageSize: wire.page_size,
  };
}

/** The one place that decides where system settings come from. */
export function getSettings(): Promise<SystemSettings> {
  return USE_MOCK ? fetchMockSettings() : fetchRealSettings();
}

/** The one place that decides how system settings are saved. */
export function saveSettings(
  settings: SystemSettings,
  category: SaveableCategory,
  changes: Array<{ field: string; from: string; to: string }>,
): Promise<SystemSettings> {
  return USE_MOCK ? saveMockSettings(settings, category, changes) : saveRealSettings(settings);
}

/** The one place that decides where audit log entries come from. */
export function getAuditLogs(page = 1): Promise<AuditLogPage> {
  return USE_MOCK ? fetchMockAuditLogs() : fetchRealAuditLogs(page);
}
