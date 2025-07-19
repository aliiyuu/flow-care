'use client';

import { useState, useEffect } from 'react';
import PatientForm from '../../components/PatientForm';
import PatientQueue from '../../components/PatientQueue';
import { Patient } from '../../types/patient';
import { usePatientsPersistent } from '../../hooks/usePatientsPersistent';

export default function TriagePage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [syncMode, setSyncMode] = useState(false); // Toggle for server sync
  
  const {
    sortedPatients: patients,
    addPatient, // Use local-only version by default
    updatePatient, // Use local-only version by default
    lastUpdated,
    clearAllPatients,
    syncWithServer,
    addPatientWithSync,
    updatePatientWithSync,
  } = usePatientsPersistent();

  // Wait for hydration to complete
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleAddPatient = (patient: Patient) => {
    console.log('Patient added:', patient);
    if (syncMode) {
      addPatientWithSync(patient);
    } else {
      addPatient(patient);
    }
  };

  const handleUpdatePatient = (patientId: string, updates: Partial<Patient>) => {
    if (syncMode) {
      updatePatientWithSync(patientId, updates);
    } else {
      updatePatient(patientId, updates);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Triage System
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Register and manage emergency patients with priority-based care
          </p>
          
          {/* Persistence Info */}
          <div className="flex justify-center items-center gap-4 mb-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            )}
            
            {/* Sync Mode Toggle */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={syncMode}
                onChange={(e) => setSyncMode(e.target.checked)}
                className="rounded"
              />
              <span className={syncMode ? 'text-blue-600' : 'text-gray-600'}>
                {syncMode ? '🔄 Server Sync Mode' : '💾 Local Mode'}
              </span>
            </label>
            
            <button
              onClick={syncWithServer}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
            >
              Sync with Server
            </button>
            <button
              onClick={clearAllPatients}
              className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              Clear All Patients
            </button>
          </div>
          
          {hasHydrated && patients.length > 0 && (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
              📂 {patients.length} patients stored persistently
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PatientForm onAddPatient={handleAddPatient} />
          </div>
          
          <div>
            <PatientQueue 
              patients={patients} 
              onUpdatePatient={handleUpdatePatient}
              hasHydrated={hasHydrated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
