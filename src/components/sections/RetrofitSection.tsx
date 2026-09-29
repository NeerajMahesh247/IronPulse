import React from 'react';
import { Cpu, CheckCircle2, ArrowDown, Activity } from 'lucide-react';

export const RetrofitSection: React.FC = () => {
  const hardwareFeatures = [
    {
      title: 'Quick Non-Invasive Attachment',
      description:
        'Uses surface thermal RTD probes and split-core Hall-effect current clamps that clip on without cutting wires or drilling motor casings.',
    },
    {
      title: 'Galvanically Isolated',
      description:
        'Complete electrical isolation between measurement taps and the processor unit ensures full safety compliance in factory environments.',
    },
    {
      title: 'Adaptable to Any Induction Motor',
      description:
        'Easily deployed across single-phase and 3-phase AC induction motors driving pumps, air coolers, blowers, and air compressors.',
    },
    {
      title: 'Self-Calibrating Baselines',
      description:
        'Captures initial healthy operating current and thermal slopes to establish automated thresholds for abnormal condition alerting.',
    },
  ];

  return (
    <section id="about" className="relative py-16 md:py-24 bg-iron-950 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>HARDWARE CONCEPT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            A small system{' '}
            <span className="text-sky-400">for a critical machine.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            A compact, non-invasive monitoring unit designed to clip directly onto existing induction motors in plant and commercial installations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Hardware Diagram */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-iron-900 border border-slate-800 font-mono text-xs space-y-4">
            <div className="flex justify-between items-center text-slate-400 pb-3 border-b border-slate-800">
              <span className="text-[10px] tracking-wider uppercase">System Architecture</span>
              <span className="text-sky-400 font-semibold">REMOVABLE HARDWARE</span>
            </div>

            {/* Topology Hierarchy */}
            <div className="space-y-2.5">
              <div className="p-3 rounded bg-iron-950 border border-slate-800 text-white font-semibold flex items-center justify-between">
                <span>INDUCTION MOTOR (3-PHASE / 1-PHASE)</span>
                <span className="text-[10px] text-slate-400 font-normal">Pump / Fan / Compressor</span>
              </div>

              {/* 3 Measurement Interfaces */}
              <div className="pl-5 border-l-2 border-sky-500/40 space-y-2 py-1">
                <div className="flex items-center justify-between p-2 rounded bg-iron-950 border border-slate-800 text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    Motor Temperature RTD Sensor
                  </span>
                  <span className="text-[10px] text-slate-500">Surface Probe</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-iron-950 border border-slate-800 text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    Motor Current Clamp
                  </span>
                  <span className="text-[10px] text-slate-500">Hall-Effect Tap</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-iron-950 border border-slate-800 text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    Supply Voltage Line Interface
                  </span>
                  <span className="text-[10px] text-slate-500">Isolated Terminal</span>
                </div>
              </div>

              {/* Iron Pulse Unit */}
              <div className="p-3.5 rounded bg-sky-950/40 border border-sky-500/50 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="font-bold block">IRON PULSE MONITORING UNIT</span>
                    <span className="text-[10px] text-slate-300">Signal Ingestion & Real-Time Power Calculation (P = V × I)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-sky-400">EDGE UNIT</span>
              </div>

              <div className="flex justify-center text-sky-400 py-0.5">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>

              {/* Dashboard */}
              <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">MONITORING DASHBOARD</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">HEALTH CONSOLE</span>
              </div>
            </div>
          </div>

          {/* Right: Hardware Pillars */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Simple retrofit diagnostics without equipment disruption.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Traditional motor overloads only trip after windings reach extreme temperatures. Iron Pulse monitors subtle thermal gradients and current deviations continuously, providing time for scheduled preventative maintenance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {hardwareFeatures.map(feat => (
                <div
                  key={feat.title}
                  className="p-3.5 rounded bg-iron-900 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
