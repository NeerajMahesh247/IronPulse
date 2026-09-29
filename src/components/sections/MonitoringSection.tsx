import React from 'react';
import { TelemetryBadge } from '../ui/TelemetryBadge';
import { SignalSparkline } from '../ui/SignalSparkline';
import { useMockTelemetry } from '../../hooks/useMockTelemetry';
import { ArrowUp, Minus, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';

interface MonitoringSectionProps {
  telemetry: ReturnType<typeof useMockTelemetry>;
}

export const MonitoringSection: React.FC<MonitoringSectionProps> = ({ telemetry }) => {
  const { metrics, history, isAnomalyMode, toggleAnomalyMode } = telemetry;

  const streams = [
    {
      name: 'TEMPERATURE',
      icon: 'T',
      reading: `${metrics.temperature.value} °C`,
      trend: isAnomalyMode ? 'RISING (+22.6 °C)' : 'STEADY (±0.4 °C)',
      status: metrics.temperature.status,
      color: isAnomalyMode ? 'amber' : 'blue',
      data: history.map(h => h.temperature),
      isDerived: false,
    },
    {
      name: 'CURRENT',
      icon: 'I',
      reading: `${metrics.current.value} A`,
      trend: isAnomalyMode ? 'OVERLOAD DRAW (+5.02 A)' : 'NAMEPLATE BASELINE',
      status: metrics.current.status,
      color: isAnomalyMode ? 'amber' : 'blue',
      data: history.map(h => h.current),
      isDerived: false,
    },
    {
      name: 'VOLTAGE',
      icon: 'V',
      reading: `${metrics.voltage.value} V`,
      trend: `REGULATED AC (${metrics.voltage.value} V)`,
      status: metrics.voltage.status,
      color: 'blue',
      data: history.map(h => h.voltage),
      isDerived: false,
    },
    {
      name: 'POWER',
      icon: 'P',
      reading: `${metrics.power.value} kW`,
      trend: isAnomalyMode ? 'HIGH CONSUMPTION (+1.30 kW)' : 'RATED LOAD',
      status: metrics.power.status,
      color: isAnomalyMode ? 'amber' : 'blue',
      data: history.map(h => h.power),
      isDerived: true,
    },
  ];

  return (
    <section id="monitoring" className="relative py-16 md:py-24 bg-iron-900/60 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>MULTI-SIGNAL CORRELATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            One reading is data.{' '}
            <span className="text-sky-400">A pattern is insight.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            A single metric rarely explains a mechanical or electrical issue. Iron Pulse correlates temperature, current draw, voltage, and calculated power to uncover the underlying cause of machine stress.
          </p>
        </div>

        {/* 4-Stream Convergence Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10">
          {/* Left: 4 Streams */}
          <div className="lg:col-span-6 space-y-2.5 font-mono">
            <div className="flex justify-between items-center px-1 text-xs text-slate-400">
              <span>SYNCHRONIZED SENSOR STREAM</span>
              <span className="text-sky-400">4-PARAMETER MATRIX</span>
            </div>

            {streams.map((stream) => (
              <div
                key={stream.name}
                className="p-3 rounded bg-iron-950 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className="w-7 h-7 rounded bg-iron-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-sky-400">
                    {stream.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{stream.name}</span>
                      {stream.isDerived && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                          V × I
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{stream.trend}</span>
                  </div>
                </div>

                <div className="hidden sm:block w-32">
                  <SignalSparkline data={stream.data} color={stream.color as any} height={24} />
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-100 block">{stream.reading}</span>
                  <TelemetryBadge status={stream.status} size="sm" isDerived={stream.isDerived} />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Correlation Analysis Box */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-iron-950 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Multi-Parameter Pattern Analysis</span>
              </div>
              <TelemetryBadge
                status={isAnomalyMode ? 'attention' : 'normal'}
                label={isAnomalyMode ? 'ABNORMAL LOAD PATTERN' : 'NOMINAL BASELINE'}
              />
            </div>

            {/* Pattern Matrix */}
            <div className="p-3.5 rounded bg-iron-900 border border-slate-800 font-mono text-xs space-y-2.5">
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">
                Correlation Matrix Behavior
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                <div className="p-2 rounded bg-iron-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Temperature</div>
                  <div className={`font-bold flex items-center gap-1 ${isAnomalyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isAnomalyMode ? <ArrowUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    <span>{metrics.temperature.value} °C</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-iron-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Current</div>
                  <div className={`font-bold flex items-center gap-1 ${isAnomalyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isAnomalyMode ? <ArrowUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    <span>{metrics.current.value} A</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-iron-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Voltage</div>
                  <div className="font-bold flex items-center gap-1 text-slate-200">
                    <Minus className="w-3.5 h-3.5 text-slate-500" />
                    <span>{metrics.voltage.value} V</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-iron-950 border border-slate-800">
                  <div className="text-[10px] text-sky-400">Power (V × I)</div>
                  <div className={`font-bold flex items-center gap-1 ${isAnomalyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isAnomalyMode ? <ArrowUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    <span>{metrics.power.value} kW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Diagnostic Interpretation */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {isAnomalyMode ? (
                <div className="p-3.5 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>EARLY WARNING: Abnormal Motor Loading & Thermal Surge</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 font-sans">
                    Temperature is rising concurrently with elevated current while supply voltage remains flat. This pattern indicates excessive mechanical load, pump impeller binding, or bearing degradation before a thermal trip.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>MACHINE STATUS: Nominal Continuous Operation</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 font-sans">
                    Motor current draw, thermal envelope, and power consumption correlate cleanly with standard full-load nameplate ratings.
                  </p>
                </div>
              )}
            </div>

            {/* Simulation Trigger */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Test analysis engine response:
              </span>
              <button
                onClick={toggleAnomalyMode}
                className="px-3.5 py-1.5 text-xs font-mono font-semibold rounded bg-iron-900 hover:bg-iron-850 text-sky-400 border border-slate-700 hover:border-slate-600 transition-all"
              >
                {isAnomalyMode ? 'Reset to Nominal State' : 'Simulate Abnormal Load'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
