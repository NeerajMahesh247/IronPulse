import React from 'react';
import { TechCard } from '../ui/TechCard';
import { TelemetryBadge } from '../ui/TelemetryBadge';
import { SignalSparkline } from '../ui/SignalSparkline';
import { Thermometer, Zap, Gauge, Calculator } from 'lucide-react';
import { useMockTelemetry } from '../../hooks/useMockTelemetry';

interface ProblemSectionProps {
  telemetry: ReturnType<typeof useMockTelemetry>;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ telemetry }) => {
  const { metrics, history, isAnomalyMode } = telemetry;

  const tempData = history.map(h => h.temperature);
  const currentData = history.map(h => h.current);
  const voltageData = history.map(h => h.voltage);
  const powerData = history.map(h => h.power);

  const parameters = [
    {
      id: 'temp',
      title: 'TEMPERATURE',
      subtitle: 'Thermal Behavior & Insulation Health',
      description:
        'Monitor thermal accumulation in motor stator windings, bearing frames, and casing to identify overheating conditions before insulation degrades.',
      value: `${metrics.temperature.value} ${metrics.temperature.unit}`,
      status: metrics.temperature.status,
      icon: Thermometer,
      data: tempData,
      color: isAnomalyMode ? ('amber' as const) : ('blue' as const),
      spec: 'Surface RTD / Thermistor Sensor',
      typicalRange: 'Continuous Duty: 40 °C – 70 °C',
      isDerived: false,
    },
    {
      id: 'current',
      title: 'CURRENT',
      subtitle: 'Motor Loading & Phase Draw',
      description:
        'Track abnormal current consumption and changes in motor loading across operational cycles to catch mechanical binding or rotor bar irregularities.',
      value: `${metrics.current.value} ${metrics.current.unit}`,
      status: metrics.current.status,
      icon: Zap,
      data: currentData,
      color: isAnomalyMode ? ('amber' as const) : ('blue' as const),
      spec: 'Non-Invasive Hall-Effect Current Clamp',
      typicalRange: 'Full Load Current (FLA): 5 A – 15 A',
      isDerived: false,
    },
    {
      id: 'voltage',
      title: 'VOLTAGE',
      subtitle: 'Supply Potential & Stability',
      description:
        'Monitor incoming AC supply voltage and identify electrical irregularities such as under-voltage, phase voltage unbalance, or line spikes.',
      value: `${metrics.voltage.value} ${metrics.voltage.unit}`,
      status: metrics.voltage.status,
      icon: Gauge,
      data: voltageData,
      color: 'blue' as const,
      spec: 'Differential Potential Attenuation Tap',
      typicalRange: 'Nominal 230 V / 415 V ± 5%',
      isDerived: false,
    },
    {
      id: 'power',
      title: 'POWER (CALCULATED)',
      subtitle: 'Active Machine Load Profile',
      description:
        'Analyze calculated active power consumption (P = V × I) to understand real machine loading, efficiency drops, and mechanical work over time.',
      value: `${metrics.power.value} ${metrics.power.unit}`,
      status: metrics.power.status,
      icon: Calculator,
      data: powerData,
      color: isAnomalyMode ? ('amber' as const) : ('blue' as const),
      spec: 'Derived in Real Time (P = V × I)',
      typicalRange: 'Operating Load: 1.0 kW – 3.5 kW',
      isDerived: true,
    },
  ];

  return (
    <section id="technology" className="relative py-16 md:py-24 bg-iron-950 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>ELECTRICAL & THERMAL PARAMETERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            A motor rarely fails{' '}
            <span className="text-sky-400">without warning.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Changes in electrical load, temperature and power consumption can reveal abnormal operating conditions before a motor stops working.
          </p>
        </div>

        {/* 4 Parameter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parameters.map(param => {
            const Icon = param.icon;
            return (
              <TechCard
                key={param.id}
                className="p-5 flex flex-col justify-between h-full bg-iron-900 border-slate-800"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded bg-iron-950 border border-slate-800 flex items-center justify-center text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <TelemetryBadge status={param.status} isDerived={param.isDerived} size="sm" />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white tracking-wide">
                      {param.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {param.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {param.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2 font-mono">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] uppercase text-slate-500">Live Reading</span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      {param.value}
                    </span>
                  </div>
                  <SignalSparkline data={param.data} color={param.color} height={26} />
                  <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1">
                    <span>{param.spec}</span>
                    <span>{param.typicalRange}</span>
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
