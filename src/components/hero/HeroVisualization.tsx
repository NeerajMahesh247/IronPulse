import React, { useState } from 'react';
import { TelemetryBadge } from '../ui/TelemetryBadge';
import { SignalSparkline } from '../ui/SignalSparkline';
import { useMockTelemetry } from '../../hooks/useMockTelemetry';
import { Thermometer, Zap, Radio, AlertTriangle, RefreshCw } from 'lucide-react';

interface HeroVisualizationProps {
  telemetry: ReturnType<typeof useMockTelemetry>;
}

export const HeroVisualization: React.FC<HeroVisualizationProps> = ({ telemetry }) => {
  const { metrics, history, isAnomalyMode, toggleAnomalyMode } = telemetry;
  const [selectedTap, setSelectedTap] = useState<string | null>(null);

  const tempData = history.map(h => h.temperature);
  const currentData = history.map(h => h.current);

  return (
    <div className="relative w-full rounded-xl bg-iron-900 border border-slate-800 shadow-2xl p-4 sm:p-6 lg:p-7 overflow-hidden">
      {/* Background Engineering Grid */}
      <div className="absolute inset-0 bg-industrial-grid opacity-30 pointer-events-none" />

      {/* Header Bar with Live Motor Telemetry Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-iron-950 border border-slate-800 font-mono text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>UNIT: <strong className="text-white">IM-3P-415V-01</strong></span>
          </div>
          <TelemetryBadge
            status={metrics.systemStatus}
            label={metrics.systemStatus === 'NORMAL' ? 'STATUS: NORMAL' : 'ATTENTION: ABNORMAL LOAD'}
            size="sm"
          />
          {selectedTap && (
            <span className="font-mono text-[10px] text-sky-300 px-2 py-0.5 rounded bg-iron-950 border border-sky-500/30">
              {selectedTap}
            </span>
          )}
        </div>

        {/* Anomaly Simulator Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAnomalyMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all duration-150 border ${
              isAnomalyMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-glow-amber'
                : 'bg-iron-950 hover:bg-iron-850 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            {isAnomalyMode ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulating Overload (Click to Reset)</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                <span>Simulate Load Anomaly</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Industrial Machine to Insight Flow */}
      <div className="relative z-10 hidden sm:flex items-center justify-center gap-2 py-1.5 px-4 mb-5 rounded bg-iron-950/80 border border-slate-800 font-mono text-[11px] text-slate-400">
        <span className="text-slate-200 font-medium">Induction Motor</span>
        <span className="text-sky-400">→</span>
        <span className="text-slate-200 font-medium">Electrical & Thermal Sensors</span>
        <span className="text-sky-400">→</span>
        <span className="text-sky-300 font-semibold">Iron Pulse Analysis</span>
        <span className="text-sky-400">→</span>
        <span className="text-emerald-400 font-semibold">Machine Health</span>
      </div>

      {/* Center Layout: Industrial Motor Schematic & Telemetry Stack */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Industrial Induction Motor Blueprint SVG */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center p-4 rounded-lg bg-iron-950 border border-slate-800/90">
          <svg
            viewBox="0 0 540 300"
            className="w-full h-auto max-w-[500px] select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="motorBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Base Mounting Feet */}
            <rect x="150" y="225" width="40" height="20" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
            <rect x="320" y="225" width="40" height="20" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
            <line x1="120" y1="245" x2="420" y2="245" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

            {/* Motor Main Cylindrical Stator Housing */}
            <rect x="150" y="90" width="210" height="135" rx="8" fill="url(#motorBodyGrad)" stroke="#475569" strokeWidth="2" />

            {/* Industrial Cooling Fins across Stator */}
            {[105, 120, 135, 150, 165, 180, 195, 210].map((y) => (
              <line
                key={y}
                x1="150"
                y1={y}
                x2="360"
                y2={y}
                stroke="#334155"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Terminal Box (Top of Motor) */}
            <rect x="220" y="48" width="70" height="42" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="255" y="70" fill="#94a3b8" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle" fontWeight="bold">
              TERMINAL BOX
            </text>
            <text x="255" y="80" fill="#38bdf8" fontSize="7" fontFamily="IBM Plex Mono" textAnchor="middle">
              3-PHASE AC
            </text>

            {/* Motor Drive End Cap & Shaft */}
            <path d="M 360 115 L 390 125 L 390 190 L 360 200 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            
            {/* Drive Shaft extending to Pump / Mechanical Coupling */}
            <rect x="390" y="145" width="70" height="25" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
            
            {/* Industrial Load Coupling (Pump / Machine Interface) */}
            <rect x="450" y="115" width="55" height="85" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="477" y="152" fill="#94a3b8" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">PUMP /</text>
            <text x="477" y="164" fill="#94a3b8" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">LOAD</text>

            {/* Non-Drive End (Cooling Fan Shroud) */}
            <path d="M 150 100 Q 120 100, 120 157 Q 120 215, 150 215 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="130" y1="125" x2="130" y2="190" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* SENSOR NODES */}
            {/* 1. Surface Temperature RTD Probe */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedTap('Surface RTD Probe')}
            >
              <rect x="180" y="80" width="12" height="12" rx="2" fill={isAnomalyMode ? "#f59e0b" : "#38bdf8"} />
              <line x1="186" y1="80" x2="186" y2="35" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
              <rect x="150" y="16" width="72" height="22" rx="3" fill="#0a0d14" stroke="#38bdf8" strokeWidth="1" />
              <text x="186" y="31" fill="#38bdf8" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold" textAnchor="middle">
                {metrics.temperature.value} °C
              </text>
            </g>

            {/* 2. Hall Current Clamp on Terminal Feed */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedTap('Current Clamp Tap')}
            >
              <circle cx="235" cy="48" r="7" fill="#0a0d14" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="235" cy="48" r="3" fill={isAnomalyMode ? "#f59e0b" : "#10b981"} />
              <line x1="235" y1="41" x2="235" y2="15" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
              <rect x="235" y="5" width="70" height="22" rx="3" fill="#0a0d14" stroke="#38bdf8" strokeWidth="1" />
              <text x="270" y="20" fill="#38bdf8" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold" textAnchor="middle">
                {metrics.current.value} A
              </text>
            </g>

            {/* 3. Voltage Tap */}
            <g
              className="cursor-pointer group"
              onClick={() => setSelectedTap('Voltage Terminal Tap')}
            >
              <circle cx="275" cy="48" r="7" fill="#0a0d14" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="275" cy="48" r="3" fill="#38bdf8" />
              <rect x="315" y="40" width="75" height="22" rx="3" fill="#0a0d14" stroke="#38bdf8" strokeWidth="1" />
              <text x="352" y="54" fill="#38bdf8" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold" textAnchor="middle">
                {metrics.voltage.value} V
              </text>
            </g>

            {/* 4. Calculated Power Box */}
            <rect x="330" y="205" width="130" height="32" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="340" y="218" fill="#94a3b8" fontSize="8" fontFamily="IBM Plex Mono">
              CALCULATED POWER
            </text>
            <text x="340" y="230" fill="#38bdf8" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="bold">
              {metrics.power.value} kW (P = V × I)
            </text>
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
            INDUCTION MOTOR SCHEMATIC · SENSOR INTERFACES
          </span>
        </div>

        {/* Right: Live Telemetry Values Stack */}
        <div className="lg:col-span-5 space-y-3 font-mono">
          {/* Metric 1: Temperature */}
          <div className="p-3 rounded bg-iron-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold uppercase tracking-wider">Motor Temperature</span>
              </div>
              <span className={`font-bold text-sm ${isAnomalyMode ? 'text-amber-400' : 'text-slate-100'}`}>
                {metrics.temperature.value} {metrics.temperature.unit}
              </span>
            </div>
            <SignalSparkline data={tempData} color={isAnomalyMode ? 'amber' : 'blue'} height={26} />
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Nominal Baseline: 48.0 °C</span>
              <span>Class F Insulation</span>
            </div>
          </div>

          {/* Metric 2: Motor Current */}
          <div className="p-3 rounded bg-iron-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold uppercase tracking-wider">Motor Current</span>
              </div>
              <span className={`font-bold text-sm ${isAnomalyMode ? 'text-amber-400' : 'text-slate-100'}`}>
                {metrics.current.value} {metrics.current.unit}
              </span>
            </div>
            <SignalSparkline data={currentData} color={isAnomalyMode ? 'amber' : 'blue'} height={26} />
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Full Load Amps: ~6.8 A</span>
              <span>Hall Clamp</span>
            </div>
          </div>

          {/* Metric 3: Voltage & Calculated Power */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-iron-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Supply Voltage</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">
                {metrics.voltage.value} V
              </div>
              <div className="text-[9px] text-slate-500 mt-1">230V Nominal Grid</div>
            </div>

            <div className="p-2.5 rounded bg-iron-950 border border-sky-500/30">
              <div className="text-[10px] text-sky-400 uppercase font-semibold">Power (V × I)</div>
              <div className="text-sm font-bold text-sky-300 mt-0.5">
                {metrics.power.value} kW
              </div>
              <div className="text-[9px] text-slate-400 mt-1">Calculated Load</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
