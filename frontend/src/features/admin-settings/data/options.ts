// Allowed lists for the dropdowns. Validation and the service both use these,
// so Sprint 3 only has to match this file for the real API to stay compatible.

export interface SelectOption {
  value: string;
  label: string;
}

export const TIME_ZONES: SelectOption[] = [
  { value: 'Asia/Colombo', label: 'Asia/Colombo (GMT +05:30)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT +05:30)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT +04:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT +08:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT +00:00)' },
  { value: 'UTC', label: 'UTC (GMT +00:00)' },
];

export const CURRENCIES: SelectOption[] = [
  { value: 'LKR', label: 'Sri Lankan Rupee (LKR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'INR', label: 'Indian Rupee (INR)' },
];

export const LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'si', label: 'Sinhala' },
  { value: 'ta', label: 'Tamil' },
];

export const DIGEST_FREQUENCIES: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

export const DEFAULT_ROLES: SelectOption[] = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'operator', label: 'Operator' },
  { value: 'admin', label: 'Administrator' },
];

export const GATEWAYS: SelectOption[] = [
  { value: 'payhere', label: 'PayHere' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'payoneer', label: 'Payoneer' },
];

export const SETTLEMENT_SCHEDULES: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
