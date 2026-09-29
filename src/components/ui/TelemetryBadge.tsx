import React from 'react';
import type { TelemetryStatus } from '../../types/telemetry';

interface TelemetryBadgeProps {
  status?: TelemetryStatus | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  isDerived?: boolean;
}

export const TelemetryBadge: React.FC<TelemetryBadgeProps> = ({
  status = 'normal',
  label,
  size = 'md',
  isDerived = false,
}) => {
  const getStyles = () => {
    if (isDerived) {
      return {
        bg: 'bg-sky-950/50 border-sky-500/40 text-sky-300',
        dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]',
      };
    }

    switch (status) {
      case 'normal':
      case 'healthy':
      case 'HEALTHY':
      case 'NORMAL':
        return {
          bg: 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
        };
      case 'attention':
      case 'warning':
      case 'ATTENTION':
        return {
          bg: 'bg-amber-950/50 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-pulse',
        };
      case 'critical':
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/50 border-rose-500/50 text-rose-300',
          dot: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-ping',
        };
      default:
        return {
          bg: 'bg-slate-900/70 border-slate-700/70 text-slate-300',
          dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]',
        };
    }
  };

  const style = getStyles();
  const text = label || (isDerived ? 'DERIVED (V × I)' : status.toUpperCase());

  const sizeClass = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-wider uppercase rounded-md border backdrop-blur-sm transition-all duration-200 ${style.bg} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{text}</span>
    </span>
  );
};
