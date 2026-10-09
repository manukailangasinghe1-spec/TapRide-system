import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            T
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TapRide</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
              PWA
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How It Works
          </a>
          <a href="#roles" className="hover:text-blue-600 transition-colors">
            User Roles
          </a>
          <Link to="/passenger" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Passenger Portal
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
