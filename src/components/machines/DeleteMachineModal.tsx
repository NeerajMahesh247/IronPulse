import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';
import type { Machine } from '../../types/machine';

interface DeleteMachineModalProps {
  isOpen: boolean;
  machine: Machine | null;
  onClose: () => void;
  onConfirm: (machineDocId: string) => Promise<void>;
}

export const DeleteMachineModal: React.FC<DeleteMachineModalProps> = ({
  isOpen,
  machine,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !machine) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm(machine.id);
      onClose();
    } catch (err: unknown) {
      console.error('Delete machine error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to delete machine.';
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-iron-900 border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-iron-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span id="delete-title">Confirm Machine Deletion</span>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-iron-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2 text-xs font-sans text-slate-300">
            <p id="delete-desc">
              Are you sure you want to remove this equipment from the active IronPulse fleet?
            </p>

            <div className="p-3.5 rounded-lg bg-iron-950 border border-slate-800 space-y-1.5 font-mono">
              <div className="text-white font-bold text-sm">
                {machine.machineName}
              </div>
              <div className="text-[11px] text-sky-400">
                Tag ID: <span className="font-semibold">{machine.machineId}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Type: {machine.machineType} · Location: {machine.location}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-iron-950/60 p-2.5 rounded border border-slate-800/80">
              ⚠️ <strong>Safety note:</strong> This action permanently deletes the equipment registry entry. Telemetry logs and historical database records will remain intact.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/70 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-300 border border-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Machine</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
