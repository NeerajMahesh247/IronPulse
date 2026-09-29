import React from 'react';
import { TechCard } from '../ui/TechCard';
import { SignalSparkline } from '../ui/SignalSparkline';
import { TrendingUp } from 'lucide-react';

export const PredictiveSection: React.FC = () => {
  const transitionStages = [
    {
      title: 'NORMAL OPERATION',
      status: 'NORMAL',
      description: 'Motor runs at steady rated current and thermal equilibrium. Energy consumption matches pump/fan load.',
      data: [20, 21, 20, 22, 21, 20, 21, 22, 21, 20, 21, 21],
      color: 'blue' as const,
      metricLabel: 'Current: ~6.82 A | Temp: ~48.6 °C',
    },
    {
      title: 'DEVELOPING ABNORMALITY',
      status: 'ATTENTION',
      description: 'Gradual increase in current consumption and power draw begins, accompanied by steady thermal slope.',
      data: [21, 22, 25, 29, 36, 44, 52, 60, 68, 75, 80, 85],
      color: 'amber' as const,
      metricLabel: 'Current: ↑ 9.40 A | Temp: ↑ 58.2 °C',
    },
    {
      title: 'EARLY WARNING ISSUED',
      status: 'ATTENTION',
      description: 'Iron Pulse flags possible abnormal motor loading. Inspection recommended before thermal trip or insulation damage.',
      data: [85, 88, 92, 95, 96, 98, 99, 100, 99, 100, 99, 100],
      color: 'red' as const,
      metricLabel: 'INSPECTION RECOMMENDED',
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-iron-900/60 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>ANOMALY DETECTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Detect the change{' '}
            <span className="text-sky-400">before the breakdown.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            By observing subtle drifts in power consumption and thermal rise across multiple operational cycles, Iron Pulse alerts maintenance teams before a motor reaches catastrophic failure.
          </p>
        </div>

        {/* 3-Stage Transition Progression */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {transitionStages.map((stage, idx) => (
            <TechCard
              key={stage.title}
              className="p-5 flex flex-col justify-between h-full bg-iron-900 border-slate-800"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-sky-400 font-bold">PHASE 0{idx + 1}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      stage.status === 'NORMAL'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white">
                  {stage.title}
                </h3>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2 font-mono">
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Trend Profile</span>
                  <span className="text-white font-semibold">{stage.metricLabel}</span>
                </div>
                <SignalSparkline data={stage.data} color={stage.color} height={32} />
              </div>
            </TechCard>
          ))}
        </div>

        {/* Example Diagnostic Scenario Callout */}
        <div className="p-5 sm:p-6 rounded bg-iron-950 border border-slate-800 font-mono text-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Example Diagnostic Scenario: Water Pump Impeller Binding</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-slate-300 text-[11px]">
            <span className="p-1.5 rounded bg-iron-900 border border-slate-800">Current consumption ↑</span>
            <span className="text-sky-400">→</span>
            <span className="p-1.5 rounded bg-iron-900 border border-slate-800">Power consumption ↑</span>
            <span className="text-sky-400">→</span>
            <span className="p-1.5 rounded bg-iron-900 border border-slate-800">Motor Temperature ↑</span>
            <span className="text-sky-400">→</span>
            <span className="p-1.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
              Possible abnormal motor loading
            </span>
            <span className="text-sky-400">→</span>
            <span className="p-1.5 rounded bg-sky-950/60 border border-sky-500/40 text-sky-300 font-bold">
              INSPECTION RECOMMENDED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
