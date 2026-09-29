import React from 'react';
import { Hero } from '../components/hero/Hero';
import { ProblemSection } from '../components/sections/ProblemSection';
import { ApplicationsSection } from '../components/sections/ApplicationsSection';
import { HowItWorks } from '../components/sections/HowItWorks';
import { MonitoringSection } from '../components/sections/MonitoringSection';
import { DashboardPreview } from '../components/sections/DashboardPreview';
import { HealthScore } from '../components/sections/HealthScore';
import { PredictiveSection } from '../components/sections/PredictiveSection';
import { RetrofitSection } from '../components/sections/RetrofitSection';
import { CTASection } from '../components/sections/CTASection';
import { useMockTelemetry } from '../hooks/useMockTelemetry';

export const Home: React.FC = () => {
  const telemetry = useMockTelemetry();

  return (
    <div className="min-h-screen bg-iron-950 text-slate-100 selection:bg-sky-500/20 selection:text-sky-300">
      <Hero telemetry={telemetry} />
      <ProblemSection telemetry={telemetry} />
      <ApplicationsSection />
      <HowItWorks />
      <MonitoringSection telemetry={telemetry} />
      <DashboardPreview telemetry={telemetry} />
      <HealthScore telemetry={telemetry} />
      <PredictiveSection />
      <RetrofitSection />
      <CTASection />
    </div>
  );
};
