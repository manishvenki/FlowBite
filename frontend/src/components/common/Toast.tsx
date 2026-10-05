import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-olive shrink-0" />;
        let borderClass = 'border-sand-border';
        let bgClass = 'bg-[#FFFDF5] text-olive-dark';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-olive shrink-0" />;
          borderClass = 'border-olive/30';
          bgClass = 'bg-[#FAF8F0] text-olive-deep';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-terracotta shrink-0" />;
          borderClass = 'border-terracotta/30';
          bgClass = 'bg-[#FFF5F2] text-terracotta-dark';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-card transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${bgClass} ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium tracking-tight leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onClose(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 text-olive/60 hover:text-olive-dark transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
