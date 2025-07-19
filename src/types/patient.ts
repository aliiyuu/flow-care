export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: number; // Higher numbers indicate higher priority
  arrivalTime: string;
  status: 'waiting' | 'in-treatment' | 'completed';
  treatmentStartTime?: string; // When treatment begins
  treatmentEndTime?: string; // When treatment completes
  vitalSigns?: {
    heartRate?: number;
    bloodPressure?: string;
    oxygenSaturation?: number;
    temperature?: number;
  };
}