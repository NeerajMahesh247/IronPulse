export type TelemetryStatus = 'normal' | 'attention' | 'critical' | 'info';

export interface TelemetryPoint {
  timestamp: number;
  timeLabel: string;
  temperature: number;      // in °C
  current: number;          // in Amperes (A)
  voltage: number;          // in Volts (V)
  power: number;            // in Kilowatts (kW) = (Voltage * Current) / 1000
}

export interface MotorHealthMetrics {
  temperature: {
    value: number;
    unit: string;
    status: TelemetryStatus;
    label: string;
    baseline: number;
    threshold: number;
    description: string;
  };
  current: {
    value: number;
    unit: string;
    status: TelemetryStatus;
    label: string;
    baseline: number;
    threshold: number;
    description: string;
  };
  voltage: {
    value: number;
    unit: string;
    status: TelemetryStatus;
    label: string;
    baseline: number;
    threshold: number;
    description: string;
  };
  power: {
    value: number;
    unit: string;
    status: TelemetryStatus;
    label: string;
    baseline: number;
    threshold: number;
    description: string;
    isDerived: true;
  };
  overallHealthScore: number;
  systemStatus: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  activeMode: 'NOMINAL' | 'SIMULATED_ANOMALY';
  lastSyncTime: string;
  motorId: string;
}

export interface MotorAlert {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ATTENTION' | 'CRITICAL';
  title: string;
  parameter: 'Temperature' | 'Current' | 'Voltage' | 'Power';
  description: string;
}
