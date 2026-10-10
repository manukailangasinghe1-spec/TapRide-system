import { X, Download, CheckCircle, Calendar, Clock, Bus } from 'lucide-react';
import type { TicketPass } from '../../types/passenger';

interface QRPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketPass | null;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-100">Verified Boarding Pass</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">TapRide Spot QR Pass</h2>
          <p className="text-xs text-blue-100 mt-0.5">Ref: {ticket.bookingReference}</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          {/* QR Code Container */}
          <div className="bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
              {/* High fidelity realistic SVG QR Code */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                {/* Outer corners */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="#2563eb" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="#2563eb" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="#2563eb" />

                {/* Data blocks */}
                <rect x="36" y="8" width="8" height="8" rx="1" />
                <rect x="48" y="12" width="6" height="6" rx="1" />
                <rect x="56" y="6" width="7" height="7" rx="1" />
                <rect x="36" y="22" width="14" height="6" rx="1" />
                <rect x="8" y="36" width="6" height="14" rx="1" />
                <rect x="20" y="38" width="9" height="7" rx="1" />
                <rect x="34" y="34" width="8" height="8" rx="1" fill="#2563eb" />
                <rect x="46" y="36" width="12" height="6" rx="1" />
                <rect x="62" y="34" width="8" height="8" rx="1" />
                <rect x="74" y="38" width="10" height="8" rx="1" fill="#2563eb" />
                <rect x="88" y="36" width="6" height="12" rx="1" />
                <rect x="8" y="54" width="10" height="8" rx="1" />
                <rect x="22" y="52" width="8" height="10" rx="1" />
                <rect x="34" y="48" width="12" height="8" rx="1" />
                <rect x="50" y="46" width="16" height="8" rx="1" fill="#2563eb" />
                <rect x="70" y="50" width="8" height="12" rx="1" />
                <rect x="82" y="52" width="10" height="8" rx="1" />
                <rect x="36" y="62" width="10" height="10" rx="1" />
                <rect x="50" y="60" width="14" height="6" rx="1" />
                <rect x="68" y="66" width="12" height="6" rx="1" />
                <rect x="84" y="64" width="8" height="8" rx="1" />
                <rect x="36" y="76" width="8" height="16" rx="1" fill="#2563eb" />
                <rect x="48" y="72" width="10" height="8" rx="1" />
                <rect x="62" y="78" width="12" height="14" rx="1" />
                <rect x="78" y="76" width="14" height="8" rx="1" />
                <rect x="48" y="86" width="10" height="8" rx="1" />
                <rect x="80" y="88" width="12" height="6" rx="1" />

                {/* Center logo badge */}
                <circle cx="50" cy="50" r="8" fill="#ffffff" />
                <circle cx="50" cy="50" r="6" fill="#2563eb" />
              </svg>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Scan at Bus Entrance Validator to Board
            </p>
          </div>

          {/* Trip Details Grid */}
          <div className="mt-4 space-y-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    Bus & Route
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{ticket.busName}</div>
                  <div className="text-xs text-slate-600 font-medium">{ticket.route}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    {ticket.busNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Travel Date
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">{ticket.travelDate}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Departure
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">{ticket.departureTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">Allocated Seats</span>
                <div className="flex gap-1.5 mt-1">
                  {ticket.seatNumbers.map((seat) => (
                    <span key={seat} className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-md shadow-sm">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">Total Fare</span>
                <span className="text-lg font-black text-slate-900">Rs. {ticket.totalFare.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => alert(`Boarding Pass #${ticket.bookingReference} downloaded as PDF.`)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              <Download className="w-4 h-4" /> Save Pass
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Ready to Travel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
