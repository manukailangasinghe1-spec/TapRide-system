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
