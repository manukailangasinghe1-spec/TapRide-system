import React, { useState } from 'react';
import { X, Plus, CreditCard, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUpSuccess: (amount: number, method: string) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onTopUpSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'frimi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = [250, 500, 1000, 2000, 5000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedAmount(parsed);
    }
  };

  const handleConfirm = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodLabel =
        paymentMethod === 'card'
          ? 'Visa / Mastercard'
          : paymentMethod === 'bank'
          ? 'Direct Bank Pay'
          : 'FriMi / Mobile Wallet';
      onTopUpSuccess(finalAmount, methodLabel);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Top Up Travel Wallet</h3>
              <p className="text-xs text-blue-100">Instant balance recharge</p>
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
        <div className="p-6">
          <div className="text-center mb-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recharge Amount</span>
            <div className="text-3xl font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-slate-500">Rs.</span>
              <span>{selectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleAmountSelect(amt)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedAmount === amt && !customAmount
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'
                }`}
              >
                + Rs. {amt}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="mb-5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rs.</span>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Payment Source
            </label>
            <div className="space-y-2 text-xs">
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Debit / Credit Card (•••• 1092)</span>
                </div>
                {paymentMethod === 'card' && <Check className="w-4 h-4 text-blue-600" />}
              </label>

              <label
                onClick={() => setPaymentMethod('bank')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Commercial Bank Direct Pay</span>
                </div>
                {paymentMethod === 'bank' && <Check className="w-4 h-4 text-blue-600" />}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted Instant Settlement</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            {isProcessing ? 'Processing Recharge...' : `Recharge Rs. ${selectedAmount.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
};
