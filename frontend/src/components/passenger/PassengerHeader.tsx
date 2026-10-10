import React, { useState } from 'react';
import { User, Smartphone, Monitor, Menu, X } from 'lucide-react';
import type { PassengerProfile, TabType } from '../../types/passenger';

interface PassengerHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  profile: PassengerProfile;
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: () => void;
  onOpenSeasonPassModal: () => void;
}

export const PassengerHeader: React.FC<PassengerHeaderProps> = ({
  activeTab,
  onTabChange,
  profile,
  viewMode,
  onToggleViewMode,
  onOpenSeasonPassModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand & Tabs */}
          <div className="flex items-center gap-6">
            {/* Logo and Console branding */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                T
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">TapRide</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 rounded-full tracking-wide">
                    PASSENGER PORTAL
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  UNIFIED PASSENGER CONSOLE
                </div>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-4">
              <button
                onClick={() => onTabChange('booking')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'booking'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Spot Trip Booking
              </button>

              <button
                onClick={() => {
                  onTabChange('pass');
                  onOpenSeasonPassModal();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'pass'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Monthly Season Pass
              </button>

              <button
                onClick={() => onTabChange('wallet')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'wallet'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                My Pass Wallet
              </button>

              <button
                onClick={() => onTabChange('fleet')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'fleet'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Fleet Seat Map
              </button>
            </nav>
          </div>

          {/* Right User info & Preview Switcher */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle Button */}
            <button
              onClick={onToggleViewMode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Toggle view between Desktop PC Console and Mobile Wallet Home"
            >
              {viewMode === 'desktop' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Mobile Wallet View</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">PC Console View</span>
                </>
              )}
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-none">{profile.username}</div>
                <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Pass Holder
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* Mobile / Tablet Menu Button (< lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Navigation Menu (< lg) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 px-2 space-y-1 bg-white animate-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => {
                onTabChange('booking');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'booking'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Spot Trip Booking
            </button>
            <button
              onClick={() => {
                onTabChange('pass');
                onOpenSeasonPassModal();
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pass'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Monthly Season Pass
            </button>
            <button
              onClick={() => {
                onTabChange('wallet');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                activeTab === 'wallet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>My Pass Wallet</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </button>
            <button
              onClick={() => {
                onTabChange('fleet');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fleet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Fleet Seat Map
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
