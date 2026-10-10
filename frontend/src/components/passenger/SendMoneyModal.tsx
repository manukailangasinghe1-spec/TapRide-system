import React, { useState } from 'react';
import { X, Send, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSendSuccess: (amount: number, recipient: string) => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onSendSuccess,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!recipient.trim()) {
      setError('Please enter a recipient phone or wallet number.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (parsedAmount > availableBalance) {
      setError(`Amount exceeds your available balance (Rs. ${availableBalance.toFixed(2)})`);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSendSuccess(parsedAmount, recipient);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Send Travel Credits</h3>
              <p className="text-xs text-blue-200">P2P TapRide Transfer</p>
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
        <form onSubmit={handleSend} className="p-6">
          <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Available Balance:</span>
            <span className="font-extrabold text-slate-900">Rs. {availableBalance.toFixed(2)}</span>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium border border-rose-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Recipient Phone or TapRide Wallet ID
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">
                <UserCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="+94 7X XXX XXXX or @username"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Transfer Amount (Rs.)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Instant & Zero Transfer Fees</span>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {isSending ? (
              'Transferring...'
            ) : (
              <>
                <span>Send Credits</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
