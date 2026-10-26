import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  AlertCircle,
  Loader2,
  Check,
  Radio,
  Sparkles,
} from 'lucide-react';
import type { Machine, MachineType, CreateMachineInput, UpdateMachineInput } from '../../types/machine';

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMachineInput | UpdateMachineInput) => Promise<void>;
  editMachine?: Machine | null;
  existingMachines: Machine[];
  userId: string;
}

const MACHINE_TYPES: MachineType[] = [
  'Induction Motor',
  'Water Pump Motor',
  'Cooler Motor',
  'Other',
];

interface FormErrors {
  machineName?: string;
  machineId?: string;
  machineType?: string;
  location?: string;
  ratedVoltage?: string;
  ratedCurrent?: string;
  frequency?: string;
  ratedPower?: string;
  general?: string;
}

export const AddMachineModal: React.FC<AddMachineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editMachine,
  existingMachines,
  userId,
}) => {
  const isEdit = Boolean(editMachine);

  // Form State
  const [machineName, setMachineName] = useState('');
  const [machineId, setMachineId] = useState('');
  const [machineType, setMachineType] = useState<MachineType>('Induction Motor');
  const [location, setLocation] = useState('');
  const [ratedVoltage, setRatedVoltage] = useState('230');
  const [ratedCurrent, setRatedCurrent] = useState('0.55');
  const [frequency, setFrequency] = useState('50');

  // Optional fields
  const [manufacturer, setManufacturer] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [ratedPower, setRatedPower] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [description, setDescription] = useState('');
  const [sensorConnected, setSensorConnected] = useState(false);

  // Status & Error States
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize state when opening or changing editMachine
  useEffect(() => {
    if (editMachine) {
      setMachineName(editMachine.machineName);
      setMachineId(editMachine.machineId);
      setMachineType(editMachine.machineType);
      setLocation(editMachine.location);
      setRatedVoltage(String(editMachine.ratedVoltage));
      setRatedCurrent(String(editMachine.ratedCurrent));
      setFrequency(String(editMachine.frequency));
      setManufacturer(editMachine.manufacturer || '');
      setModelNumber(editMachine.modelNumber || '');
      setRatedPower(editMachine.ratedPower ? String(editMachine.ratedPower) : '');
      setInstallationDate(editMachine.installationDate || '');
      setDescription(editMachine.description || '');
      setSensorConnected(editMachine.sensorConnected);
    } else {
      // Default initial values for new machine
      setMachineName('');
      setMachineId('');
      setMachineType('Induction Motor');
      setLocation('');
      setRatedVoltage('230');
      setRatedCurrent('0.55');
      setFrequency('50');
      setManufacturer('');
      setModelNumber('');
      setRatedPower('');
      setInstallationDate('');
      setDescription('');
      // If there are currently no machines registered with sensors, default to true for convenient onboarding
      const hasSensorMachine = existingMachines.some((m) => m.sensorConnected);
      setSensorConnected(!hasSensorMachine);
    }
    setErrors({});
  }, [editMachine, isOpen, existingMachines]);

  if (!isOpen) return null;

  // Preset quick fill for the connected hardware setup
  const handlePreFillHardwareSpecs = () => {
    setMachineName('Water Pump Motor 01');
    setMachineId('IP-MOTOR-001');
    setMachineType('Water Pump Motor');
    setLocation('Laboratory');
    setRatedVoltage('230');
    setRatedCurrent('0.55');
    setFrequency('50');
    setManufacturer('Siemens / Kirloskar');
    setModelNumber('1LA7073-4AA10');
    setRatedPower('0.25');
    setInstallationDate(new Date().toISOString().split('T')[0]);
    setDescription('Primary lab test bench motor connected to Arduino Uno, MAX31865 PT100, ACS712, and ZMPT101B.');
    setSensorConnected(true);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Machine Name
    if (!machineName.trim()) {
      newErrors.machineName = 'Machine Name is required.';
    }

    // 2. Machine ID
    const trimmedId = machineId.trim().toUpperCase();
    if (!trimmedId) {
      newErrors.machineId = 'Machine ID is required.';
    } else if (!/^[A-Z0-9_-]+$/.test(trimmedId)) {
      newErrors.machineId = 'Only uppercase alphanumeric, hyphens, and underscores are allowed.';
    } else {
      // Duplicate ID validation within existing machines
      const isDuplicate = existingMachines.some(
        (m) =>
          m.machineId.toUpperCase() === trimmedId &&
          (!editMachine || m.id !== editMachine.id)
      );
      if (isDuplicate) {
        newErrors.machineId = `Machine ID "${trimmedId}" is already registered. IDs must be unique.`;
      }
    }

    // 3. Location
    if (!location.trim()) {
      newErrors.location = 'Location is required.';
    }

    // 4. Rated Voltage
    const voltVal = parseFloat(ratedVoltage);
    if (isNaN(voltVal) || voltVal <= 0) {
      newErrors.ratedVoltage = 'Rated Voltage must be a positive number (e.g. 230).';
    } else if (voltVal < 50 || voltVal > 1000) {
      newErrors.ratedVoltage = 'Voltage typically ranges between 50 V and 1000 V.';
    }

    // 5. Rated Current
    const currVal = parseFloat(ratedCurrent);
    if (isNaN(currVal) || currVal <= 0) {
      newErrors.ratedCurrent = 'Rated Current must be a positive number (e.g. 0.55).';
    } else if (currVal > 500) {
      newErrors.ratedCurrent = 'Rated Current exceeds standard threshold (max 500 A).';
    }

    // 6. Frequency
    const freqVal = parseFloat(frequency);
    if (isNaN(freqVal) || freqVal <= 0) {
      newErrors.frequency = 'Operating Frequency must be a positive number (e.g. 50 or 60).';
    } else if (freqVal < 10 || freqVal > 400) {
      newErrors.frequency = 'Frequency is typically between 10 Hz and 400 Hz.';
    }

    // 7. Optional Rated Power
    if (ratedPower.trim()) {
      const powVal = parseFloat(ratedPower);
      if (isNaN(powVal) || powVal <= 0) {
        newErrors.ratedPower = 'Rated Power must be a positive number (kW).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setErrors({});

      const voltVal = parseFloat(ratedVoltage);
      const currVal = parseFloat(ratedCurrent);
      const freqVal = parseFloat(frequency);
      const powVal = ratedPower.trim() ? parseFloat(ratedPower) : null;

      if (isEdit && editMachine) {
        const updateData: UpdateMachineInput = {
          machineName: machineName.trim(),
          machineId: machineId.trim().toUpperCase(),
          machineType,
          location: location.trim(),
          ratedVoltage: voltVal,
          ratedCurrent: currVal,
          frequency: freqVal,
          manufacturer: manufacturer.trim(),
          modelNumber: modelNumber.trim(),
          ratedPower: powVal,
          installationDate: installationDate || null,
          description: description.trim(),
          sensorConnected,
        };
        await onSave(updateData);
      } else {
        const createData: CreateMachineInput = {
          userId,
          machineName: machineName.trim(),
          machineId: machineId.trim().toUpperCase(),
          machineType,
          location: location.trim(),
          ratedVoltage: voltVal,
          ratedCurrent: currVal,
          frequency: freqVal,
          manufacturer: manufacturer.trim(),
          modelNumber: modelNumber.trim(),
          ratedPower: powVal,
          installationDate: installationDate || null,
          description: description.trim(),
          sensorConnected,
        };
        await onSave(createData);
      }

      onClose();
    } catch (err: unknown) {
      console.error('Machine form submission error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to register machine.';
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div
        className="w-full max-w-2xl bg-iron-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-iron-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-title" className="font-display font-bold text-base text-white tracking-tight">
                {isEdit ? 'Edit Machine Details' : 'Register New Machine'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isEdit ? 'Update specifications and telemetry linkage' : 'Add equipment to IronPulse diagnostic fleet'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEdit && (
              <button
                type="button"
                onClick={handlePreFillHardwareSpecs}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-sky-300 bg-sky-950/40 border border-sky-500/30 rounded-md hover:bg-sky-900/40 transition-colors"
                title="Quick fill with laboratory physical motor parameters"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Pre-fill Lab Hardware Specs</span>
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-iron-800"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errors.general && (
            <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-500/60 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* SECTION 1: CORE IDENTIFICATION */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-sky-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <span>1. Equipment Identification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Machine Name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200">
                  Machine Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={machineName}
                  onChange={(e) => {
                    setMachineName(e.target.value);
                    if (errors.machineName) setErrors((prev) => ({ ...prev, machineName: undefined }));
                  }}
                  placeholder="e.g. Water Pump Motor 01"
                  className={`w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                    errors.machineName
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                  }`}
                />
                {errors.machineName && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.machineName}</span>
                  </p>
                )}
              </div>

              {/* Machine ID */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200 font-mono">
                  Machine ID (Unique Tag) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={machineId}
                  onChange={(e) => {
                    setMachineId(e.target.value.toUpperCase());
                    if (errors.machineId) setErrors((prev) => ({ ...prev, machineId: undefined }));
                  }}
                  placeholder="e.g. IP-MOTOR-001"
                  className={`w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 transition-colors ${
                    errors.machineId
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                  }`}
                />
                {errors.machineId && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.machineId}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Machine Type */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200">
                  Machine Type <span className="text-rose-400">*</span>
                </label>
                <select
                  value={machineType}
                  onChange={(e) => setMachineType(e.target.value as MachineType)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  {MACHINE_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-iron-900 text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200">
                  Installation Location <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                  placeholder="e.g. Laboratory, Plant Bay 2"
                  className={`w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                    errors.location
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                  }`}
                />
                {errors.location && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: RATED ELECTRICAL SPECIFICATIONS */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-sky-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <span>2. Rated Operating Specifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rated Voltage */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200 font-mono">
                  Rated Voltage (V) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={ratedVoltage}
                    onChange={(e) => {
                      setRatedVoltage(e.target.value);
                      if (errors.ratedVoltage) setErrors((prev) => ({ ...prev, ratedVoltage: undefined }));
                    }}
                    placeholder="230"
                    className={`w-full px-3 py-2 pr-8 text-xs rounded-lg bg-iron-950 border text-slate-100 font-mono focus:outline-none focus:ring-1 transition-colors ${
                      errors.ratedVoltage
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">V</span>
                </div>
                {errors.ratedVoltage && (
                  <p className="text-[10px] text-rose-400">{errors.ratedVoltage}</p>
                )}
              </div>

              {/* Rated Current */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200 font-mono">
                  Rated Current (A) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={ratedCurrent}
                    onChange={(e) => {
                      setRatedCurrent(e.target.value);
                      if (errors.ratedCurrent) setErrors((prev) => ({ ...prev, ratedCurrent: undefined }));
                    }}
                    placeholder="0.55"
                    className={`w-full px-3 py-2 pr-8 text-xs rounded-lg bg-iron-950 border text-slate-100 font-mono focus:outline-none focus:ring-1 transition-colors ${
                      errors.ratedCurrent
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">A</span>
                </div>
                {errors.ratedCurrent && (
                  <p className="text-[10px] text-rose-400">{errors.ratedCurrent}</p>
                )}
              </div>

              {/* Operating Frequency */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-200 font-mono">
                  Frequency (Hz) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={frequency}
                    onChange={(e) => {
                      setFrequency(e.target.value);
                      if (errors.frequency) setErrors((prev) => ({ ...prev, frequency: undefined }));
                    }}
                    placeholder="50"
                    className={`w-full px-3 py-2 pr-8 text-xs rounded-lg bg-iron-950 border text-slate-100 font-mono focus:outline-none focus:ring-1 transition-colors ${
                      errors.frequency
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">Hz</span>
                </div>
                {errors.frequency && (
                  <p className="text-[10px] text-rose-400">{errors.frequency}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: HARDWARE TELEMETRY LINKAGE */}
          <div className="p-3.5 rounded-xl bg-iron-950 border border-slate-800 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                  <Radio className={`w-3.5 h-3.5 ${sensorConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>Hardware Telemetry Linkage</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Connect live hardware telemetry stream (Arduino Uno + PT100 RTD, ACS712 current clamp, ZMPT101B voltage transformer via Flask API <code className="text-sky-300 font-mono text-[10px]">http://localhost:5000/telemetry</code>).
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={sensorConnected}
                  onChange={(e) => setSensorConnected(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-iron-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 border border-slate-700"></div>
              </label>
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-850">
              <span className={`w-1.5 h-1.5 rounded-full ${sensorConnected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span>
                {sensorConnected
                  ? 'Sensor Designated: Real-time telemetry will stream for this machine.'
                  : 'Isolated Mode: Will display "No sensor connected" to protect data integrity.'}
              </span>
            </div>
          </div>

          {/* SECTION 4: OPTIONAL METADATA */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
              <span>3. Optional Equipment Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Manufacturer */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">Manufacturer</label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Siemens, ABB"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Model Number */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300 font-mono">Model Number</label>
                <input
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. 1LA7073-4AA10"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border border-slate-800 text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Rated Power */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300 font-mono">Rated Power (kW)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={ratedPower}
                    onChange={(e) => {
                      setRatedPower(e.target.value);
                      if (errors.ratedPower) setErrors((prev) => ({ ...prev, ratedPower: undefined }));
                    }}
                    placeholder="e.g. 0.25"
                    className="w-full px-3 py-2 pr-8 text-xs rounded-lg bg-iron-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">kW</span>
                </div>
                {errors.ratedPower && <p className="text-[10px] text-rose-400">{errors.ratedPower}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Installation Date */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">Installation Date</label>
                <input
                  type="date"
                  value={installationDate}
                  onChange={(e) => setInstallationDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Primary duty cycle, motor load coupling, environment notes..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-iron-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-300 border border-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-iron-950 font-bold shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Firestore...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEdit ? 'Save Changes' : 'Register Machine'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
