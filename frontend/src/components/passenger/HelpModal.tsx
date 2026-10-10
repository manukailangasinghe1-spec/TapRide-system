import React from 'react';
import { X, HelpCircle, Phone, MessageSquare, AlertTriangle, ShieldQuestion, FileText } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Passenger Assistance</h3>
              <p className="text-xs text-blue-100">TapRide 24/7 Transit Help</p>
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
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">National Transit Helpline</div>
              <div className="text-xs text-blue-700 font-extrabold mt-0.5">1955 / +94 11 234 5678</div>
              <div className="text-[10px] text-slate-500">Toll-free emergency & bus dispatch support</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                if (onShowToast) {
                  onShowToast('How to Board: Simply show your QR code to the validator near the driver cabin or tap your NFC pass.', 'info');
                }
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldQuestion className="w-4 h-4 text-slate-400" />
                <span>How does the QR Boarding validator work?</span>
              </div>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="#dispute"
              onClick={(e) => {
                e.preventDefault();
                if (onShowToast) {
                  onShowToast('Fare Dispute Ticket initiated. Our team will review within 2 hours.', 'success');
                }
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Dispute incorrect trip fare deduction</span>
              </div>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                if (onShowToast) {
                  onShowToast('Connecting to TapRide passenger live agent on chat...', 'info');
                }
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>Chat with live operator</span>
              </div>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
          >
            Close Help Center
          </button>
        </div>
      </div>
    </div>
  );
};
