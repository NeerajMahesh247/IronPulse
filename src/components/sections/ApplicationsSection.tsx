import React from 'react';
import { TechCard } from '../ui/TechCard';
import { Droplets, Wind, Fan, GaugeCircle, Factory } from 'lucide-react';

export const ApplicationsSection: React.FC = () => {
  const applications = [
    {
      id: 'water-pumps',
      title: 'WATER PUMPS',
      subtitle: 'Centrifugal, Submersible & Booster Systems',
      description:
        'Monitor induction motors driving water pumping systems. Detect dry-running, impeller clogging, or hydraulic overload through abnormal current and thermal surges.',
      icon: Droplets,
      monitoredValues: 'Current Draw & Thermal Profile',
      equipment: 'Municipal, HVAC, Agriculture & Industrial Water Supplies',
    },
    {
      id: 'air-coolers',
      title: 'AIR COOLERS',
      subtitle: 'Evaporative & Industrial Cooling Units',
      description:
        'Track motor temperature and electrical load during continuous cooling cycles. Identify thermal accumulation caused by restricted airflow or continuous heavy duty.',
      icon: Wind,
      monitoredValues: 'Temperature & Sustained Load',
      equipment: 'Commercial HVAC, Cooling Towers & Evaporative Systems',
    },
    {
      id: 'industrial-fans',
      title: 'INDUSTRIAL FANS',
      subtitle: 'Blowers, Exhaust & Ventilation Motors',
      description:
        'Monitor electrical power consumption and stator thermal conditions in heavy ventilation systems to detect aerodynamic resistance and bearing friction.',
      icon: Fan,
      monitoredValues: 'Calculated Power (kW) & Voltage Stability',
      equipment: 'Mine Ventilation, Kiln Blowers & Factory Air Handling',
    },
    {
      id: 'compressors',
      title: 'COMPRESSORS',
      subtitle: 'Refrigeration & Air Compression Systems',
      description:
        'Identify unusual electrical operating patterns during load/unload cycles. Spot valve leakage, high compression ratios, or motor overloads in real time.',
      icon: GaugeCircle,
      monitoredValues: 'Cyclic Current Spikes & Active Power',
      equipment: 'Pneumatic Systems, Cold Storage & Gas Compression',
    },
    {
      id: 'industrial-machinery',
      title: 'INDUSTRIAL MOTORS',
      subtitle: 'Conveyors, Mixers & General Drives',
      description:
        'Monitor induction motors across diverse manufacturing lines. Catch mechanical jams, phase unbalance, and supply degradation before plant downtime occurs.',
      icon: Factory,
      monitoredValues: 'Full Multi-Parameter Telemetry',
      equipment: 'Conveyor Belts, Material Handling & Food Processing',
    },
  ];

  return (
    <section id="applications" className="relative py-16 md:py-24 bg-iron-900/60 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>TARGET EQUIPMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Built for the machines{' '}
            <span className="text-sky-400">that keep things moving.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            From water distribution pumps to heavy industrial ventilation and compressors, Iron Pulse attaches to the induction motors powering essential industrial operations.
          </p>
        </div>

        {/* 5 Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((app, idx) => {
            const Icon = app.icon;
            const isWide = idx === 4;
            return (
              <TechCard
                key={app.id}
                className={`p-6 flex flex-col justify-between h-full bg-iron-900 border-slate-800 ${
                  isWide ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded bg-iron-950 border border-slate-800 flex items-center justify-center text-sky-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">
                      APP 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white tracking-wide">
                      {app.title}
                    </h3>
                    <p className="text-xs font-mono text-sky-400/90 mt-0.5">
                      {app.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Key Metric:</span>
                    <span className="text-slate-200 font-medium">{app.monitoredValues}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Deployment:</span>
                    <span className="text-slate-400 truncate max-w-[220px]">{app.equipment}</span>
                  </div>
                </div>
              </TechCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
