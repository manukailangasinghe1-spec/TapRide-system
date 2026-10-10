import type { BusRoute, PassengerProfile, Seat, Transaction } from '../types/passenger';

export const initialPassengerProfile: PassengerProfile = {
  name: 'Kasun Perera',
  username: 'Your Username',
  email: 'kasun.perera@tapride.lk',
  phone: '+94 77 123 4567',
  walletNumber: '•••• 4827',
  balance: 2450.0,
  isPassHolder: true,
  passType: '30-Day Monthly Season Pass',
  passExpiry: '2026-08-31',
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
    date: '2026-08-13',
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
    date: '2026-08-13',
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
    date: '2026-08-13',
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
    subtitle: 'Today · 08:42 AM',
    timestamp: '2026-08-12 08:42 AM',
    amount: 85.0,
    isDebit: true,
    reference: 'TR-782190',
    status: 'completed',
  },
  {
    id: 'tx-2',
    type: 'fare',
    title: 'Bus Fare',
    subtitle: 'Yesterday · 04:26 PM',
    timestamp: '2026-08-11 04:26 PM',
    amount: 120.0,
    isDebit: true,
    reference: 'TR-781042',
    status: 'completed',
  },
  {
    id: 'tx-3',
    type: 'topup',
    title: 'Wallet Top-up',
    subtitle: '10 Aug · 11:15 AM',
    timestamp: '2026-08-10 11:15 AM',
    amount: 1000.0,
    isDebit: false,
    reference: 'PAY-904128',
    status: 'completed',
  },
  {
    id: 'tx-4',
    type: 'fare',
    title: 'Bus Fare',
    subtitle: '09 Aug · 07:45 AM',
    timestamp: '2026-08-09 07:45 AM',
    amount: 85.0,
    isDebit: true,
    reference: 'TR-779810',
    status: 'completed',
  },
  {
    id: 'tx-5',
    type: 'fare',
    title: 'Express Highway Fare',
    subtitle: '08 Aug · 06:10 PM',
    timestamp: '2026-08-08 06:10 PM',
    amount: 250.0,
    isDebit: true,
    reference: 'TR-776492',
    status: 'completed',
  },
  {
    id: 'tx-6',
    type: 'topup',
    title: 'Commercial Bank Direct Pay',
    subtitle: '05 Aug · 02:30 PM',
    timestamp: '2026-08-05 02:30 PM',
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
