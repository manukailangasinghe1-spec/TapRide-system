export type TransactionKind =
  | 'top-up'
  | 'journey-fare'
  | 'hold-released'
  | 'offline'
  | 'refund';

export type TransactionStatus = 'COMPLETED' | 'PENDING SYNC' | 'REFUNDED';

export type MoneyDirection = 'credit' | 'debit';

export interface Transaction {
  id: string;
  kind: TransactionKind;
  title: string;
  subtitle: string;
  dateTime: string;
  amount: number | null;
  direction: MoneyDirection;
  status: TransactionStatus;
  hasReceipt?: boolean;
}

export interface Journey {
  id: string;
  routeNumber: string;
  from: string;
  to: string;
  dateTime: string;
  fare: number;
  status: TransactionStatus;
  hasReceipt: boolean;
}

export interface WalletSummary {
  totalTopUps: number;
  journeyFares: number;
  balance: number;
}

export type HistoryTab = 'transactions' | 'journeys';
