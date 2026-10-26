import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  ArrowLeft,
  Radio,
  User,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { TechCard } from '../components/ui/TechCard';
import { DashboardPreview } from '../components/sections/DashboardPreview';
import { UserProfileCard } from '../components/dashboard/UserProfileCard';
import { MachineSelector } from '../components/machines/MachineSelector';
import { MachineList } from '../components/machines/MachineList';
import { AddMachineModal } from '../components/machines/AddMachineModal';
import { DeleteMachineModal } from '../components/machines/DeleteMachineModal';
import { MachineDetailsModal } from '../components/machines/MachineDetailsModal';
import { ToastContainer, type ToastMessage } from '../components/ui/Toast';
import { useMockTelemetry } from '../hooks/useMockTelemetry';
import { useAuth } from '../context/AuthContext';
import {
  subscribeUserMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} from '../services/machineService';
import type { Machine, CreateMachineInput, UpdateMachineInput } from '../types/machine';

export const Dashboard: React.FC = () => {
  const telemetry = useMockTelemetry();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Machine Management State
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [loadingMachines, setLoadingMachines] = useState(true);
  const [machinesError, setMachinesError] = useState<string | null>(null);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [deletingMachine, setDeletingMachine] = useState<Machine | null>(null);
  const [viewingMachine, setViewingMachine] = useState<Machine | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const addToast = (type: ToastMessage['type'], message: string, title?: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      title,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time Firestore Machines Subscription
  useEffect(() => {
    if (!user) {
      setMachines([]);
      setLoadingMachines(false);
      return;
    }

    setLoadingMachines(true);
    setMachinesError(null);

    const unsubscribe = subscribeUserMachines(
      user.uid,
      (fetchedMachines) => {
        setMachines(fetchedMachines);
        setLoadingMachines(false);

        // Auto-select machine if none is selected, or if previous selected is deleted
        setSelectedMachineId((currentSelectedId) => {
          if (currentSelectedId && fetchedMachines.some((m) => m.id === currentSelectedId)) {
            return currentSelectedId;
          }
          // Prioritize machine with active live sensor
          const liveMachine = fetchedMachines.find((m) => m.sensorConnected);
          if (liveMachine) return liveMachine.id;
          return fetchedMachines[0]?.id || null;
        });
      },
      (err) => {
        console.error('Firestore machines subscription error:', err);
        setMachinesError(err.message || 'Unable to sync machines from Firestore.');
        setLoadingMachines(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Determine currently selected machine
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || null;

  // Handlers for Machine Operations
  const handleSaveMachine = async (data: CreateMachineInput | UpdateMachineInput) => {
    if (!user) return;

    if (editingMachine) {
      // Edit mode
      await updateMachine(user.uid, editingMachine.id, data as UpdateMachineInput);
      addToast('success', `Machine "${data.machineName || editingMachine.machineName}" updated successfully.`, 'Machine Updated');
      setEditingMachine(null);
    } else {
      // Create mode
      const newDocId = await createMachine(data as CreateMachineInput);
      setSelectedMachineId(newDocId);
      addToast(
        'success',
        `Machine "${(data as CreateMachineInput).machineName}" registered to IronPulse fleet.`,
        'Registration Successful'
      );
    }
  };

  const handleConfirmDelete = async (machineDocId: string) => {
    const target = machines.find((m) => m.id === machineDocId);
    await deleteMachine(machineDocId);
    addToast('info', `Machine "${target?.machineName || 'Equipment'}" has been removed.`, 'Machine Deleted');
    setDeletingMachine(null);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const phaseRoadmap = [
    {
      phase: 'Phase 1',
      title: 'Frontend Architecture & Simulation',
      status: 'COMPLETED',
      desc: 'Industrial UI, modular component hierarchy, real-time induction motor mock telemetry engine (4 parameters).',
    },
    {
      phase: 'Phase 2',
      title: 'Authentication & Session Persistence',
      status: 'COMPLETED',
      desc: 'Secure operator authentication with Firebase, session token persistence, and role-guarded telemetry routes.',
    },
    {
      phase: 'Phase 3',
      title: 'Motor Edge Hardware Integration',
      status: 'COMPLETED',
      desc: 'Industrial microcontroller integration, ADC high-speed sampling, split-core current clamps & thermal RTDs.',
    },
    {
      phase: 'Phase 4',
      title: 'Multi-Machine Fleet Analytics',
      status: 'COMPLETED',
      desc: 'Multi-unit induction motor registry, persistent Firestore synchronization, and isolated telemetry vectors.',
    },
  ];

  return (
    <div className="min-h-screen bg-iron-950 text-slate-100 selection:bg-sky-500/20 selection:text-sky-300 font-sans pb-24">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Bar Navigation */}
      <header className="bg-iron-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span className="font-display font-bold text-sm tracking-wider text-white">
                IRON<span className="text-sky-400">PULSE</span> CONSOLE
              </span>
            </div>
          </div>

          {/* Authenticated User Status Bar & Logout */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-iron-950 border border-slate-800">
              <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[10px]">
                <User className="w-3 h-3" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-slate-200 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                  {user?.displayName ? `${user.displayName} (${user.email})` : user?.email || 'Authenticated Operator'}
                </span>
                <span className="text-[9px] text-emerald-400 font-normal">
                  ● SESSION ACTIVE
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-iron-950 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors disabled:opacity-50 text-xs"
              title="Sign out of current session"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
        {/* Authenticated Operator Welcome Banner */}
        <div className="p-5 sm:p-6 rounded-xl bg-iron-900 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-sky-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AUTHENTICATED OPERATOR ACCESS GRANTED</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Induction Motor Telemetry Console
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Signed in as <strong className="text-slate-200">{user?.displayName || user?.email}</strong> (UID: {user?.uid?.slice(0, 10)}...)
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-iron-950 border border-slate-800 text-slate-300">
              NODE BUS: <strong className="text-sky-300">ONLINE</strong>
            </span>
          </div>
        </div>

        {/* Firestore Notice / Error Banner if rules need attention */}
        {machinesError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/60 flex items-start gap-3 text-xs text-rose-300 font-sans shadow-md">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-semibold text-white">Firestore Machine Collection Notice</strong>
              <span>{machinesError}</span>
              {machinesError.toLowerCase().includes('permission') && (
                <p className="text-[11px] text-rose-200/90 font-mono pt-1">
                  👉 <strong>Action Required:</strong> Ensure <code className="text-sky-300 bg-iron-950 px-1 py-0.5 rounded">firestore.rules</code> are published in Firebase Console.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Machine Selector & Add Machine Section */}
        <MachineSelector
          machines={machines}
          selectedMachine={selectedMachine}
          onSelectMachine={(id) => setSelectedMachineId(id)}
          onAddMachine={() => {
            setEditingMachine(null);
            setIsAddModalOpen(true);
          }}
          onViewDetails={(m) => setViewingMachine(m)}
          onEditMachine={(m) => {
            setEditingMachine(m);
            setIsAddModalOpen(true);
          }}
          onDeleteMachine={(m) => setDeletingMachine(m)}
        />

        {/* Conditional Telemetry Display based on Machine Connection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
            <span className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${selectedMachine ? (selectedMachine.sensorConnected ? 'text-emerald-400' : 'text-slate-500') : 'text-emerald-400'}`} />
              <span>
                {selectedMachine
                  ? selectedMachine.sensorConnected
                    ? `LIVE INTERACTIVE MOTOR DIAGNOSTICS STREAM: ${selectedMachine.machineName.toUpperCase()} [${selectedMachine.machineId}]`
                    : `DIAGNOSTIC STATUS: ${selectedMachine.machineName.toUpperCase()} [${selectedMachine.machineId}]`
                  : 'LIVE INTERACTIVE MOTOR DIAGNOSTICS STREAM'}
              </span>
            </span>

            <span className="text-sky-400 font-bold">
              {selectedMachine
                ? selectedMachine.sensorConnected
                  ? '4 SENSING VECTORS ACTIVE'
                  : 'TELEMETRY ISOLATED (NO SENSOR)'
                : '4 SENSING VECTORS ACTIVE'}
            </span>
          </div>

          {/* Case A: Selected machine has live sensor connected OR no machines registered yet (default hardware stream) */}
          {(!selectedMachine || selectedMachine.sensorConnected) ? (
            <DashboardPreview telemetry={telemetry} selectedMachine={selectedMachine} />
          ) : (
            /* Case B: Selected machine is unconnected / offline. DO NOT SHOW FAKE OR BORROWED DATA! */
            <div className="p-8 sm:p-12 rounded-xl bg-iron-900 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-industrial-grid opacity-15 pointer-events-none" />

              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-iron-950 border border-slate-850 flex items-center justify-center text-slate-400 shadow-inner">
                  <Radio className="w-7 h-7 text-slate-500" />
                </div>

                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-iron-950 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider inline-block">
                    Hardware Isolation Mode
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    No sensor connected to this machine.
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Live telemetry from the Arduino Uno (PT100 RTD, ACS712 current clamp, and ZMPT101B voltage transformer) is dedicated exclusively to the designated active hardware motor. Readings are strictly isolated and not duplicated for <strong className="text-slate-200">{selectedMachine.machineName}</strong>.
                  </p>
                </div>

                {/* Machine Nameplate Specifications Display */}
                <div className="p-4 rounded-xl bg-iron-950 border border-slate-800/80 text-left font-mono text-xs space-y-2.5">
                  <span className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold block">
                    Registered Nameplate Specifications:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded bg-iron-900/80 border border-slate-850">
                      <span className="text-[9px] text-slate-500 block">Rated Voltage</span>
                      <strong className="text-white text-xs">{selectedMachine.ratedVoltage} V</strong>
                    </div>
                    <div className="p-2 rounded bg-iron-900/80 border border-slate-850">
                      <span className="text-[9px] text-slate-500 block">Rated Current</span>
                      <strong className="text-white text-xs">{selectedMachine.ratedCurrent} A</strong>
                    </div>
                    <div className="p-2 rounded bg-iron-900/80 border border-slate-850">
                      <span className="text-[9px] text-slate-500 block">Frequency</span>
                      <strong className="text-white text-xs">{selectedMachine.frequency} Hz</strong>
                    </div>
                    <div className="p-2 rounded bg-iron-900/80 border border-slate-850">
                      <span className="text-[9px] text-slate-500 block">Rated Power</span>
                      <strong className="text-white text-xs">{selectedMachine.ratedPower ? `${selectedMachine.ratedPower} kW` : '—'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
                  <button
                    onClick={() => {
                      setEditingMachine(selectedMachine);
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-iron-950 font-bold transition-all shadow-md shadow-sky-500/20"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Designate as Live Hardware Machine</span>
                  </button>

                  <button
                    onClick={() => setViewingMachine(selectedMachine)}
                    className="px-4 py-2 rounded-lg bg-iron-950 hover:bg-iron-850 text-slate-300 border border-slate-800 transition-colors"
                  >
                    View Equipment Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registered Machines Fleet List */}
        {loadingMachines ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 font-mono text-xs text-slate-400">
            <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
            <span>SYNCHRONIZING REGISTERED EQUIPMENT FLEET...</span>
          </div>
        ) : (
          <MachineList
            machines={machines}
            selectedMachineId={selectedMachineId}
            onSelectMachine={(id) => setSelectedMachineId(id)}
            onAddMachine={() => {
              setEditingMachine(null);
              setIsAddModalOpen(true);
            }}
            onViewDetails={(m) => setViewingMachine(m)}
            onEditMachine={(m) => {
              setEditingMachine(m);
              setIsAddModalOpen(true);
            }}
            onDeleteMachine={(m) => setDeletingMachine(m)}
          />
        )}

        {/* Authenticated Operator Firestore Profile & Credentials */}
        <UserProfileCard />

        {/* Platform Evolution Roadmap */}
        <div className="space-y-5 pt-2">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Platform Engineering Roadmap
            </h2>
            <p className="text-xs font-mono text-slate-400">
              MODULAR EVOLUTION OF THE IRON PULSE INDUSTRIAL MONITORING ARCHITECTURE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phaseRoadmap.map((item) => (
              <TechCard key={item.phase} className="p-5 bg-iron-900 border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-sky-400">{item.phase}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                      item.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-iron-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </TechCard>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL 1: REGISTER / EDIT MACHINE */}
      <AddMachineModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMachine(null);
        }}
        onSave={handleSaveMachine}
        editMachine={editingMachine}
        existingMachines={machines}
        userId={user?.uid || ''}
      />

      {/* MODAL 2: CONFIRM DELETE MACHINE */}
      <DeleteMachineModal
        isOpen={Boolean(deletingMachine)}
        machine={deletingMachine}
        onClose={() => setDeletingMachine(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* MODAL 3: VIEW MACHINE DETAILS */}
      <MachineDetailsModal
        isOpen={Boolean(viewingMachine)}
        machine={viewingMachine}
        onClose={() => setViewingMachine(null)}
        onEdit={(m) => {
          setEditingMachine(m);
          setIsAddModalOpen(true);
        }}
        telemetry={telemetry}
      />
    </div>
  );
};
