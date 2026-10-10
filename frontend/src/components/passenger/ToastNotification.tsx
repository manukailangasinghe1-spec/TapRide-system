import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgStyles = {
    success: 'bg-emerald-950/95 border-emerald-500 text-emerald-100',
    error: 'bg-rose-950/95 border-rose-500 text-rose-100',
    warning: 'bg-amber-950/95 border-amber-500 text-amber-100',
    info: 'bg-slate-900/95 border-blue-500 text-slate-100',
  }[type];

  const icon = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  }[type];

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full mx-auto px-4 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${bgStyles}`}
      >
        {icon}
        <div className="flex-1 text-xs font-semibold leading-relaxed">{message}</div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-0.5 rounded-lg ml-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
