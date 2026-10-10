import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Ticket,
  Info,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Armchair
} from 'lucide-react';
import type { BusRoute, Seat } from '../../types/passenger';

interface SpotTripBookingProps {
  routes: BusRoute[];
  selectedRoute: BusRoute;
  onSelectRoute: (route: BusRoute) => void;
  travelDate: string;
  onTravelDateChange: (date: string) => void;
  seats: Seat[];
  onToggleSeat: (seatId: string) => void;
  onConfirmBooking: () => void;
}

export const SpotTripBooking: React.FC<SpotTripBookingProps> = ({
  routes,
  selectedRoute,
  onSelectRoute,
  travelDate,
  onTravelDateChange,
  seats,
  onToggleSeat,
  onConfirmBooking,
}) => {
  const [serverDate] = useState(() => new Date().toISOString().split('T')[0]);

  const selectedSeats = seats.filter((s) => s.status === 'selected');
  const totalFare = selectedSeats.length * selectedRoute.baseFare;

  // Split seats into 10 rows of 5 seats each (2 left, 3 right)
  const rows = [];
  for (let r = 0; r < 10; r++) {
    const rowSeats = seats.slice(r * 5, (r + 1) * 5);
    rows.push({
      rowNum: r + 1,
      left: rowSeats.slice(0, 2),
      right: rowSeats.slice(2, 5),
    });
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Card Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
            INSTANT SPOT TRIP
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Book Occasional Seats
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your travel route, date, and visual seat locations from open spot inventory.
          </p>
        </div>

        {/* Current Server Date Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CURRENT SERVER DATE
            </div>
            <div className="text-sm font-mono font-bold text-slate-800">{serverDate}</div>
          </div>
        </div>
      </div>

      {/* 2. Route, Date & Base Fare Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Select Operational Route */}
        <div>
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
            SELECT OPERATIONAL ROUTE
          </label>
          <div className="relative">
            <select
              value={selectedRoute.id}
              onChange={(e) => {
                const found = routes.find((r) => r.id === e.target.value);
                if (found) onSelectRoute(found);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 cursor-pointer"
            >
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Travel Date */}
        <div>
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
            TRAVEL DATE
          </label>
          <div className="relative">
            <input
              type="date"
              value={travelDate}
              onChange={(e) => onTravelDateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Base Ticket Fare */}
        <div>
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
            BASE TICKET FARE
          </label>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Spot Ticket Price</span>
            <span className="text-sm font-extrabold text-rose-600">
              Rs. {selectedRoute.baseFare.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Section: Bus Layout & Spot Trip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Interactive Bus Floor Layout */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Armchair className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Interactive Bus Floor Layout
                </h3>
                <p className="text-[11px] text-slate-500">
                  Click available white seats to select multiple spots.
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
                <span>AVAILABLE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-emerald-700">SELECTED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
                <span className="text-amber-700">PENDING / PASS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300"></span>
                <span className="text-rose-600">SOLD OUT</span>
              </div>
            </div>
          </div>

          {/* Bus Cabin Interior Representation */}
          <div className="mt-6 bg-slate-50/70 border border-slate-200 rounded-2xl p-6">
            {/* Front of Bus: Entrance Door & Driver Cabin */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div className="px-3.5 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-50/70 text-emerald-700 font-extrabold text-xs tracking-wider flex items-center gap-1.5">
                <span>←</span>
                <span>ENTRANCE DOOR</span>
              </div>

              <div className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-sm">
                <span>DRIVER CABIN</span>
                <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">
                  ✇
                </div>
              </div>
            </div>

            {/* Seats Grid: 10 Rows */}
            <div className="space-y-3 max-w-xl mx-auto">
              {rows.map(({ rowNum, left, right }) => (
                <div key={rowNum} className="flex items-center justify-between gap-4">
                  {/* Left pair (2 seats) */}
                  <div className="flex items-center gap-2">
                    {left.map((seat) => (
                      <SeatButton key={seat.id} seat={seat} onToggle={() => onToggleSeat(seat.id)} />
                    ))}
                  </div>

                  {/* Aisle space */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-slate-300 select-none">
                      •
                    </span>
                  </div>

                  {/* Right trio (3 seats) */}
                  <div className="flex items-center gap-2">
                    {right.map((seat) => (
                      <SeatButton key={seat.id} seat={seat} onToggle={() => onToggleSeat(seat.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reserved info banner footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <Info className="w-4 h-4 shrink-0 text-blue-500" />
                <span>Seats A01 - A30 are reserved for 30-day Season Pass Passengers.</span>
              </div>
              <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-bold text-[11px]">
                60% / 40% Pool
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Spot Trip Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Spot Trip Summary</h3>
          </div>

          {/* Details list */}
          <div className="py-4 space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Selected Bus:</span>
              <span className="font-extrabold text-slate-900">{selectedRoute.busName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Travel Date:</span>
              <span className="font-bold text-slate-900 font-mono">{travelDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Departure Time:</span>
              <span className="font-bold text-slate-900 font-mono">{selectedRoute.departureTime}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-medium mt-1">Seat Numbers:</span>
              <div className="text-right">
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-1 justify-end max-w-[160px]">
                    {selectedSeats.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold text-[11px] rounded shadow-xs"
                      >
                        {s.id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded font-semibold text-[11px]">
                    None Selected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                TOTAL PAYABLE FARE:
              </span>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  Rs. {totalFare.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight mt-1 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>Includes digital QR pass generation & instant boarding verification payload.</span>
            </p>

            {/* Confirm & Issue Button */}
            <button
              onClick={onConfirmBooking}
              disabled={selectedSeats.length === 0}
              className={`w-full mt-5 py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedSeats.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-[0.99]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Confirm & Issue Spot QR Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Seat Component
interface SeatButtonProps {
  seat: Seat;
  onToggle: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({ seat, onToggle }) => {
  // Styles based on status & category matching Figma:
  // - Category 'season_pass': yellow/amber (PASS)
  // - Category 'spot':
  //    - 'sold_out': red/pink (TAKEN)
  //    - 'selected': emerald green
  //    - 'available': clean white with border (OPEN)
  if (seat.category === 'season_pass') {
    return (
      <div
        className="w-12 h-11 rounded-lg border border-amber-200 bg-amber-50/90 text-amber-800 flex flex-col items-center justify-center text-[10px] select-none shadow-xs"
        title={`Seat ${seat.id}: Reserved for 30-day Season Pass`}
      >
        <span className="font-extrabold text-[11px] leading-tight">{seat.id}</span>
        <span className="text-[8px] font-bold tracking-wider uppercase text-amber-600">PASS</span>
      </div>
    );
  }

  if (seat.status === 'sold_out') {
    return (
      <div
        className="w-12 h-11 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 flex flex-col items-center justify-center text-[10px] select-none cursor-not-allowed"
        title={`Seat ${seat.id}: Sold out`}
      >
        <span className="font-extrabold text-[11px] leading-tight">{seat.id}</span>
        <span className="text-[8px] font-bold tracking-wider uppercase text-rose-400">TAKEN</span>
      </div>
    );
  }

  if (seat.status === 'selected') {
    return (
      <button
        onClick={onToggle}
        className="w-12 h-11 rounded-lg border-2 border-emerald-600 bg-emerald-500 text-white flex flex-col items-center justify-center text-[10px] shadow-md shadow-emerald-500/30 scale-105 transition-transform"
        title={`Seat ${seat.id}: Selected (Click to remove)`}
      >
        <span className="font-extrabold text-[11px] leading-tight">{seat.id}</span>
        <span className="text-[8px] font-black tracking-wider uppercase text-emerald-100">SEL</span>
      </button>
    );
  }

  // Available Spot Seat
  return (
    <button
      onClick={onToggle}
      className="w-12 h-11 rounded-lg border-2 border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/40 text-slate-800 flex flex-col items-center justify-center text-[10px] transition-all hover:scale-105 shadow-xs"
      title={`Seat ${seat.id}: Available (Click to select)`}
    >
      <span className="font-extrabold text-[11px] leading-tight text-slate-800">{seat.id}</span>
      <span className="text-[8px] font-bold tracking-wider uppercase text-slate-400">OPEN</span>
    </button>
  );
};
