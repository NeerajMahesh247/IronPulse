import React, { useId } from 'react';

interface SignalSparklineProps {
  data: number[];
  color?: 'blue' | 'green' | 'amber' | 'red';
  height?: number;
  width?: number | string;
  showGradient?: boolean;
  strokeWidth?: number;
}

export const SignalSparkline: React.FC<SignalSparklineProps> = ({
  data,
  color = 'blue',
  height = 40,
  width = '100%',
  showGradient = true,
  strokeWidth = 2,
}) => {
  const gradientId = useId();

  if (!data || data.length < 2) {
    return <div className="h-10 w-full bg-iron-900/50 rounded animate-pulse" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const isFlat = max - min === 0;
  const range = isFlat ? 1 : max - min;
  const padding = 4;
  const h = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const normalizedY = isFlat ? 0.5 : (val - min) / range;
    const y = height - padding - normalizedY * h;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    return `${acc} C ${cpX1},${prev.y} ${cpX2},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L 100,${height} L 0,${height} Z`;

  const colorMap = {
    blue: {
      stroke: '#38bdf8',
      gradientStart: 'rgba(56, 189, 248, 0.25)',
      gradientEnd: 'rgba(56, 189, 248, 0.0)',
      glow: 'drop-shadow(0 0 3px rgba(56, 189, 248, 0.4))',
    },
    green: {
      stroke: '#10b981',
      gradientStart: 'rgba(16, 185, 129, 0.25)',
      gradientEnd: 'rgba(16, 185, 129, 0.0)',
      glow: 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.4))',
    },
    amber: {
      stroke: '#f59e0b',
      gradientStart: 'rgba(245, 158, 11, 0.25)',
      gradientEnd: 'rgba(245, 158, 11, 0.0)',
      glow: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.4))',
    },
    red: {
      stroke: '#ef4444',
      gradientStart: 'rgba(239, 68, 68, 0.25)',
      gradientEnd: 'rgba(239, 68, 68, 0.0)',
      glow: 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.4))',
    },
  }[color];

  return (
    <div className="w-full relative overflow-hidden" style={{ height }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full block overflow-visible"
        style={{ width }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorMap.gradientStart} />
            <stop offset="100%" stopColor={colorMap.gradientEnd} />
          </linearGradient>
        </defs>

        {showGradient && (
          <path d={areaD} fill={`url(#${gradientId})`} />
        )}

        <path
          d={pathD}
          fill="none"
          stroke={colorMap.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: colorMap.glow }}
        />

        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={2.2}
            fill={colorMap.stroke}
          />
        )}
      </svg>
    </div>
  );
};
