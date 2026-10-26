import React from 'react';
import {
  X,
  Cpu,
  Radio,
  Zap,
  Activity,
  Layers,
  Edit3,
} from 'lucide-react';
import { TelemetryBadge } from '../ui/TelemetryBadge';
import { SignalSparkline } from '../ui/SignalSparkline';
import type { Machine } from '../../types/machine';
import type { useMockTelemetry } from '../../hooks/useMockTelemetry';

interface MachineDetailsModalProps {
  isOpen: boolean;
  machine: Machine | null;
  onClose: () => void;
  onEdit: (machine: Machine) => void;
  telemetry: ReturnType<typeof useMockTelemetry>;
}

export const MachineDetailsModal: React.FC<MachineDetailsModalProps> = ({
  isOpen,
  machine,
  onClose,
  onEdit,
  telemetry,
}) => {
  if (!isOpen || !machine) return null;

  const isLive = machine.sensorConnected;
  const { metrics, history, isAnomalyMode } = telemetry;

  const tempData = history.map((h) => h.temperature);
  const currentData = history.map((h) => h.current);
  const voltageData = history.map((h) => h.voltage);
  const powerData = history.map((h) => h.power);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div
        className="w-full max-w-4xl bg-iron-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-iron-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="details-title" className="font-display font-bold text-base text-white tracking-tight">
                  {machine.machineName}
                </h3>
                <span className="px-2 py-0.5 rounded bg-iron-900 border border-slate-800 font-mono text-[10px] text-sky-300">
                  {machine.machineId}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {machine.machineType} · {machine.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(machine);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-iron-900 hover:bg-iron-850 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Edit</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-iron-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* SECTION 1: HARDWARE TELEMETRY STATUS BANNER */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs ${
              isLive
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-iron-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className={`w-4 h-4 shrink-0 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <div>
                <strong className={isLive ? 'text-emerald-400' : 'text-slate-200'}>
                  {isLive ? 'LIVE HARDWARE SENSORS CONNECTED' : 'NO SENSOR CONNECTED TO THIS MACHINE'}
                </strong>
                <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                  {isLive
                    ? 'Arduino Uno edge node actively streaming PT100 thermal, ACS712 current, and ZMPT101B voltage vectors.'
                    : 'Physical telemetry is isolated to designated equipment. Sensor readings are not duplicated across machines.'}
                </p>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider shrink-0 uppercase ${
                isLive
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                  : 'bg-iron-900 text-slate-400 border border-slate-800'
              }`}
            >
              {isLive ? 'ONLINE (1.0S CYCLE)' : 'OFFLINE'}
            </span>
          </div>

          {/* SECTION 2: RATED SPECIFICATIONS & EQUIPMENT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rated Operating Specifications */}
            <div className="p-4 rounded-xl bg-iron-950 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider pb-2 border-b border-slate-850">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Rated Operating Specifications</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-iron-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Rated Voltage</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{machine.ratedVoltage} V</span>
                </div>

                <div className="p-2.5 rounded bg-iron-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Rated Current</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{machine.ratedCurrent} A</span>
                </div>

                <div className="p-2.5 rounded bg-iron-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Operating Frequency</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{machine.frequency} Hz</span>
                </div>

                <div className="p-2.5 rounded bg-iron-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Rated Power</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">
                    {machine.ratedPower ? `${machine.ratedPower} kW` : 'Not Specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Equipment Nameplate & Inventory Info */}
            <div className="p-4 rounded-xl bg-iron-950 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-850">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Nameplate & Inventory Information</span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Manufacturer:</span>
                  <span className="text-slate-200 font-medium font-mono">{machine.manufacturer || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Model Number:</span>
                  <span className="text-slate-200 font-medium font-mono">{machine.modelNumber || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200 font-medium">{machine.location}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Installation Date:</span>
                  <span className="text-slate-200 font-medium font-mono">{machine.installationDate || '—'}</span>
                </div>

                {machine.description && (
                  <div className="pt-1.5 border-t border-slate-850">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Notes & Description:</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-iron-900/60 p-2 rounded border border-slate-800">
                      {machine.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: LIVE TELEMETRY OR OFFLINE MESSAGE */}
          {isLive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-slate-300 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">LIVE SENSOR DIAGNOSTICS & TELEMETRY</span>
                </div>
                <span className="text-sky-400 font-mono text-[11px]">
                  HEALTH SCORE: <strong>{metrics.overallHealthScore}%</strong>
                </span>
              </div>

              {/* 4 Primary Sensing Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                {/* Temperature */}
                <div className="p-3.5 rounded-lg bg-iron-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Temperature</span>
                    <TelemetryBadge status={metrics.temperature.status} size="sm" />
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {metrics.temperature.value} °C
                  </div>
                  <div className="text-[9px] text-slate-500">PT100 RTD Sensor</div>
                </div>

                {/* Current */}
                <div className="p-3.5 rounded-lg bg-iron-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Current</span>
                    <TelemetryBadge status={metrics.current.status} size="sm" />
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {metrics.current.value} A
                  </div>
                  <div className="text-[9px] text-slate-500">ACS712 30A Clamp</div>
                </div>

                {/* Voltage */}
                <div className="p-3.5 rounded-lg bg-iron-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Voltage</span>
                    <TelemetryBadge status={metrics.voltage.status} size="sm" />
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {metrics.voltage.value} V
                  </div>
                  <div className="text-[9px] text-slate-500">ZMPT101B Sensor</div>
                </div>

                {/* Active Power */}
                <div className="p-3.5 rounded-lg bg-iron-950 border border-sky-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-sky-400 uppercase">Power</span>
                    <TelemetryBadge isDerived size="sm" />
                  </div>
                  <div className="text-xl font-bold text-sky-300 mt-1">
                    {metrics.power.value} kW
                  </div>
                  <div className="text-[9px] text-slate-400">P = V × I Active Load</div>
                </div>
              </div>

              {/* Sparkline History Graphs */}
              <div className="p-4 rounded-xl bg-iron-950 border border-slate-800 space-y-3 font-mono">
                <span className="text-xs text-slate-300 font-semibold block uppercase">
                  Recent Telemetry Waveforms (Rolling Buffer)
                </span>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-sky-400">Temperature (°C)</span>
                      <span className="text-white font-bold">{metrics.temperature.value} °C</span>
                    </div>
                    <SignalSparkline data={tempData} color={isAnomalyMode ? 'amber' : 'blue'} height={38} strokeWidth={2} />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-sky-400">Motor Current (A)</span>
                      <span className="text-white font-bold">{metrics.current.value} A</span>
                    </div>
                    <SignalSparkline data={currentData} color={isAnomalyMode ? 'amber' : 'blue'} height={38} strokeWidth={2} />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-sky-400">Supply Voltage (V)</span>
                      <span className="text-white font-bold">{metrics.voltage.value} V</span>
                    </div>
                    <SignalSparkline data={voltageData} color={isAnomalyMode ? 'amber' : 'blue'} height={38} strokeWidth={2} />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-sky-300">Active Power (kW)</span>
                      <span className="text-white font-bold">{metrics.power.value} kW</span>
                    </div>
                    <SignalSparkline data={powerData} color={isAnomalyMode ? 'amber' : 'blue'} height={38} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Unconnected / Offline Notification Panel */
            <div className="p-6 rounded-xl bg-iron-950 border border-slate-800 text-center space-y-3 max-w-lg mx-auto">
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800/60 text-slate-400 flex items-center justify-center">
                <Radio className="w-5 h-5 text-slate-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-white">
                  No sensor connected to this machine.
                </h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  The physical Arduino Uno telemetry feed is reserved for the designated primary motor. To display live readings for this machine, enable hardware linkage in machine settings or deploy an additional edge sampling node.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(machine);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-iron-900 hover:bg-iron-850 text-sky-400 border border-slate-700 text-xs font-mono transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configure Sensor Linkage</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-iron-950 border-t border-slate-800 flex items-center justify-end font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-iron-900 hover:bg-iron-850 text-slate-300 border border-slate-800 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
