import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patient } from '../types/patient';

interface PatientState {
  // Patient data
  patients: Patient[];
  lastUpdated: string | null;
  
  // Actions
  addPatient: (patient: Patient) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  removePatient: (patientId: string) => void;
  setPatients: (patients: Patient[]) => void;
  clearAllPatients: () => void;
  
  // Queue management
  getSortedPatients: () => Patient[];
  getPatientsByStatus: (status: string) => Patient[];
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      // Initial state
      patients: [],
      lastUpdated: null,
      
      // Actions
      addPatient: (patient: Patient) => {
        set((state) => ({
          patients: [...state.patients, patient],
          lastUpdated: new Date().toISOString(),
        }));
      },
      
      updatePatient: (patientId: string, updates: Partial<Patient>) => {
        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === patientId 
              ? { ...patient, ...updates }
              : patient
          ),
          lastUpdated: new Date().toISOString(),
        }));
      },
      
      removePatient: (patientId: string) => {
        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== patientId),
          lastUpdated: new Date().toISOString(),
        }));
      },
      
      setPatients: (patients: Patient[]) => {
        set({
          patients,
          lastUpdated: new Date().toISOString(),
        });
      },
      
      clearAllPatients: () => {
        set({
          patients: [],
          lastUpdated: new Date().toISOString(),
        });
      },
      
      // Queue management helpers
      getSortedPatients: () => {
        const { patients } = get();
        return [...patients].sort((a, b) => {
          // Sort by priority (higher first) then by arrival time
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
        });
      },
      
      getPatientsByStatus: (status: string) => {
        const { patients } = get();
        return patients.filter((patient) => patient.status === status);
      },
    }),
    {
      name: 'patient-storage', // Storage key
      partialize: (state: PatientState) => ({
        // Persist all patient data
        patients: state.patients,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
