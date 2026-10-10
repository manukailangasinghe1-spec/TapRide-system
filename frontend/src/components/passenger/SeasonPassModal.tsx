import React from 'react';
import { X, Award, Calendar, CheckCircle2, QrCode, Bus, Shield } from 'lucide-react';
import type { PassengerProfile } from '../../types/passenger';

interface SeasonPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PassengerProfile;
  onOpenQR: () => void;
}

export const SeasonPassModal: React.FC<SeasonPassModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenQR,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Verified Pass</span>
              </div>
              <h3 className="font-extrabold text-lg text-white">Monthly Season Pass</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-800">Pass Privilege Level</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-full">
                Tier 1 - Priority
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">{profile.passType}</div>
            <p className="text-xs text-slate-600 mt-1">
              Guaranteed priority seating in reserved zone (Seats A01 - A30) on all registered provincial routes.
            </p>
          </div>

          {/* Validity details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Valid Until
              </span>
              <span className="font-bold text-slate-900 block mt-1">{profile.passExpiry}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Bus className="w-3.5 h-3.5 text-slate-400" /> Coverage
              </span>
              <span className="font-bold text-slate-900 block mt-1">All Island Buses</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Unlimited tap-in and tap-out verification</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>60% Pool guaranteed allocation on peak departures</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Shield className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Linked to National Identity Card (NIC verified)</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenQR();
              }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              Show Pass QR Code
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
