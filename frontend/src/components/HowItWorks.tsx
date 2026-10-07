import React from 'react'

interface StepItem {
  number: string
  title: string
  description: string
}

const steps: StepItem[] = [
  {
    number: '01',
    title: 'Top Up Digital Wallet',
    description:
      'Passengers create an account and top up their stored-value digital wallet balance securely before boarding.',
  },
  {
    number: '02',
    title: 'Scan QR Code on Entry',
    description:
      'Scan the passenger QR code at the bus terminal or with the conductor to register boarding and hold the maximum fare.',
  },
  {
    number: '03',
    title: 'Tap to Exit & Reconcile Fare',
    description:
      'Upon reaching your destination stop, scan out to automatically reconcile the exact distance-based fare and receive a digital receipt.',
  },
  {
    number: '04',
    title: 'Automatic Offline Synchronization',
    description:
      'Conductor and vehicle devices queue transactions locally using IndexedDB and synchronize data once network connection is restored.',
  },
]

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            How TapRide Works
          </h3>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            A simple, contactless four-step journey designed for passengers, conductors, and fleet operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative p-6 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-extrabold text-blue-600 font-mono">
                  {step.number}
                </span>
                <h4 className="text-lg font-semibold text-slate-900 mt-3 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
