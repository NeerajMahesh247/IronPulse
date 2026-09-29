import React, { useState } from 'react';
import { TechCard } from '../ui/TechCard';
import { Cpu, Radio, Network, SearchCode, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: '01',
      title: 'MOTOR',
      tagline: 'Standard Operational Baseline',
      description:
        'The induction motor operates under normal plant conditions, driving equipment such as pumps, coolers, fans, or compressors.',
      icon: Cpu,
      badge: 'CONTINUOUS DUTY',
      details: ['3-phase or single-phase induction drives', 'Continuous or cyclic load profiles', 'Nameplate operational baseline'],
    },
    {
      stepNumber: '02',
      title: 'SENSORS',
      tagline: 'Non-Invasive Parameter Measurement',
      description:
        'Surface temperature RTD probe, Hall-effect current clamp, and voltage divider interfaces sample physical and electrical quantities directly from the motor.',
      icon: Radio,
      badge: 'ELECTRICAL & THERMAL',
      details: ['Surface RTD casing probe', 'Non-invasive current clamp', 'Isolated voltage tap'],
    },
    {
      stepNumber: '03',
      title: 'DATA COLLECTION',
      tagline: 'High-Frequency Ingestion',
      description:
        'Iron Pulse ingests raw measurements of Temperature, Current, and Voltage at high frequency, applying digital filtering to eliminate electrical noise.',
      icon: Network,
      badge: 'REAL-TIME LOGGING',
      details: ['Digital anti-aliasing filter', 'Synchronized timestamp alignment', 'Instantaneous power calculation (P = V × I)'],
    },
    {
      stepNumber: '04',
      title: 'SIGNAL ANALYSIS',
      tagline: 'Multi-Parameter Correlation',
      description:
        'Analyzes relationships between electrical draw and thermal behavior. Cross-examines current spikes against supply voltage stability and thermal rise.',
      icon: Cpu,
      badge: '4-SIGNAL CORRELATION',
      details: ['Dynamic load envelope modeling', 'Thermal accumulation rate', 'Power factor & current symmetry'],
    },
    {
      stepNumber: '05',
      title: 'ANOMALY DETECTION',
      tagline: 'Pattern & Drift Recognition',
      description:
        'Identifies abnormal operating patterns—such as sustained high current draw accompanied by thermal drift—indicating potential mechanical overload or electrical fault.',
      icon: SearchCode,
      badge: 'ABNORMAL PATTERNS',
      details: ['Multi-signal deviation detection', 'Over-temperature warning thresholds', 'Load surge pattern identification'],
    },
    {
      stepNumber: '06',
      title: 'EARLY WARNING',
      tagline: 'Actionable Machine Health',
      description:
        'Presents plain, actionable machine health metrics and inspection recommendations to maintenance engineers before motor trip or insulation breakdown occurs.',
      icon: ShieldAlert,
      badge: 'PREDICTIVE ADVISORY',
      details: ['Motor Health Score (%)', 'Early Warning alert notifications', 'Inspection recommendations'],
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="how-it-works" className="relative py-16 md:py-24 bg-iron-950 border-t border-slate-800">
      <div className="absolute inset-0 bg-industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-sky-400">
            <span>DIAGNOSTIC PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            How Iron Pulse{' '}
            <span className="text-sky-400">monitors your motor.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            From raw electrical and thermal readings to clear diagnostic insights. An engineered step-by-step pipeline designed for industrial reliability.
          </p>
        </div>

        {/* Step Progression Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 font-mono">
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded border text-left transition-all duration-150 flex flex-col justify-between ${
                activeStep === idx
                  ? 'bg-iron-900 border-sky-400 text-white shadow-sm'
                  : 'bg-iron-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className={`font-bold ${activeStep === idx ? 'text-sky-400' : 'text-slate-500'}`}>
                  {s.stepNumber}
                </span>
                {activeStep === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                )}
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase block truncate">
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active Stage Card */}
        <TechCard className="p-6 sm:p-8 bg-iron-900 border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">
                  STAGE {current.stepNumber} OF 06
                </span>
                <span className="font-mono text-xs text-slate-400 px-2 py-0.5 rounded bg-iron-950 border border-slate-800">
                  {current.badge}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {current.title}
                </h3>
                <p className="text-sm font-mono text-sky-300 mt-0.5">
                  {current.tagline}
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {current.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {current.details.map(detail => (
                  <div key={detail} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
                  className="px-3.5 py-1.5 text-xs font-mono text-slate-400 hover:text-white border border-slate-800 rounded bg-iron-950 hover:bg-iron-850"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                  className="px-3.5 py-1.5 text-xs font-mono text-sky-400 hover:text-white border border-sky-500/30 rounded bg-sky-500/10 hover:bg-sky-500/20 flex items-center gap-1"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Right: Flow Stack List */}
            <div className="lg:col-span-5 p-5 rounded bg-iron-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>PIPELINE EXECUTION FLOW</span>
                <span className="text-sky-400">STAGE {activeStep + 1}/6</span>
              </div>

              <div className="space-y-2">
                {steps.map((s, idx) => (
                  <div
                    key={s.title}
                    className={`p-2.5 rounded border transition-all duration-150 flex items-center justify-between ${
                      idx === activeStep
                        ? 'bg-iron-900 border-sky-400 text-white'
                        : idx < activeStep
                        ? 'bg-iron-950 border-slate-800 text-emerald-400'
                        : 'bg-iron-950 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border border-current">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{s.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {idx === activeStep ? 'ACTIVE' : idx < activeStep ? 'DONE' : 'QUEUED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TechCard>
      </div>
    </section>
  );
};
