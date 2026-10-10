import type { BusRoute, PassengerProfile, Seat, Transaction } from '../types/passenger';

// Dynamic dates helper
const now = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const formatShortDate = (d: Date) =>
  d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

const todayStr = formatDate(now);
const futureExpiryStr = formatDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));

export const initialPassengerProfile: PassengerProfile = {
  name: 'Kasun Perera',
  username: 'Your Username',
  email: 'kasun.perera@tapride.lk',
  phone: '+94 77 123 4567',
  walletNumber: '•••• 4827',
  balance: 2450.0,
  isPassHolder: true,
  passType: '30-Day Monthly Season Pass',
  passExpiry: futureExpiryStr,
  monthlySpent: 3150,
  monthlyTarget: 5000,
  monthlyTrips: 28,
};

export const sampleRoutes: BusRoute[] = [
  {
    id: 'route-1',
    name: 'Anuradhapura ➔ Polonnaruwa (Rajarata Express - N64)',
    busName: 'Rajarata Express',
    busNumber: 'ND-4492',
    from: 'Anuradhapura Main Stand',
    to: 'Polonnaruwa Town Terminal',
    date: todayStr,
    departureTime: '06:00 AM',
    arrivalTime: '08:45 AM',
    baseFare: 150.0,
    availableSeats: 15,
  },
  {
    id: 'route-2',
    name: 'Colombo Fort ➔ Kandy (Intercity Express - E01)',
    busName: 'Hill Country Superline',
    busNumber: 'WP-8812',
    from: 'Colombo Fort Central',
    to: 'Kandy Goods Shed',
    date: todayStr,
    departureTime: '07:15 AM',
    arrivalTime: '10:00 AM',
    baseFare: 420.0,
    availableSeats: 12,
  },
  {
    id: 'route-3',
    name: 'Galle ➔ Matara (Southern Coastal Fast - EX02)',
    busName: 'Ruhunu Express',
    busNumber: 'SP-1903',
    from: 'Galle Bus Stand',
    to: 'Matara Main Station',
    date: todayStr,
    departureTime: '08:30 AM',
    arrivalTime: '09:20 AM',
    baseFare: 110.0,
    availableSeats: 18,
  },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'fare',
    title: 'Bus Fare',
    subtitle: `Today · 08:42 AM`,
    timestamp: `${todayStr} 08:42 AM`,
    amount: 85.0,
    isDebit: true,
    reference: 'TR-782190',
    status: 'completed',
  },
  {
    id: 'tx-2',
    type: 'fare',
    title: 'Bus Fare',
    subtitle: `Yesterday · 04:26 PM`,
    timestamp: `${formatDate(new Date(now.getTime() - 86400000))} 04:26 PM`,
    amount: 120.0,
    isDebit: true,
    reference: 'TR-781042',
    status: 'completed',
  },
  {
    id: 'tx-3',
    type: 'topup',
    title: 'Wallet Top-up',
    subtitle: `${formatShortDate(new Date(now.getTime() - 2 * 86400000))} · 11:15 AM`,
    timestamp: `${formatDate(new Date(now.getTime() - 2 * 86400000))} 11:15 AM`,
    amount: 1000.0,
    isDebit: false,
    reference: 'PAY-904128',
    status: 'completed',
  },
  {
    id: 'tx-4',
    type: 'fare',
    title: 'Bus Fare',
    subtitle: `${formatShortDate(new Date(now.getTime() - 3 * 86400000))} · 07:45 AM`,
    timestamp: `${formatDate(new Date(now.getTime() - 3 * 86400000))} 07:45 AM`,
    amount: 85.0,
    isDebit: true,
    reference: 'TR-779810',
    status: 'completed',
  },
  {
    id: 'tx-5',
    type: 'fare',
    title: 'Express Highway Fare',
    subtitle: `${formatShortDate(new Date(now.getTime() - 4 * 86400000))} · 06:10 PM`,
    timestamp: `${formatDate(new Date(now.getTime() - 4 * 86400000))} 06:10 PM`,
    amount: 250.0,
    isDebit: true,
    reference: 'TR-776492',
    status: 'completed',
  },
  {
    id: 'tx-6',
    type: 'topup',
    title: 'Commercial Bank Direct Pay',
    subtitle: `${formatShortDate(new Date(now.getTime() - 7 * 86400000))} · 02:30 PM`,
    timestamp: `${formatDate(new Date(now.getTime() - 7 * 86400000))} 02:30 PM`,
    amount: 2000.0,
    isDebit: false,
    reference: 'COMB-39182',
    status: 'completed',
  },
];

// Generates 50 seats (A01 - A50) exactly matching Figma design:
// Rows 1-6 (A01-A30): Season Pass reserved (yellow PASS)
// Rows 7-10 (A31-A50): Open spot inventory with taken seats: A35, A36, A42, A45, A49
export const generateInitialSeats = (baseFare: number = 150): Seat[] => {
  const seats: Seat[] = [];
  const takenSeatIds = new Set(['A35', 'A36', 'A42', 'A45', 'A49']);

  for (let i = 1; i <= 50; i++) {
    const id = `A${i.toString().padStart(2, '0')}`;
    const isSeasonPass = i <= 30;

    let status: Seat['status'] = 'available';
    if (isSeasonPass) {
      status = 'pending'; // Represents PASS reserved
    } else if (takenSeatIds.has(id)) {
      status = 'sold_out'; // Represents TAKEN
    }

    seats.push({
      id,
      label: isSeasonPass ? 'PASS' : takenSeatIds.has(id) ? 'TAKEN' : 'OPEN',
      category: isSeasonPass ? 'season_pass' : 'spot',
      status,
      price: baseFare,
    });
  }

  return seats;
};
