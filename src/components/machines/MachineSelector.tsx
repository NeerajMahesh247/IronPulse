import React from 'react';
import { Plus, ChevronDown, Radio, Eye, Edit3, Trash2, Cpu } from 'lucide-react';
import type { Machine } from '../../types/machine';

interface MachineSelectorProps {
  machines: Machine[];
  selectedMachine: Machine | null;
  onSelectMachine: (machineId: string) => void;
  onAddMachine: () => void;
  onViewDetails: (machine: Machine) => void;
  onEditMachine: (machine: Machine) => void;
  onDeleteMachine: (machine: Machine) => void;
}

export const MachineSelector: React.FC<MachineSelectorProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  onAddMachine,
  onViewDetails,
  onEditMachine,
  onDeleteMachine,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-iron-900 border border-slate-800 shadow-lg space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Current Machine Title & Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Monitored Equipment Fleet
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300">Current Machine:</span>
                <span className="font-display font-bold text-sm text-white">
                  {selectedMachine ? selectedMachine.machineName : 'No Machine Selected'}
                </span>
              </div>
            </div>
          </div>

          {/* Machine Dropdown Selector */}
          {machines.length > 0 && (
            <div className="relative inline-block w-full sm:w-auto min-w-[220px]">
              <select
                aria-label="Select Machine to Monitor"
                value={selectedMachine ? selectedMachine.id : ''}
                onChange={(e) => onSelectMachine(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2 text-xs font-mono rounded-lg bg-iron-950 border border-slate-700 hover:border-sky-500/60 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition-colors shadow-inner"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id} className="bg-iron-900 text-slate-100">
                    {m.machineName} ({m.machineId}) {m.sensorConnected ? '• [LIVE]' : '• [OFFLINE]'}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Add Machine Button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 font-mono text-xs">
          {selectedMachine && (
            <>
              {/* Telemetry Status Indicator for Selected Machine */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-iron-950 border border-slate-800 text-[11px]">
                {selectedMachine.sensorConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                    <span className="text-emerald-400 font-semibold">LIVE HARDWARE LINK</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-slate-400 font-normal">NO SENSOR CONNECTED</span>
                  </>
                )}
              </div>

              {/* View Details Button */}
              <button
                onClick={() => onViewDetails(selectedMachine)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-200 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40 transition-colors text-xs"
                title="View equipment specifications & telemetry"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>View Details</span>
              </button>

              {/* Edit Machine Button */}
              <button
                onClick={() => onEditMachine(selectedMachine)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs"
                title="Edit machine configuration"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Edit</span>
              </button>

              {/* Delete Machine Button */}
              <button
                onClick={() => onDeleteMachine(selectedMachine)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-iron-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 transition-colors text-xs"
                title="Delete this machine"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </>
          )}

          {/* ADD MACHINE BUTTON (Prominent, matching specification 1) */}
          <button
            onClick={onAddMachine}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-iron-950 font-bold transition-all shadow-md shadow-sky-500/25 active:scale-[0.98] text-xs"
            title="Register new machine to the IronPulse dashboard"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Machine</span>
          </button>
        </div>
      </div>

      {/* Selected Machine Metadata Bar */}
      {selectedMachine && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Tag: <strong className="text-sky-300">{selectedMachine.machineId}</strong>
            </span>
            <span>
              Type: <strong className="text-slate-200">{selectedMachine.machineType}</strong>
            </span>
            <span>
              Location: <strong className="text-slate-200">{selectedMachine.location}</strong>
            </span>
            <span>
              Rating: <strong className="text-slate-200">{selectedMachine.ratedVoltage}V / {selectedMachine.ratedCurrent}A / {selectedMachine.frequency}Hz</strong>
            </span>
            {selectedMachine.ratedPower && (
              <span>
                Power: <strong className="text-slate-200">{selectedMachine.ratedPower} kW</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Radio className={`w-3 h-3 ${selectedMachine.sensorConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className={selectedMachine.sensorConnected ? 'text-emerald-400' : 'text-slate-500'}>
              {selectedMachine.sensorConnected
                ? 'Designated Hardware Source: Arduino Uno (Flask API)'
                : 'Telemetry Stream Offline (No sensor linked)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
