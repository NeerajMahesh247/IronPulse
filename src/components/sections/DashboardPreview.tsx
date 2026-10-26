import React, { useState } from 'react';
import { TelemetryBadge } from '../ui/TelemetryBadge';
import { SignalSparkline } from '../ui/SignalSparkline';
import { useMockTelemetry } from '../../hooks/useMockTelemetry';
import { Play, Pause, RefreshCw, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Machine } from '../../types/machine';

interface DashboardPreviewProps {
  telemetry: ReturnType<typeof useMockTelemetry>;
  selectedMachine?: Machine | null;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ telemetry, selectedMachine }) => {
  const { metrics, history, isAnomalyMode, isPaused, toggleAnomalyMode, togglePause } = telemetry;
  const [activeChannel, setActiveChannel] = useState<'all' | 'thermal' | 'current' | 'voltage' | 'power'>('all');

  const tempData = history.map(h => h.temperature);
  const currentData = history.map(h => h.current);
  const voltageData = history.map(h => h.voltage);
  const powerData = history.map(h => h.power);

  return (
    <section id="dashboard-preview" className="relative py-16 md:py-24 bg-iron-950 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>DASHBOARD INTERFACE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Every motor signal.{' '}
            <span className="text-sky-400">One place.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            A centralized industrial diagnostics dashboard designed for plant electricians, facility technicians, and maintenance managers.
          </p>
        </div>

        {/* Industrial Motor Dashboard Frame */}
        <div className="rounded-xl bg-iron-900 border border-slate-700/80 shadow-2xl overflow-hidden">
          {/* Dashboard Window Header */}
          <div className="px-4 py-3 bg-iron-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-semibold truncate max-w-[280px] sm:max-w-none">
                IRON PULSE // {selectedMachine ? `${selectedMachine.machineName.toUpperCase()} [${selectedMachine.machineId}]` : 'MOTOR DIAGNOSTICS CONSOLE'}
              </span>
              <span className="px-2 py-0.5 rounded bg-iron-900 text-[10px] text-sky-400 border border-slate-800">
                LIVE HARDWARE TELEMETRY
              </span>
            </div>

            {/* Dashboard Action Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-iron-900 hover:bg-iron-850 text-slate-300 border border-slate-700 text-[11px]"
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-400" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleAnomalyMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] border transition-all ${
                  isAnomalyMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-iron-900 hover:bg-iron-850 text-slate-300 border-slate-700'
                }`}
              >
                <RefreshCw className="w-3 h-3 text-sky-400" />
                <span>{isAnomalyMode ? 'Reset Nominal' : 'Inject Load Surge'}</span>
              </button>

              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px]"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Expand</span>
              </Link>
            </div>
          </div>

          {/* Inner Dashboard Body */}
          <div className="p-4 sm:p-6 lg:p-7 space-y-6">
            {/* Top Telemetry KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
              {/* Metric 1: Motor Health */}
              <div className="p-3.5 rounded bg-iron-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Motor Health</span>
                <div className="flex items-baseline justify-between my-1">
                  <span className={`text-2xl font-bold ${isAnomalyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {metrics.overallHealthScore}%
                  </span>
                  <TelemetryBadge status={metrics.systemStatus} size="sm" />
                </div>
                <span className="text-[9px] text-slate-500">
                  {metrics.systemStatus === 'NORMAL' ? 'HEALTHY' : 'ATTENTION'}
                </span>
              </div>

              {/* Metric 2: Temperature */}
              <div className="p-3.5 rounded bg-iron-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Temperature</span>
                <div className="flex items-baseline justify-between my-1">
                  <span className={`text-2xl font-bold ${isAnomalyMode ? 'text-amber-400' : 'text-slate-100'}`}>
                    {metrics.temperature.value} °C
                  </span>
                  <TelemetryBadge status={metrics.temperature.status} size="sm" />
                </div>
                <span className="text-[9px] text-slate-500">Baseline: 40.0 °C</span>
              </div>

              {/* Metric 3: Current */}
              <div className="p-3.5 rounded bg-iron-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Current</span>
                <div className="flex items-baseline justify-between my-1">
                  <span className={`text-2xl font-bold ${isAnomalyMode ? 'text-amber-400' : 'text-slate-100'}`}>
                    {metrics.current.value} A
                  </span>
                  <TelemetryBadge status={metrics.current.status} size="sm" />
                </div>
                <span className="text-[9px] text-slate-500">Baseline: 0.10 A</span>
              </div>

              {/* Metric 4: Voltage */}
              <div className="p-3.5 rounded bg-iron-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Voltage</span>
                <div className="flex items-baseline justify-between my-1">
                  <span className="text-2xl font-bold text-slate-100">
                    {metrics.voltage.value} V
                  </span>
                  <TelemetryBadge status={metrics.voltage.status} label={metrics.voltage.status === 'normal' ? 'STABLE' : undefined} size="sm" />
                </div>
                <span className="text-[9px] text-slate-500">230 V Supply</span>
              </div>

              {/* Metric 5: Power */}
              <div className="p-3.5 rounded bg-iron-950 border border-sky-500/30 flex flex-col justify-between">
                <span className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">
                  Power (V × I)
                </span>
                <div className="flex items-baseline justify-between my-1">
                  <span className="text-2xl font-bold text-sky-300">
                    {metrics.power.value} kW
                  </span>
                  <TelemetryBadge isDerived size="sm" />
                </div>
                <span className="text-[9px] text-slate-400">Calculated Active Load</span>
              </div>
            </div>

            {/* Real-time Telemetry Graphs */}
            <div className="p-4 sm:p-5 rounded bg-iron-950 border border-slate-800 space-y-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Motor Telemetry Graphs
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-iron-900 text-sky-300 border border-slate-700">
                    LIVE DATA STREAM
                  </span>
                </div>

                {/* Channel Filter Toggles */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Trace:</span>
                  <button
                    onClick={() => setActiveChannel('all')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      activeChannel === 'all'
                        ? 'bg-sky-500 text-iron-950 font-bold'
                        : 'bg-iron-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Channels
                  </button>
                  <button
                    onClick={() => setActiveChannel('thermal')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      activeChannel === 'thermal'
                        ? 'bg-sky-500 text-iron-950 font-bold'
                        : 'bg-iron-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Temperature (°C)
                  </button>
                  <button
                    onClick={() => setActiveChannel('current')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      activeChannel === 'current'
                        ? 'bg-sky-500 text-iron-950 font-bold'
                        : 'bg-iron-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Current (A)
                  </button>
                  <button
                    onClick={() => setActiveChannel('voltage')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      activeChannel === 'voltage'
                        ? 'bg-sky-500 text-iron-950 font-bold'
                        : 'bg-iron-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Voltage (V)
                  </button>
                  <button
                    onClick={() => setActiveChannel('power')}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      activeChannel === 'power'
                        ? 'bg-sky-500 text-iron-950 font-bold'
                        : 'bg-iron-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Power (kW)
                  </button>
                </div>
              </div>

              {/* Stacked Real-Time Waveforms */}
              <div className="space-y-4 pt-1">
                {(activeChannel === 'all' || activeChannel === 'thermal') && (
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5 text-sky-400">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Temperature (°C) · Continuous Limit 65.0 °C
                      </span>
                      <span className="text-white font-bold">{metrics.temperature.value} °C</span>
                    </div>
                    <SignalSparkline data={tempData} color={isAnomalyMode ? 'amber' : 'blue'} height={45} strokeWidth={2} />
                  </div>
                )}

                {(activeChannel === 'all' || activeChannel === 'current') && (
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5 text-sky-400">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Motor Current (Amperes) · Rated Limit 9.5 A
                      </span>
                      <span className="text-white font-bold">{metrics.current.value} A</span>
                    </div>
                    <SignalSparkline data={currentData} color={isAnomalyMode ? 'amber' : 'blue'} height={45} strokeWidth={2} />
                  </div>
                )}

                {(activeChannel === 'all' || activeChannel === 'voltage') && (
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5 text-sky-400">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Supply Voltage (Volts) · Nominal 230 V
                      </span>
                      <span className="text-white font-bold">{metrics.voltage.value} V</span>
                    </div>
                    <SignalSparkline data={voltageData} color={isAnomalyMode ? 'amber' : 'blue'} height={45} strokeWidth={2} />
                  </div>
                )}

                {(activeChannel === 'all' || activeChannel === 'power') && (
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5 text-sky-300">
                        <span className="w-2 h-2 rounded-full bg-sky-300" />
                        Calculated Active Power (kW, P = V × I)
                      </span>
                      <span className="text-white font-bold">{metrics.power.value} kW</span>
                    </div>
                    <SignalSparkline data={powerData} color={isAnomalyMode ? 'amber' : 'blue'} height={45} strokeWidth={2} />
                  </div>
                )}
              </div>

              {/* Telemetry Timeline Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-3">
                <span>Buffer: T-25s</span>
                <span>Buffer: T-12s</span>
                <span className="text-sky-400 font-semibold">● T-0s (REAL-TIME STREAM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
