import React, { useState, useEffect } from 'react';
import { webAlerts, ToastMessage } from '../utils/webAlerts';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = webAlerts.subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);
      }
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200 bg-white';
        let icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-emerald-50/95';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200 bg-rose-50/95';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-200 bg-amber-50/95';
          icon = <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
        } else if (toast.type === 'order') {
          borderClass = 'border-[#FFD318] bg-[#05268F] text-white shadow-xl';
          icon = <Bell className="w-5 h-5 text-[#FFD318] flex-shrink-0 animate-bounce" />;
        }

        const isOrder = toast.type === 'order';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full flex items-start gap-3 p-3.5 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${borderClass}`}
          >
            <div className="pt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-bold ${isOrder ? 'text-white' : 'text-slate-900'}`}>
                {toast.title}
              </h4>
              <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${isOrder ? 'text-blue-100' : 'text-slate-600'}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-full transition-colors ${
                isOrder ? 'hover:bg-white/20 text-white/80' : 'hover:bg-slate-100 text-slate-400'
              }`}
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
