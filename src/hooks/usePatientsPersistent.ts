import { useCallback, useEffect } from 'react';
import { usePatientStore } from './usePatientStore';
import { Patient } from '../types/patient';

export const usePatientsPersistent = () => {
  const store = usePatientStore();

  // Sync with server on mount (optional - you can implement server sync here)
  useEffect(() => {
    // If you want to sync with your MCP server on load, you can add that logic here
    // For example:
    // syncWithServer();
  }, []);

  const addPatient = useCallback(async (patient: Patient) => {
    try {
      // Add to local store immediately for optimistic updates
      store.addPatient(patient);
      console.log('Patient added to persistent store:', patient);
    } catch (error) {
      console.error('Failed to add patient locally:', error);
    }
  }, [store]);

  const updatePatient = useCallback(async (patientId: string, updates: Partial<Patient>) => {
    try {
      // Update local store immediately
      store.updatePatient(patientId, updates);
      console.log('Patient updated in persistent store:', patientId, updates);
    } catch (error) {
      console.error('Failed to update patient locally:', error);
    }
  }, [store]);

  const removePatient = useCallback(async (patientId: string) => {
    try {
      store.removePatient(patientId);
      console.log('Patient removed from persistent store:', patientId);
    } catch (error) {
      console.error('Failed to remove patient:', error);
    }
  }, [store]);

  const syncWithServer = useCallback(async () => {
    try {
      // Fetch patients from your MCP server
      const response = await fetch('http://localhost:3001/api/patients');
      if (response.ok) {
        const data = await response.json();
        if (data.patients) {
          store.setPatients(data.patients);
          console.log('Successfully synced with server:', data.patients.length, 'patients');
        }
      }
    } catch (error) {
      console.error('Failed to sync with server:', error);
    }
  }, [store]);

  const addPatientWithSync = useCallback(async (patient: Patient) => {
    try {
      // Add to local store immediately for optimistic updates
      store.addPatient(patient);
      
      // Sync with MCP server
      const response = await fetch('http://localhost:3001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      
      if (response.ok) {
        console.log('Patient synced with server:', patient);
      } else {
        console.warn('Failed to sync patient with server, but stored locally');
      }
    } catch (error) {
      console.error('Failed to sync with server, but patient stored locally:', error);
    }
  }, [store]);

  const updatePatientWithSync = useCallback(async (patientId: string, updates: Partial<Patient>) => {
    try {
      // Update local store immediately
      store.updatePatient(patientId, updates);
      
      // Sync with MCP server if it's a status update
      if (updates.status) {
        const response = await fetch(`http://localhost:3001/api/patients/${patientId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: updates.status }),
        });
        
        if (response.ok) {
          console.log('Patient status synced with server:', patientId, updates.status);
        }
      }
    } catch (error) {
      console.error('Failed to sync patient update with server:', error);
    }
  }, [store]);

  const clearAllPatients = useCallback(() => {
    store.clearAllPatients();
  }, [store]);

  return {
    // State from store
    patients: store.patients,
    lastUpdated: store.lastUpdated,
    
    // Sorted/filtered data
    sortedPatients: store.getSortedPatients(),
    waitingPatients: store.getPatientsByStatus('waiting'),
    inTreatmentPatients: store.getPatientsByStatus('in-treatment'),
    completedPatients: store.getPatientsByStatus('completed'),
    
    // Actions
    addPatient,
    updatePatient,
    removePatient,
    clearAllPatients,
    syncWithServer,
    
    // Server-synced actions
    addPatientWithSync,
    updatePatientWithSync,
    
    // Direct store actions (for advanced use)
    setPatients: store.setPatients,
  };
};
