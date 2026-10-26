import React from 'react';
import { Cpu, Plus, Layers } from 'lucide-react';
import { MachineCard } from './MachineCard';
import type { Machine } from '../../types/machine';

interface MachineListProps {
  machines: Machine[];
  selectedMachineId: string | null;
  onSelectMachine: (machineId: string) => void;
  onAddMachine: () => void;
  onViewDetails: (machine: Machine) => void;
  onEditMachine: (machine: Machine) => void;
  onDeleteMachine: (machine: Machine) => void;
}

export const MachineList: React.FC<MachineListProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  onAddMachine,
  onViewDetails,
  onEditMachine,
  onDeleteMachine,
}) => {
  const liveCount = machines.filter((m) => m.sensorConnected).length;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>REGISTERED EQUIPMENT FLEET</span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Multi-motor monitoring, rated operating thresholds, and sensor channel isolation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-iron-900 border border-slate-800 text-slate-300">
            TOTAL: <strong className="text-white">{machines.length}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-iron-900 border border-slate-800 text-emerald-400">
            LIVE: <strong>{liveCount}</strong>
          </span>
          <button
            onClick={onAddMachine}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-500 hover:bg-sky-400 text-iron-950 font-bold transition-all text-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Machine</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {machines.length === 0 ? (
        <div className="py-14 px-6 rounded-2xl bg-iron-900/60 border border-dashed border-slate-800 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shadow-inner">
            <Cpu className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-lg text-white">
              No machines registered yet.
            </h3>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
              Register your induction motors, water pump drives, or laboratory test bench equipment to start multi-vector diagnostic monitoring.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onAddMachine}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-iron-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Your First Machine</span>
            </button>
          </div>
        </div>
      ) : (
        /* Machines Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              isSelected={machine.id === selectedMachineId}
              onSelect={onSelectMachine}
              onViewDetails={onViewDetails}
              onEdit={onEditMachine}
              onDelete={onDeleteMachine}
            />
          ))}
        </div>
      )}
    </section>
  );
};
