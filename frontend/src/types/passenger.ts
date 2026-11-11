export type TabType = 'booking' | 'wallet' | 'pass' | 'fleet' | 'profile';

export type SeatStatus = 'available' | 'selected' | 'pending' | 'sold_out';
export type SeatCategory = 'season_pass' | 'spot';

export interface Seat {
  id: string; // e.g., 'A01', 'A31'
  label: string;
  category: SeatCategory;
  status: SeatStatus;
  price: number;
}

export interface BusRoute {
  id: string;
  name: string;
  busName: string;
  busNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  baseFare: number;
  availableSeats: number;
}

export interface Transaction {
  id: string;
  type: 'fare' | 'topup' | 'transfer' | 'refund';
  title: string;
  subtitle: string;
  timestamp: string;
  amount: number;
  isDebit: boolean;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface PassengerProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  walletNumber: string;
  balance: number;
  isPassHolder: boolean;
  passType: string;
  passExpiry: string;
  monthlySpent: number;
  monthlyTarget: number;
  monthlyTrips: number;
}

export interface TicketPass {
  bookingReference: string;
  passengerName: string;
  busName: string;
  busNumber: string;
  route: string;
  departureTime: string;
  travelDate: string;
  seatNumbers: string[];
  totalFare: number;
  qrPayload: string;
  issuedAt: string;
}
