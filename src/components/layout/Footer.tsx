import React from 'react';
import { Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-iron-950 border-t border-slate-800/80 text-slate-400 font-mono text-xs relative overflow-hidden">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-iron-900 border border-slate-700 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-sky-400" />
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-slate-100">
                IRON<span className="text-sky-400">PULSE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Predictive intelligence for induction motors. Real-time electrical and thermal diagnostics for water pumps, air coolers, industrial fans, compressors, and machinery.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>SYSTEM READY · PHASE 1 FRONTEND</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold tracking-wider uppercase text-xs">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/#home" className="hover:text-sky-400 transition-colors">Overview</a></li>
              <li><a href="/#technology" className="hover:text-sky-400 transition-colors">Motor Parameters</a></li>
              <li><a href="/#applications" className="hover:text-sky-400 transition-colors">Applications</a></li>
              <li><a href="/#monitoring" className="hover:text-sky-400 transition-colors">Multi-Parameter Analysis</a></li>
              <li><a href="/#health-score" className="hover:text-sky-400 transition-colors">Motor Health Score</a></li>
            </ul>
          </div>

          {/* Motor Equipment Specs */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold tracking-wider uppercase text-xs">Motor Telemetry</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><span className="text-sky-400">▪</span> Motor Surface Temperature (°C)</li>
              <li className="flex items-center gap-1.5"><span className="text-sky-400">▪</span> Line & Phase Current Draw (A)</li>
              <li className="flex items-center gap-1.5"><span className="text-sky-400">▪</span> AC Supply Voltage Stability (V)</li>
              <li className="flex items-center gap-1.5"><span className="text-sky-400">▪</span> Calculated Power Loading (kW)</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">▪</span> Thermal & Electrical Coupling</li>
            </ul>
          </div>

          {/* Architecture Roadmap */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold tracking-wider uppercase text-xs">Evolution</h4>
            <div className="p-3.5 rounded bg-iron-900 border border-slate-800 text-[11px] space-y-2">
              <div className="flex justify-between items-center text-slate-300 font-medium">
                <span>Phase 1</span>
                <span className="text-emerald-400">Complete (Frontend)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Phase 2</span>
                <span className="text-sky-400">Cloud DB & Auth</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Phase 3</span>
                <span>Motor Sensor Bus</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Phase 4</span>
                <span>Edge Load Anomaly ML</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-6">
            <span>© 2026 Iron Pulse. All rights reserved.</span>
            <a href="#about" className="hover:text-slate-300">Engineering Protocol</a>
            <a href="#technology" className="hover:text-slate-300">Telemetry Specs</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">NON-INVASIVE INDUCTION MOTOR MONITORING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
