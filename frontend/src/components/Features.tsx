import React from 'react'

interface FeatureItem {
  title: string
  description: string
  tag: string
}

const features: FeatureItem[] = [
  {
    title: 'Digital Stored-Value Wallet',
    description:
      'Convenient digital wallet for passengers to manage funds, top-up balances, track transaction history, and receive digital receipts.',
    tag: 'Passenger',
  },
  {
    title: 'QR Journey Entry & Exit',
    description:
      'Fast and contactless boarding and exit with dynamic QR scanning, eliminating physical ticket delays and cash handling.',
    tag: 'Ticketing',
  },
  {
    title: 'Conductor-Assisted Scanning',
    description:
      'Dedicated workflow allowing conductors to scan passenger QR codes quickly, assist journeys, and verify ride status on route.',
    tag: 'Conductor',
  },
  {
    title: 'Offline Transaction Support',
    description:
      'Built-in offline queuing using local browser storage and IndexedDB, ensuring uninterrupted operation during temporary connectivity loss.',
    tag: 'Resilience',
  },
  {
    title: 'Maximum-Fare Reconciliation',
    description:
      'Transparent fare calculation holding maximum fare upon entry and reconciling the exact route fare upon exit.',
    tag: 'Fare Engine',
  },
  {
    title: 'Fleet & Crew Management',
    description:
      'Centralized administration for bus owners and administrators to oversee routes, schedules, crew assignments, and operational reporting.',
    tag: 'Operations',
  },
]

const roles = [
  { role: 'Passenger', focus: 'Wallet, QR journeys, balance top-ups & digital receipts' },
  { role: 'Conductor', focus: 'QR ticket scanning, journey assistance & offline queueing' },
  { role: 'Driver', focus: 'Trip management & vehicle journey progress' },
  { role: 'Bus Owner', focus: 'Fleet monitoring, crew allocation & earnings overview' },
  { role: 'Administrator', focus: 'User management, route configuration & system reports' },
]

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            System Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Key Features of TapRide
          </h3>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Designed to modernize public and private transit operations with end-to-end digital ticketing and fleet transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 mb-4">
                {feature.tag}
              </span>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* User Roles Section */}
        <div id="roles" className="mt-20 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Supported User Roles
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Tailored interfaces for every participant in the private bus transit ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((item) => (
              <div
                key={item.role}
                className="bg-white rounded-lg p-4 border border-slate-200 text-center flex flex-col justify-between"
              >
                <div className="font-semibold text-slate-900 text-base">{item.role}</div>
                <div className="text-xs text-slate-500 mt-2">{item.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
