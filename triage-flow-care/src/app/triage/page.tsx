'use client';

import { useState } from 'react';
import PatientForm from '../../components/PatientForm';
import PatientQueue from '../../components/PatientQueue';
import { Patient } from '../../types/patient';

export default function TriagePage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const handleAddPatient = (patient: Patient) => {
    console.log('Patient added:', patient);
    setPatients(prev => [...prev, patient]);
  };

  const handleUpdatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, ...updates }
          : patient
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Triage System
          </h1>
          <p className="text-lg text-gray-600">
            Register and manage emergency patients with priority-based care
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PatientForm onAddPatient={handleAddPatient} />
          </div>
          
          <div>
            <PatientQueue 
              patients={patients} 
              onUpdatePatient={handleUpdatePatient}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
