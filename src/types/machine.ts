import type { Timestamp } from 'firebase/firestore';

export type MachineType = 
  | 'Induction Motor'
  | 'Water Pump Motor'
  | 'Cooler Motor'
  | 'Other';

export interface Machine {
  id: string; // Firestore doc ID
  userId: string; // Authenticated user ID for ownership isolation
  machineName: string;
  machineId: string; // Unique alphanumeric machine tag (e.g. IP-MOTOR-001)
  machineType: MachineType;
  location: string;
  ratedVoltage: number; // In Volts (V)
  ratedCurrent: number; // In Amperes (A)
  frequency: number; // In Hertz (Hz)
  
  // Optional fields
  manufacturer?: string;
  modelNumber?: string;
  ratedPower?: number | null; // In Kilowatts (kW)
  installationDate?: string | null; // ISO Date YYYY-MM-DD
  description?: string;

  // Telemetry linkage
  sensorConnected: boolean; // True if designated to stream real hardware telemetry (Arduino Uno via Flask API)
  
  // Metadata
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | string | null;
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number } | string | null;
}

export type CreateMachineInput = Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMachineInput = Partial<Omit<Machine, 'id' | 'userId' | 'createdAt'>>;
