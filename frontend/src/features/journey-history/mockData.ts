import type { Journey, Transaction, WalletSummary } from './types';

export const INITIAL_VISIBLE_TRANSACTIONS = 5;
export const TRANSACTIONS_PER_PAGE = 4;

export const MOCK_TRANSACTIONS: readonly Transaction[] = [
  {
    id: 'txn-topup-1000',
    kind: 'top-up',
    title: 'Wallet Top Up',
    subtitle: 'Payment gateway',
    dateTime: '29 Aug 2026 · 09:42 AM',
    amount: 1000,
    direction: 'credit',
    status: 'COMPLETED',
  },
  {
    id: 'txn-fare-52',
    kind: 'journey-fare',
    title: 'Journey Fare',
    subtitle: 'Route 138 · Colombo Fort → Kaduwela',
    dateTime: '29 Aug 2026 · 11:18 AM',
    amount: 52,
    direction: 'debit',
    status: 'COMPLETED',
    hasReceipt: true,
  },
  {
    id: 'txn-hold-released-148',
    kind: 'hold-released',
    title: 'Hold Released',
    subtitle: 'Unused maximum-fare amount released',
    dateTime: '29 Aug 2026 · 11:18 AM',
    amount: 148,
    direction: 'credit',
    status: 'COMPLETED',
  },
  {
    id: 'txn-offline-pending',
    kind: 'offline',
    title: 'Offline Transaction',
    subtitle: 'Stored locally · Waiting for sync',
    dateTime: '28 Aug 2026 · 08:35 PM',
    amount: null,
    direction: 'debit',
    status: 'PENDING SYNC',
  },
  {
    id: 'txn-refund-25',
    kind: 'refund',
    title: 'Fare Refund',
    subtitle: 'Fare adjustment',
    dateTime: '27 Aug 2026 · 03:12 PM',
    amount: 25,
    direction: 'credit',
    status: 'REFUNDED',
  },
  {
    id: 'txn-topup-4000',
    kind: 'top-up',
    title: 'Wallet Top Up',
    subtitle: 'Payment gateway',
    dateTime: '26 Aug 2026 · 07:05 PM',
    amount: 4000,
    direction: 'credit',
    status: 'COMPLETED',
  },
  {
    id: 'txn-fare-1250',
    kind: 'journey-fare',
    title: 'Journey Fare',
    subtitle: 'Route 2 · Colombo Fort → Kandy',
    dateTime: '26 Aug 2026 · 06:22 PM',
    amount: 1250,
    direction: 'debit',
    status: 'COMPLETED',
    hasReceipt: true,
  },
  {
    id: 'txn-fare-900',
    kind: 'journey-fare',
    title: 'Journey Fare',
    subtitle: 'Route 240 · Pettah → Negombo',
    dateTime: '25 Aug 2026 · 08:14 AM',
    amount: 900,
    direction: 'debit',
    status: 'COMPLETED',
    hasReceipt: true,
  },
  {
    id: 'txn-fare-400',
    kind: 'journey-fare',
    title: 'Journey Fare',
    subtitle: 'Route 154 · Kaduwela → Colombo Fort',
    dateTime: '25 Aug 2026 · 07:40 AM',
    amount: 400,
    direction: 'debit',
    status: 'COMPLETED',
    hasReceipt: true,
  },
];

export const MOCK_JOURNEYS: readonly Journey[] = [
  {
    id: 'journey-138-29am',
    routeNumber: 'Route 138',
    from: 'Colombo Fort',
    to: 'Kaduwela',
    dateTime: '29 Aug 2026 · 11:18 AM',
    fare: 52,
    status: 'COMPLETED',
    hasReceipt: true,
  },
  {
    id: 'journey-154-29am',
    routeNumber: 'Route 154',
    from: 'Kaduwela',
    to: 'Colombo Fort',
    dateTime: '29 Aug 2026 · 06:47 AM',
    fare: 52,
    status: 'COMPLETED',
    hasReceipt: true,
  },
  {
    id: 'journey-177-28pm',
    routeNumber: 'Route 177',
    from: 'Kollupitiya',
    to: 'Kaduwela',
    dateTime: '28 Aug 2026 · 05:12 PM',
    fare: 65,
    status: 'PENDING SYNC',
    hasReceipt: false,
  },
  {
    id: 'journey-138-27am',
    routeNumber: 'Route 138',
    from: 'Colombo Fort',
    to: 'Kaduwela',
    dateTime: '27 Aug 2026 · 07:30 AM',
    fare: 52,
    status: 'COMPLETED',
    hasReceipt: true,
  },
  {
    id: 'journey-100-26pm',
    routeNumber: 'Route 100',
    from: 'Pettah',
    to: 'Panadura',
    dateTime: '26 Aug 2026 · 04:05 PM',
    fare: 120,
    status: 'COMPLETED',
    hasReceipt: true,
  },
];

export function getWalletSummary(transactions: readonly Transaction[]): WalletSummary {
  let totalTopUps = 0;
  let journeyFares = 0;

  for (const transaction of transactions) {
    if (transaction.status !== 'COMPLETED' || transaction.amount === null) continue;

    if (transaction.kind === 'top-up' && transaction.direction === 'credit') {
      totalTopUps += transaction.amount;
    }

    if (transaction.kind === 'journey-fare' && transaction.direction === 'debit') {
      journeyFares += transaction.amount;
    }
  }

  return {
    totalTopUps,
    journeyFares,
    balance: totalTopUps - journeyFares,
  };
}
