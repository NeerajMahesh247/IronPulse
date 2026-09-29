import React from 'react';
import { TechCard } from '../ui/TechCard';
import { TelemetryBadge } from '../ui/TelemetryBadge';
import { useMockTelemetry } from '../../hooks/useMockTelemetry';
import { Info } from 'lucide-react';

interface HealthScoreProps {
  telemetry: ReturnType<typeof useMockTelemetry>;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ telemetry }) => {
  const { metrics, isAnomalyMode } = telemetry;

  const score = metrics.overallHealthScore;
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const parameters = [
    {
      name: 'TEMPERATURE',
      value: `${metrics.temperature.value} °C`,
      status: metrics.temperature.status,
      weight: '30% Weight',
      note: isAnomalyMode ? 'Elevated casing thermal rise' : 'Optimal continuous operating band',
      isDerived: false,
    },
    {
      name: 'CURRENT',
      value: `${metrics.current.value} A`,
      status: metrics.current.status,
      weight: '35% Weight',
      note: isAnomalyMode ? 'Current draw exceeding full load amps' : 'Within continuous full-load rating',
      isDerived: false,
    },
    {
      name: 'VOLTAGE',
      value: `${metrics.voltage.value} V`,
      status: metrics.voltage.status,
      weight: '15% Weight',
      note: 'Supply line potential nominal',
      isDerived: false,
    },
    {
      name: 'POWER',
      value: `${metrics.power.value} kW`,
      status: metrics.power.status,
      weight: '20% Weight',
      note: isAnomalyMode ? 'Excessive electrical energy loading' : 'Balanced active load vector (V × I)',
      isDerived: true,
    },
  ];

  return (
    <section id="health-score" className="relative py-16 md:py-24 bg-iron-950 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>HEALTH INDEX MODEL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Synthesized{' '}
            <span className="text-sky-400">Motor Health Score.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Iron Pulse continuously evaluates incoming thermal and electrical streams against standard motor baselines to synthesize a unified, easy-to-understand health indicator.
          </p>
        </div>

        <TechCard className="p-6 sm:p-8 max-w-4xl mx-auto bg-iron-900 border-slate-800">
          {/* Header Notice Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded bg-iron-950 border border-slate-800 mb-7 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                CLASSIFICATION: <strong className="text-slate-200">DEMO HEALTH SCORE</strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Multi-Vector Electrical & Thermal Index
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Score Dial */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded bg-iron-950 border border-slate-800 relative">
              <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={isAnomalyMode ? '#f59e0b' : '#10b981'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Motor Health
                </span>
                <span
                  className={`text-5xl font-display font-extrabold tracking-tight ${
                    isAnomalyMode ? 'text-amber-400' : 'text-white'
                  }`}
                >
                  {score}%
                </span>
                <span
                  className={`text-xs font-mono font-semibold mt-1 px-2.5 py-0.5 rounded ${
                    isAnomalyMode
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {metrics.systemStatus === 'NORMAL' ? 'HEALTHY' : 'ATTENTION'}
                </span>
              </div>
            </div>

            {/* Right: 4 Sub-parameters */}
            <div className="md:col-span-7 space-y-2.5 font-mono">
              <div className="text-xs text-slate-400 uppercase tracking-wider pb-1 flex justify-between">
                <span>Parameter</span>
                <span>Status & Contribution</span>
              </div>

              {parameters.map(param => (
                <div
                  key={param.name}
                  className="p-3 rounded bg-iron-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{param.name}</span>
                      <span className="text-white font-bold">({param.value})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{param.note}</span>
                  </div>

                  <div className="text-right">
                    <TelemetryBadge status={param.status} isDerived={param.isDerived} size="sm" />
                    <span className="text-[9px] text-slate-500 block mt-0.5">{param.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-slate-400">
            <p className="leading-relaxed">
              * The Motor Health Score is simulated in Phase 1. Subsequent phases will calibrate dynamic weights against empirical motor operational field data.
            </p>
          </div>
        </TechCard>
      </div>
    </section>
  );
};
