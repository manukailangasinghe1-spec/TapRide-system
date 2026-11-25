import { formatDateTime } from '../format';
import {
  MOCK_JOURNEYS,
  MOCK_TRANSACTIONS,
  MOCK_WALLET_SUMMARY,
} from '../mockData';
import type {
  Journey,
  PageResult,
  Transaction,
  WalletSummary,
} from '../types';

// Mock rule: "true" always wins; otherwise only a dev build defaults to mocks.
// A production build calls the real API unless VITE_USE_MOCK is exactly "true".
const MOCK_FLAG: string | undefined = import.meta.env.VITE_USE_MOCK;
export const IS_DEMO_MODE: boolean =
  MOCK_FLAG === 'true' || (import.meta.env.DEV && MOCK_FLAG !== 'false');

// No trailing slash; the endpoint paths below include /api/v1 themselves.
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const PAGE_SIZE = 5;

const MOCK_DELAY_MS = 500;
const MOCK_SLOW_DELAY_MS = 2500;

type MockScenario = 'slow' | 'error' | 'empty' | 'loadmorefail' | null;

function getMockScenario(): MockScenario {
  if (!IS_DEMO_MODE || typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('mock');
  if (value === 'slow' || value === 'error' || value === 'empty' || value === 'loadmorefail') {
    return value;
  }
  return null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

interface ApiErrorBody {
  detail?: string;
}

// Wire shapes follow the FastAPI contract in docs/TAP-96-journey-history-api-contract.md.
interface WireWalletSummary {
  current_balance: number;
  total_top_ups: number;
  total_journey_fares: number;
  updated_at: string;
}

interface WireTransaction {
  id: string;
  kind: Transaction['kind'];
  title: string;
  subtitle: string;
  occurred_at: string;
  amount: number | null;
  direction: Transaction['direction'];
  status: Transaction['status'];
  has_receipt?: boolean;
}

interface WireJourney {
  id: string;
  route_number: string;
  from: string;
  to: string;
  occurred_at: string;
  fare: number;
  status: Journey['status'];
  has_receipt: boolean;
}

interface WirePage<T> {
  items: T[];
  page: number;
  page_size: number;
  has_more: boolean;
  next_page: number | null;
}

/** GET a JSON endpoint, surfacing FastAPI's {"detail": "..."} error text. */
async function fetchJson<T>(path: string): Promise<T> {
  // TODO(Sprint 3): attach the passenger's JWT as an Authorization header.
  // The passenger is always resolved from that JWT server-side, never from the URL.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.detail) detail = body.detail;
    } catch {
      // Body was not JSON; keep the HTTP status fallback message.
    }
    // TODO(Sprint 3): redirect to /login once the login/session flow exists.
    if (response.status === 401) {
      throw new Error(`Your session has expired. Please sign in again. (${detail})`);
    }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

function mapTransaction(wire: WireTransaction): Transaction {
  return {
    id: wire.id,
    kind: wire.kind,
    title: wire.title,
    subtitle: wire.subtitle,
    dateTime: formatDateTime(wire.occurred_at),
    amount: wire.amount,
    direction: wire.direction,
    status: wire.status,
    hasReceipt: wire.has_receipt ?? false,
  };
}

function mapJourney(wire: WireJourney): Journey {
  return {
    id: wire.id,
    routeNumber: wire.route_number,
    from: wire.from,
    to: wire.to,
    dateTime: formatDateTime(wire.occurred_at),
    fare: wire.fare,
    status: wire.status,
    hasReceipt: wire.has_receipt,
  };
}

async function fetchRealWalletSummary(): Promise<WalletSummary> {
  // TODO(Sprint 3): this is the single swap point for the wallet balance.
  const wire = await fetchJson<WireWalletSummary>('/api/v1/passenger/wallet/summary');
  return {
    currentBalance: wire.current_balance,
    totalTopUps: wire.total_top_ups,
    totalJourneyFares: wire.total_journey_fares,
    updatedAt: wire.updated_at,
  };
}

async function fetchRealTransactions(page: number): Promise<PageResult<Transaction>> {
  // TODO(Sprint 3): this is the single swap point for the transaction history.
  const wire = await fetchJson<WirePage<WireTransaction>>(
    `/api/v1/passenger/transactions?page=${page}&page_size=${PAGE_SIZE}`,
  );
  return {
    items: wire.items.map(mapTransaction),
    page: wire.page,
    pageSize: wire.page_size,
    hasMore: wire.has_more,
    nextPage: wire.next_page,
  };
}

async function fetchRealJourneys(page: number): Promise<PageResult<Journey>> {
  // TODO(Sprint 3): this is the single swap point for the journey history.
  const wire = await fetchJson<WirePage<WireJourney>>(
    `/api/v1/passenger/journeys?page=${page}&page_size=${PAGE_SIZE}`,
  );
  return {
    items: wire.items.map(mapJourney),
    page: wire.page,
    pageSize: wire.page_size,
    hasMore: wire.has_more,
    nextPage: wire.next_page,
  };
}

async function fetchMockWalletSummary(): Promise<WalletSummary> {
  const scenario = getMockScenario();
  if (scenario === 'slow') await delay(MOCK_SLOW_DELAY_MS);
  if (scenario === 'error') {
    throw new Error("We couldn't load your wallet balance. Please try again.");
  }
  await delay(MOCK_DELAY_MS);
  return { ...MOCK_WALLET_SUMMARY, updatedAt: new Date().toISOString() };
}

async function fetchMockPage<T>(
  all: readonly T[],
  page: number,
  label: 'transactions' | 'journeys',
): Promise<PageResult<T>> {
  const scenario = getMockScenario();
  if (scenario === 'slow') await delay(MOCK_SLOW_DELAY_MS);
  if (scenario === 'error') {
    throw new Error(`We couldn't load your ${label}. Please try again.`);
  }
  if (scenario === 'loadmorefail' && page > 1) {
    await delay(MOCK_DELAY_MS);
    throw new Error(`We couldn't load more ${label}. Please try again.`);
  }
  if (scenario === 'empty') {
    await delay(MOCK_DELAY_MS);
    return { items: [], page, pageSize: PAGE_SIZE, hasMore: false, nextPage: null };
  }

  await delay(MOCK_DELAY_MS);
  const start = (page - 1) * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < all.length;
  return {
    items,
    page,
    pageSize: PAGE_SIZE,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
}

/** The one place that decides where the wallet summary comes from. */
export function getWalletSummary(): Promise<WalletSummary> {
  return IS_DEMO_MODE ? fetchMockWalletSummary() : fetchRealWalletSummary();
}

/** The one place that decides where a transaction page comes from. */
export function getTransactions(page: number): Promise<PageResult<Transaction>> {
  return IS_DEMO_MODE
    ? fetchMockPage(MOCK_TRANSACTIONS, page, 'transactions')
    : fetchRealTransactions(page);
}

/** The one place that decides where a journey page comes from. */
export function getJourneys(page: number): Promise<PageResult<Journey>> {
  return IS_DEMO_MODE
    ? fetchMockPage(MOCK_JOURNEYS, page, 'journeys')
    : fetchRealJourneys(page);
}
