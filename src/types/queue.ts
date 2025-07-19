import { Patient } from './patient';

export interface Queue {
  patients: Patient[];
  addPatient(patient: Patient): void;
  removePatient(): Patient | undefined;
  peek(): Patient | undefined;
  isEmpty(): boolean;
  size(): number;
}