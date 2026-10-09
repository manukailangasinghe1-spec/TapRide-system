import React, { useState } from 'react';
import type {
  PassengerProfile,
  BusRoute,
  Seat,
  Transaction,
  TicketPass,
  TabType,
} from '../types/passenger';
import {
  initialPassengerProfile,
  sampleRoutes,
  initialTransactions,
  generateInitialSeats,
} from '../data/passengerMockData';
import { PassengerHeader } from '../components/passenger/PassengerHeader';
import { SpotTripBooking } from '../components/passenger/SpotTripBooking';
import { WalletHomeMobile } from '../components/passenger/WalletHomeMobile';
import { QRPassModal } from '../components/passenger/QRPassModal';
import { ScanQRModal } from '../components/passenger/ScanQRModal';
import { TopUpModal } from '../components/passenger/TopUpModal';
import { SendMoneyModal } from '../components/passenger/SendMoneyModal';
import { HelpModal } from '../components/passenger/HelpModal';
import { SeasonPassModal } from '../components/passenger/SeasonPassModal';
import {
  Plus,
  Send,
  Bus,
  ArrowUpRight,
  Moon,
  Sun,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface PassengerDashboardProps {
  initialTab?: TabType;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({
  initialTab = 'booking',
}) => {
  // State
  const [profile, setProfile] = useState<PassengerProfile>(initialPassengerProfile);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Booking state
  const [routes] = useState<BusRoute[]>(sampleRoutes);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(sampleRoutes[0]);
  const [travelDate, setTravelDate] = useState<string>('2026-08-13');
  const [seats, setSeats] = useState<Seat[]>(() => generateInitialSeats(sampleRoutes[0].baseFare));

  // Generated Ticket Pass
  const [currentTicket, setCurrentTicket] = useState<TicketPass | null>(null);

  // Modals state
  const [isQRPassModalOpen, setIsQRPassModalOpen] = useState(false);
  const [isScanQRModalOpen, setIsScanQRModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSeasonPassModalOpen, setIsSeasonPassModalOpen] = useState(false);

  // Dark mode simulation state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle seat selection
  const handleToggleSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          if (seat.status === 'available') {
            return { ...seat, status: 'selected' };
          }
          if (seat.status === 'selected') {
            return { ...seat, status: 'available' };
          }
        }
        return seat;
      })
    );
  };

  // Route change handler
  const handleSelectRoute = (newRoute: BusRoute) => {
    setSelectedRoute(newRoute);
    setSeats(generateInitialSeats(newRoute.baseFare));
  };

  // Confirm spot booking & issue QR pass
  const handleConfirmBooking = () => {
    const selectedSeats = seats.filter((s) => s.status === 'selected');
    if (selectedSeats.length === 0) return;

    const totalFare = selectedSeats.length * selectedRoute.baseFare;

    // Check balance
    if (profile.balance < totalFare) {
      alert(`Insufficient balance! Your current wallet balance is Rs. ${profile.balance.toFixed(2)}, but total ticket fare is Rs. ${totalFare.toFixed(2)}. Please top up your wallet.`);
      setIsTopUpModalOpen(true);
      return;
    }

    // Deduct balance
    setProfile((prev) => ({
      ...prev,
      balance: prev.balance - totalFare,
      monthlySpent: prev.monthlySpent + totalFare,
      monthlyTrips: prev.monthlyTrips + selectedSeats.length,
    }));

    // Create ticket pass
    const bookingRef = `TPR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPass: TicketPass = {
      bookingReference: bookingRef,
      passengerName: profile.name,
      busName: selectedRoute.busName,
      busNumber: selectedRoute.busNumber,
      route: selectedRoute.name,
      departureTime: selectedRoute.departureTime,
      travelDate: travelDate,
      seatNumbers: selectedSeats.map((s) => s.id),
      totalFare: totalFare,
      qrPayload: `TICKET:${bookingRef}:${selectedSeats.map((s) => s.id).join(',')}:${totalFare}`,
      issuedAt: new Date().toLocaleTimeString(),
    };

    setCurrentTicket(newPass);

    // Add to transactions
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'fare',
      title: `Spot Pass (${selectedSeats.map((s) => s.id).join(', ')})`,
      subtitle: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date().toLocaleString(),
      amount: totalFare,
      isDebit: true,
      reference: bookingRef,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Mark seats as sold_out
    setSeats((prev) =>
      prev.map((s) =>
        s.status === 'selected' ? { ...s, status: 'sold_out', label: 'TAKEN' } : s
      )
    );

    // Open QR pass modal
    setIsQRPassModalOpen(true);
  };

  // Handle successful Scan QR tap
  const handleSuccessfulScan = (amount: number, description: string) => {
    setProfile((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      monthlySpent: prev.monthlySpent + amount,
      monthlyTrips: prev.monthlyTrips + 1,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'fare',
      title: description,
      subtitle: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date().toLocaleString(),
      amount: amount,
      isDebit: true,
      reference: `NFC-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Handle successful top up
  const handleTopUpSuccess = (amount: number, method: string) => {
    setProfile((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'topup',
      title: `Recharge (${method})`,
      subtitle: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date().toLocaleString(),
      amount: amount,
      isDebit: false,
      reference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Handle send money success
  const handleSendSuccess = (amount: number, recipient: string) => {
    setProfile((prev) => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer',
      title: `Sent to ${recipient}`,
      subtitle: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date().toLocaleString(),
      amount: amount,
      isDebit: true,
      reference: `P2P-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'} font-sans antialiased`}>
      {/* 1. Header (Desktop View) */}
      <PassengerHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        profile={profile}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
        onOpenSeasonPassModal={() => setIsSeasonPassModalOpen(true)}
      />

      {/* 2. Main Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If Mobile View mode is toggled, render the mobile frame matching Figma Image 1 */}
        {viewMode === 'mobile' ? (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                Mobile Preview: Passenger Wallet Home
              </span>
            </div>
            <WalletHomeMobile
              profile={profile}
              transactions={transactions}
              onOpenScanQR={() => setIsScanQRModalOpen(true)}
              onOpenTopUp={() => setIsTopUpModalOpen(true)}
              onOpenSend={() => setIsSendMoneyModalOpen(true)}
              onOpenHelp={() => setIsHelpModalOpen(true)}
              onNavigateToBooking={() => {
                setViewMode('desktop');
                setActiveTab('booking');
              }}
              onOpenProfile={() => setIsSeasonPassModalOpen(true)}
            />
          </div>
        ) : (
          /* Desktop Console View matching Figma Image 2 */
          <div>
            {/* Tab: Spot Trip Booking */}
            {activeTab === 'booking' && (
              <SpotTripBooking
                routes={routes}
                selectedRoute={selectedRoute}
                onSelectRoute={handleSelectRoute}
                travelDate={travelDate}
                onTravelDateChange={setTravelDate}
                seats={seats}
                onToggleSeat={handleToggleSeat}
                onConfirmBooking={handleConfirmBooking}
              />
            )}

            {/* Tab: My Pass Wallet (Full Desktop View of Wallet) */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                      My Pass Wallet & Transactions
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage your smart digital transit pass, balance recharges, and trip history.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsTopUpModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Top Up Wallet
                    </button>
                    <button
                      onClick={() => setIsSendMoneyModalOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Transfer
                    </button>
                  </div>
                </div>

                {/* Balance & Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Available Balance Card */}
                  <div className="bg-[#101935] text-white rounded-2xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Available Balance
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                      </span>
                    </div>
                    <div className="text-3xl font-black mt-2">
                      Rs. {profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs font-mono text-slate-400 tracking-widest mt-4">
                      TAPRIDE WALLET {profile.walletNumber}
                    </div>
                  </div>

                  {/* Monthly Spending Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span>This Month Spending</span>
                        <span className="text-slate-900">{profile.monthlyTrips} Trips</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 mt-2">
                        Rs. {profile.monthlySpent.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (profile.monthlySpent / profile.monthlyTarget) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Spent: Rs. {profile.monthlySpent.toLocaleString()}</span>
                        <span>Target: Rs. {profile.monthlyTarget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Season Pass Status Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                          Pass Membership
                        </span>
                        <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                          Tier 1
                        </span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900 mt-2">
                        {profile.passType}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Valid until {profile.passExpiry} (All provincial zones)
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSeasonPassModalOpen(true)}
                      className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-900 underline text-left"
                    >
                      View pass terms & priority seat privileges →
                    </button>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">Transaction History</h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Showing latest {transactions.length} records
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              tx.isDebit ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {tx.isDebit ? <Bus className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{tx.title}</div>
                            <div className="text-[11px] text-slate-400">{tx.subtitle} · Ref: {tx.reference}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xs font-extrabold ${
                              tx.isDebit ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {tx.isDebit ? `- Rs. ${tx.amount.toFixed(2)}` : `+ Rs. ${tx.amount.toFixed(2)}`}
                          </div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Monthly Season Pass */}
            {activeTab === 'pass' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-2xl mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">30-Day Monthly Season Pass</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your pass provides unlimited travel across Sri Lanka public transit corridors with 60% pool seat reservations.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsSeasonPassModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Open Pass Card Details
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Fleet Seat Map */}
            {activeTab === 'fleet' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900">Active Fleet Seat Specifications</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Standard 50-passenger long-distance bus interior configuration.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Standard Coach Seating</span>
                    <span className="text-slate-500">2 + 3 arrangement with center walk-through aisle.</span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-800 block mb-1">Season Pass Zone (A01 - A30)</span>
                    <span className="text-slate-600">Priority reserved forward seating for registered holders.</span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-800 block mb-1">Spot Passenger Zone (A31 - A50)</span>
                    <span className="text-slate-600">Open on-demand booking for ad-hoc journey tickets.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Controls on bottom-right (Theme Toggle & Chat Bubble) matching Figma PC */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform"
          title="Toggle Light / Dark theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Passenger Support Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Interactive Modals */}
      <QRPassModal
        isOpen={isQRPassModalOpen}
        onClose={() => setIsQRPassModalOpen(false)}
        ticket={currentTicket}
      />

      <ScanQRModal
        isOpen={isScanQRModalOpen}
        onClose={() => setIsScanQRModalOpen(false)}
        onSuccessfulScan={handleSuccessfulScan}
      />

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onTopUpSuccess={handleTopUpSuccess}
      />

      <SendMoneyModal
        isOpen={isSendMoneyModalOpen}
        onClose={() => setIsSendMoneyModalOpen(false)}
        availableBalance={profile.balance}
        onSendSuccess={handleSendSuccess}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <SeasonPassModal
        isOpen={isSeasonPassModalOpen}
        onClose={() => setIsSeasonPassModalOpen(false)}
        profile={profile}
        onOpenQR={() => {
          setCurrentTicket({
            bookingReference: 'PASS-SEASON-2026',
            passengerName: profile.name,
            busName: 'All Provincial Buses',
            busNumber: 'PRIORITY-ALL',
            route: 'All-Island 30-Day Network Pass',
            departureTime: 'Anytime',
            travelDate: 'Through 2026-08-31',
            seatNumbers: ['A01-A30'],
            totalFare: 0,
            qrPayload: `SEASON_PASS:${profile.name}:PRIORITY_A01_A30`,
            issuedAt: '2026-08-01',
          });
          setIsQRPassModalOpen(true);
        }}
      />
    </div>
  );
};

export default PassengerDashboard;
