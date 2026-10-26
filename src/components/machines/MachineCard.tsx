import React from 'react';
import { Eye, Edit3, Trash2, MapPin } from 'lucide-react';
import { TechCard } from '../ui/TechCard';
import type { Machine } from '../../types/machine';

interface MachineCardProps {
  machine: Machine;
  isSelected: boolean;
  onSelect: (machineId: string) => void;
  onViewDetails: (machine: Machine) => void;
  onEdit: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  isSelected,
  onSelect,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const isLive = machine.sensorConnected;

  return (
    <TechCard
      className={`p-5 space-y-4 transition-all duration-200 border ${
        isSelected
          ? 'bg-iron-900 border-sky-500/70 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30'
          : 'bg-iron-900/90 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header: Tag ID & Status Badge */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-iron-950 border border-slate-800 text-sky-400 font-bold text-[11px]">
            {machine.machineId}
          </span>
          <span className="text-[10px] text-slate-400">
            {machine.machineType}
          </span>
        </div>

        {/* Live or Offline Status */}
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
              <span>LIVE SENSOR</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-iron-950 text-slate-400 border border-slate-800 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span>OFFLINE</span>
            </span>
          )}
        </div>
      </div>

      {/* Machine Name and Location */}
      <div className="space-y-1">
        <h3 className="font-display font-bold text-base text-white truncate" title={machine.machineName}>
          {machine.machineName}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{machine.location}</span>
        </div>
      </div>

      {/* Electrical Specifications Grid */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1 border-t border-slate-800/80">
        <div className="p-2 rounded bg-iron-950 border border-slate-800/90 flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Voltage</span>
          <span className="text-slate-200 font-bold text-[11px] mt-0.5">{machine.ratedVoltage} V</span>
        </div>
        <div className="p-2 rounded bg-iron-950 border border-slate-800/90 flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Current</span>
          <span className="text-slate-200 font-bold text-[11px] mt-0.5">{machine.ratedCurrent} A</span>
        </div>
        <div className="p-2 rounded bg-iron-950 border border-slate-800/90 flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Freq</span>
          <span className="text-slate-200 font-bold text-[11px] mt-0.5">{machine.frequency} Hz</span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          {/* Select Button */}
          <button
            onClick={() => onSelect(machine.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                : 'bg-iron-950 hover:bg-iron-850 text-slate-300 border border-slate-800'
            }`}
          >
            {isSelected ? 'Active' : 'Monitor'}
          </button>

          {/* View Details Button */}
          <button
            onClick={() => onViewDetails(machine)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs"
            title="View full equipment specifications & metrics"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Details</span>
          </button>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(machine)}
            className="p-1.5 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Edit machine details"
            aria-label="Edit machine"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(machine)}
            className="p-1.5 rounded-lg bg-iron-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors"
            title="Delete machine"
            aria-label="Delete machine"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </TechCard>
  );
};
