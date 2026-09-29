import React from 'react';

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  variant?: 'default' | 'blue' | 'green' | 'amber';
  cornerAccents?: boolean;
  onClick?: () => void;
}

export const TechCard: React.FC<TechCardProps> = ({
  children,
  className = '',
  active = false,
  variant = 'default',
  cornerAccents = false,
  onClick,
}) => {
  const variantStyles = {
    default: 'border-slate-800/80 bg-iron-900/90 hover:border-slate-700/90',
    blue: 'border-sky-500/30 bg-iron-900/95 shadow-glow-blue',
    green: 'border-emerald-500/30 bg-iron-900/95 shadow-glow-green',
    amber: 'border-amber-500/30 bg-iron-900/95 shadow-glow-amber',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg border backdrop-blur-sm transition-all duration-200 ${variantStyles} ${
        active ? 'ring-1 ring-sky-500/50' : ''
      } ${className}`}
    >
      {cornerAccents && (
        <>
          <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-sky-400/50 pointer-events-none" />
          <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-sky-400/50 pointer-events-none" />
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-sky-400/50 pointer-events-none" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-sky-400/50 pointer-events-none" />
        </>
      )}

      {children}
    </div>
  );
};
