import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-iron-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/20'
                : isError
                ? 'bg-iron-900/95 border-rose-500/50 text-slate-100 shadow-rose-950/20'
                : isWarning
                ? 'bg-iron-900/95 border-amber-500/40 text-slate-100 shadow-amber-950/20'
                : 'bg-iron-900/95 border-sky-500/40 text-slate-100 shadow-sky-950/20'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>

            <div className="flex-1 space-y-0.5 font-sans">
              {toast.title && (
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800/50"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
