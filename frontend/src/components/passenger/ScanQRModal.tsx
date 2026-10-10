import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Bus, Zap } from 'lucide-react';

interface ScanQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulScan: (amount: number, description: string) => void;
}

export const ScanQRModal: React.FC<ScanQRModalProps> = ({
  isOpen,
  onClose,
  onSuccessfulScan,
}) => {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setSuccess(true);
      onSuccessfulScan(85.0, 'Bus Fare - Anuradhapura Transit');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleClose = () => {
    setScanning(false);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Scan QR Transit Terminal</h3>
              <p className="text-[10px] text-slate-500 font-medium">Point at bus door validator</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="p-6 text-center">
          <div className="relative w-64 h-64 mx-auto rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border-4 border-slate-800 shadow-inner">
            {/* Camera Viewfinder graphics */}
            <div className="absolute inset-4 border border-dashed border-white/30 rounded-xl pointer-events-none"></div>

            {/* Corner targets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>

            {scanning && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce"></div>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center text-emerald-400 p-4 animate-in zoom-in-75 duration-200">
                <CheckCircle2 className="w-16 h-16 mb-2 drop-shadow" />
                <span className="font-extrabold text-base text-white">Tapped In Successfully!</span>
                <span className="text-xs text-emerald-400 font-mono mt-1">- Rs. 85.00 Deducted</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-white/70 p-4">
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Bus className="w-10 h-10 text-blue-400" />
                </div>
                <p className="text-xs font-medium text-slate-300">TapRide NFC / QR Gate Sensor</p>
                <p className="text-[10px] text-slate-400 mt-1">Bus #ND-4492 Validator Active</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>End-to-End Encrypted Transit Payload</span>
          </div>

          <div className="mt-5">
            <button
              onClick={handleSimulateScan}
              disabled={scanning || success}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              {scanning ? 'Verifying Validator...' : success ? 'Boarding Confirmed!' : 'Simulate Bus Entrance Tap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
