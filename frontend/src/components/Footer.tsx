import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/logo.jpeg"
                alt="TapRide Logo"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                TapRide
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Digital Wallet and Bus Management System for private bus transportation in Sri Lanka.
              Empowering passengers, conductors, and bus operators with contactless ticketing and smart fare reconciliation.
            </p>

            <p className="text-xs text-slate-500 mt-3">
              EER4189 – Software Design in Group · The Open University of Sri Lanka (OUSL)
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-white transition-colors">
                  User Roles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              User Roles
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-400">Passenger Portal</span>
              </li>
              <li>
                <span className="text-slate-400">Conductor Interface</span>
              </li>
              <li>
                <span className="text-slate-400">Bus Owner Management</span>
              </li>
              <li>
                <span className="text-slate-400">Administrator Console</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TapRide System. All rights reserved.</p>
          <p>Progressive Web Application (PWA)</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
