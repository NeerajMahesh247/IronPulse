import React from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 bg-iron-950 border-t border-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-industrial-grid opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-12 rounded-2xl bg-iron-900 border border-slate-700/80 shadow-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-iron-950 border border-slate-800 text-xs font-mono text-sky-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>INDUCTION MOTOR DIAGNOSTICS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white uppercase tracking-tight">
            Monitor smarter.{' '}
            <span className="block mt-1 text-sky-400">
              Maintain earlier.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-xl mx-auto">
            Turn motor operating data into actionable machine-health insights. Protect water pumps, air coolers, fans, and compressors from unexpected motor failures.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-7 py-3.5 rounded bg-sky-500 hover:bg-sky-400 text-iron-950 font-mono font-bold text-sm tracking-wider uppercase transition-all duration-150 flex items-center gap-2 shadow-sm"
            >
              <span>Enter Iron Pulse</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#technology"
              className="px-7 py-3.5 rounded bg-iron-950 hover:bg-iron-850 text-slate-200 font-mono font-semibold text-sm tracking-wider uppercase border border-slate-700 hover:border-slate-600 transition-all duration-150"
            >
              Explore Technology
            </a>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span>● NON-INVASIVE SENSING</span>
            <span>● THERMAL & CURRENT FUSION</span>
            <span>● PREDICTIVE ADVISORIES</span>
          </div>
        </div>
      </div>
    </section>
  );
};
