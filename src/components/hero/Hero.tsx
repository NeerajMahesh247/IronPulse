import React from 'react';
import { HeroVisualization } from './HeroVisualization';
import { useMockTelemetry } from '../../hooks/useMockTelemetry';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeroProps {
  telemetry: ReturnType<typeof useMockTelemetry>;
}

export const Hero: React.FC<HeroProps> = ({ telemetry }) => {
  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-iron-950">
      {/* Industrial Grid & Ambient Texture */}
      <div className="absolute inset-0 bg-industrial-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-5 max-w-4xl mx-auto">
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-iron-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white tracking-wider">MACHINE MONITORING SYSTEM</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">INDUCTION MOTOR TELEMETRY</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white uppercase leading-[1.08]">
            Know Your Motor.{' '}
            <span className="block mt-1 text-sky-400">
              Before It Fails.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-sans leading-relaxed max-w-3xl">
            Iron Pulse monitors the electrical and thermal behavior of induction motors to identify abnormal operating conditions before they become costly failures.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#technology"
              className="px-6 py-3.5 rounded bg-sky-500 hover:bg-sky-400 text-iron-950 font-mono font-bold text-sm tracking-wide transition-all duration-150 flex items-center gap-2 shadow-sm"
            >
              <span>Explore Iron Pulse</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#how-it-works"
              className="px-6 py-3.5 rounded bg-iron-900 hover:bg-iron-850 text-slate-200 font-mono font-semibold text-sm tracking-wide border border-slate-800 hover:border-slate-700 transition-all duration-150 flex items-center gap-2"
            >
              <span>See How It Works</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Key Industrial Monitoring Characteristics */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Non-Invasive Sensor Interfaces</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Multi-Parameter Electrical & Thermal Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Early Anomaly Warning</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visualization Canvas */}
        <div className="mt-10 lg:mt-14">
          <HeroVisualization telemetry={telemetry} />
        </div>
      </div>
    </section>
  );
};
