import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, ArrowLeft, Radio, User, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { TechCard } from '../components/ui/TechCard';
import { DashboardPreview } from '../components/sections/DashboardPreview';
import { UserProfileCard } from '../components/dashboard/UserProfileCard';
import { useMockTelemetry } from '../hooks/useMockTelemetry';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const telemetry = useMockTelemetry();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      status: 'PLANNED',
      desc: 'Industrial microcontroller integration, ADC high-speed sampling, split-core current clamps & thermal RTDs.',
    },
    {
      phase: 'Phase 4',
      title: 'Real-Time Edge ML Load Analytics',
      status: 'PLANNED',
      desc: 'On-device autoencoder anomaly models and multi-parameter thermal-current degradation pattern recognition.',
    },
  ];

  return (
    <div className="min-h-screen bg-iron-950 text-slate-100 selection:bg-sky-500/20 selection:text-sky-300 font-sans pb-24">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
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

        {/* Live Mock Console Component */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
            <span className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>LIVE INTERACTIVE MOTOR DIAGNOSTICS STREAM</span>
            </span>
            <span className="text-sky-400 font-bold">4 SENSING VECTORS ACTIVE</span>
          </div>

          <DashboardPreview telemetry={telemetry} />
        </div>

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
    </div>
  );
};
