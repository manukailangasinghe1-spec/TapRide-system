import React, { useState } from 'react';
import {
  QrCode,
  Plus,
  Send,
  Clock,
  HelpCircle,
  Bus,
  ArrowUpRight,
  Bell,
  SlidersHorizontal,
  Home,
  Wallet,
  User,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import type { PassengerProfile, Transaction, BusRoute, Seat } from '../../types/passenger';
import { SpotTripBooking } from './SpotTripBooking';

interface WalletHomeMobileProps {
  profile: PassengerProfile;
  transactions: Transaction[];
  onOpenScanQR: () => void;
  onOpenTopUp: () => void;
  onOpenSend: () => void;
  onOpenHelp: () => void;
  onNavigateToBooking?: () => void;
  onOpenProfile: () => void;
  routes?: BusRoute[];
  selectedRoute?: BusRoute;
  onSelectRoute?: (route: BusRoute) => void;
  travelDate?: string;
  onTravelDateChange?: (date: string) => void;
  seats?: Seat[];
  onToggleSeat?: (seatId: string) => void;
  onConfirmBooking?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const WalletHomeMobile: React.FC<WalletHomeMobileProps> = ({
  profile,
  transactions,
  onOpenScanQR,
  onOpenTopUp,
  onOpenSend,
  onOpenHelp,
  onNavigateToBooking,
  onOpenProfile,
  routes,
  selectedRoute,
  onSelectRoute,
  travelDate,
  onTravelDateChange,
  seats,
  onToggleSeat,
  onConfirmBooking,
  onShowToast,
}) => {
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'travel' | 'wallet' | 'profile'>('home');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showMonthDetails, setShowMonthDetails] = useState(false);

  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 4);

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-2xl rounded-3xl overflow-hidden border border-slate-200 flex flex-col relative pb-20">
      {activeBottomNav === 'travel' && routes && selectedRoute && onSelectRoute && travelDate && onTravelDateChange && seats && onToggleSeat && onConfirmBooking ? (
        <div className="flex-1 flex flex-col pb-16">
          {/* Mobile Travel Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveBottomNav('home')}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Back to Wallet Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-sm font-extrabold text-white">Spot Trip Booking</h2>
                <p className="text-[11px] text-blue-100">Reserve bus seat</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase tracking-wider">
              Mobile Pass
            </span>
          </div>

          <div className="p-3">
            <SpotTripBooking
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={onSelectRoute}
              travelDate={travelDate}
              onTravelDateChange={onTravelDateChange}
              seats={seats}
              onToggleSeat={onToggleSeat}
              onConfirmBooking={onConfirmBooking}
            />
          </div>
        </div>
      ) : (
        <>
          {/* 1. Curved Royal Blue Header & Hero */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-800 text-white pt-6 pb-24 px-5 rounded-b-[2.5rem] shadow-lg overflow-hidden">
            {/* Subtle decorative curved circular glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-12 top-24 w-40 h-40 rounded-full bg-indigo-500/20 blur-xl pointer-events-none"></div>

            {/* Top Brand & Actions Bar */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg border border-white/20 shadow-xs">
                  T
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">TapRide</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onShowToast) {
                      onShowToast('No new notifications at this time.', 'info');
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-colors"
              title="Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Greetings */}
        <div className="relative">
          <p className="text-xs font-semibold text-blue-100 tracking-wide">Good morning</p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">Hello, Passenger</h1>
          <p className="text-xs text-blue-100/90 mt-1">Your smart travel wallet is ready.</p>
        </div>
      </div>

      {/* 2. Overlapping Balance Card */}
      <div className="px-5 -mt-16 relative z-10">
        <div className="bg-[#101935] text-white rounded-3xl p-5 shadow-2xl border border-slate-700/50 backdrop-blur-md">
          {/* Top row: Status */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Available Wallet Balance
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">Active</span>
            </div>
          </div>

          {/* Large Balance Display */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-slate-300">Rs.</span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Card Identifier */}
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mb-5">
            TAPRIDE WALLET {profile.walletNumber}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onOpenTopUp}
              className="flex items-center justify-center gap-1.5 py-3 px-4 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-950 font-extrabold rounded-2xl text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-blue-600 stroke-[3]" />
              <span>+ Top Up</span>
            </button>

            <button
              onClick={onOpenSend}
              className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-800/80 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold rounded-2xl text-xs border border-slate-700 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>↗ Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="px-5 mt-6 space-y-6 flex-1">
        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-3 tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {/* Scan QR */}
            <button
              onClick={onOpenScanQR}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white transition-colors mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                Scan QR
              </span>
            </button>

            {/* Top Up */}
            <button
              onClick={onOpenTopUp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white transition-colors mb-2">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                Top Up
              </span>
            </button>

            {/* Travel */}
            <button
              onClick={() => {
                setActiveBottomNav('travel');
                if (onNavigateToBooking) onNavigateToBooking();
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white transition-colors mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                Travel
              </span>
            </button>

            {/* Help */}
            <button
              onClick={onOpenHelp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white transition-colors mb-2">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                Help
              </span>
            </button>
          </div>
        </div>

        {/* This Month Spending Card */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">This Month</h2>
            <button
              onClick={() => setShowMonthDetails(!showMonthDetails)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              {showMonthDetails ? 'Hide details' : 'View details'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Transport spending
                </span>
                <span className="text-lg font-black text-slate-900">
                  Rs. {profile.monthlySpent.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Trips
                </span>
                <span className="text-xl font-black text-slate-900">{profile.monthlyTrips}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (profile.monthlySpent / profile.monthlyTarget) * 100)}%` }}
              ></div>
            </div>

            {/* Spent vs Target labels */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Rs. {profile.monthlySpent.toLocaleString()} spent</span>
              <span>Monthly target Rs. {profile.monthlyTarget.toLocaleString()}</span>
            </div>

            {showMonthDetails && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600 animate-in fade-in">
                <div className="flex justify-between">
                  <span>Average Fare per Trip:</span>
                  <span className="font-bold text-slate-900">
                    Rs. {(profile.monthlySpent / profile.monthlyTrips).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Carbon Saved vs Car:</span>
                  <span className="font-bold text-emerald-600">38.4 kg CO₂</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Transactions</h2>
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              {showAllTransactions ? 'Show less' : 'See all'}
            </button>
          </div>

          <div className="space-y-2.5">
            {displayedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.isDebit ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {tx.isDebit ? <Bus className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">{tx.title}</h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{tx.subtitle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-black ${
                      tx.isDebit ? 'text-rose-500' : 'text-emerald-600'
                    }`}
                  >
                    {tx.isDebit ? `- Rs. ${tx.amount.toFixed(2)}` : `+ Rs. ${tx.amount.toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pill Banner: "No new notifications" */}
        <div className="py-2">
          <div className="bg-[#131b2e] text-white text-xs py-3 px-4 rounded-2xl text-center font-semibold shadow-md border border-slate-800">
            No new notifications
          </div>
        </div>
      </div>
      </>
      )}

      {/* 4. Bottom Sticky Navigation Bar */}
      <div className="fixed bottom-0 max-w-md w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-6 flex justify-around items-center z-30 shadow-lg">
        {/* Home */}
        <button
          onClick={() => setActiveBottomNav('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeBottomNav === 'home' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeBottomNav === 'home' ? 'bg-blue-50' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Home</span>
        </button>

        {/* Travel */}
        <button
          onClick={() => {
            setActiveBottomNav('travel');
            if (onNavigateToBooking) onNavigateToBooking();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeBottomNav === 'travel' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeBottomNav === 'travel' ? 'bg-blue-50' : ''}`}>
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Travel</span>
        </button>

        {/* Wallet */}
        <button
          onClick={() => {
            setActiveBottomNav('wallet');
            onOpenTopUp();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeBottomNav === 'wallet' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeBottomNav === 'wallet' ? 'bg-blue-50' : ''}`}>
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Wallet</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => {
            setActiveBottomNav('profile');
            onOpenProfile();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeBottomNav === 'profile' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeBottomNav === 'profile' ? 'bg-blue-50' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};
