import type { MoneyDirection } from './types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const amountFormatter = new Intl.NumberFormat('en-US');

export function formatCurrency(amount: number): string {
  return `Rs. ${currencyFormatter.format(amount)}`;
}

export function formatWholeCurrency(amount: number): string {
  return `Rs. ${amountFormatter.format(amount)}`;
}

export function formatSignedAmount(amount: number, direction: MoneyDirection): string {
  const sign = direction === 'credit' ? '+' : '-';
  return `${sign}Rs. ${amountFormatter.format(amount)}`;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
}
