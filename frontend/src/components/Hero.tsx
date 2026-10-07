import React from 'react'

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs sm:text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Digital Wallet & QR-Based Bus Management System
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Smarter, Cashless Bus Journeys with <span className="text-blue-600">TapRide</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A modern Progressive Web Application designed for private bus transportation in Sri Lanka.
          Experience seamless digital wallet payments, QR-based entry and exit, and reliable offline transaction support.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors text-center"
          >
            Explore How It Works
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition-colors text-center"
          >
            View Features
          </a>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-left sm:text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">Digital Wallet</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Stored-value cashless top-up</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">QR Check-in</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Seamless bus entry & exit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">Offline Ready</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">IndexedDB sync queue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">Fair Fares</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Automatic reconciliation</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
