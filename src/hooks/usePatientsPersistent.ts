import { useCallback, useEffect } from 'react';
import { usePatientStore } from './usePatientStore';
import { Patient } from '../types/patient';

export const usePatientsPersistent = () => {
  const store = usePatientStore();

  const syncWithServer = useCallback(async () => {
    try {
      // Use internal API routes for single project deployment
      const response = await fetch('/api/patients');
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
  }, []); // Remove store dependency to prevent recreation

  // Sync with server on mount - use a separate effect without syncWithServer dependency
  useEffect(() => {
    const initialSync = async () => {
      try {
        const response = await fetch('/api/patients');
        if (response.ok) {
          const data = await response.json();
          if (data.patients) {
            store.setPatients(data.patients);
            console.log('Initial sync with server:', data.patients.length, 'patients');
          }
        }
      } catch (error) {
        console.error('Failed to do initial sync with server:', error);
      }
    };
    
    initialSync();
  }, []); // Empty dependency array - only run once on mount
  
    // PROBLEMATIC CODE: (DO NOT DELETE THIS: THIS IS FOR FUTURE REFERENCE. THIS IS SO THAT YOU DO NOT REPEAT THIS IN THE FUTURE. THIS CAUSES INFINITE LOOP)
  // useEffect(() => {
  //   syncWithServer();
  // }, [syncWithServer]); // This creates an infinite loop

  const addPatient = useCallback(async (patient: Patient) => {
    try {
      // Add to local store immediately for optimistic updates
      store.addPatient(patient);
      
      // Sync with internal API routes
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      
      if (response.ok) {
        console.log('Patient synced with server:', patient);
        // Refresh from server to get server-assigned data (direct call, not memoized function)
        const refreshResponse = await fetch('/api/patients');
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.patients) {
            store.setPatients(data.patients);
          }
        }
      } else {
        console.warn('Failed to sync patient with server, reverting local changes');
        store.removePatient(patient.id);
      }
    } catch (error) {
      console.error('Failed to sync with server, reverting local changes:', error);
      store.removePatient(patient.id);
    }
  }, []); // Remove store dependency

  const updatePatient = useCallback(async (patientId: string, updates: Partial<Patient>) => {
    try {
      // Store original patient for potential rollback
      const originalPatient = store.patients.find(p => p.id === patientId);
      
      // Update local store immediately for optimistic updates
      store.updatePatient(patientId, updates);
      
      // Sync with internal API routes
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        console.log('Patient updated on server:', patientId, updates);
        // Refresh from server to get updated data (direct call, not memoized function)
        const refreshResponse = await fetch('/api/patients');
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.patients) {
            store.setPatients(data.patients);
          }
        }
      } else {
        console.warn('Failed to sync patient update with server, reverting local changes');
        if (originalPatient) {
          store.updatePatient(patientId, originalPatient);
        }
      }
    } catch (error) {
      console.error('Failed to sync patient update with server:', error);
      // Revert local changes on error
      const originalPatient = store.patients.find(p => p.id === patientId);
      if (originalPatient) {
        store.updatePatient(patientId, originalPatient);
      }
    }
  }, []); // Remove store dependency

  const removePatient = useCallback(async (patientId: string) => {
    try {
      // Store original patient for potential rollback
      const originalPatient = store.patients.find(p => p.id === patientId);
      
      // Remove from local store immediately for optimistic updates
      store.removePatient(patientId);
      
      // Sync with internal API routes
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('Patient removed from server:', patientId);
        // Refresh from server to ensure consistency (direct call, not memoized function)
        const refreshResponse = await fetch('/api/patients');
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.patients) {
            store.setPatients(data.patients);
          }
        }
      } else {
        console.warn('Failed to remove patient from server, reverting local changes');
        if (originalPatient) {
          store.addPatient(originalPatient);
        }
      }
    } catch (error) {
      console.error('Failed to remove patient from server:', error);
      // Revert local changes on error
      const originalPatient = store.patients.find(p => p.id === patientId);
      if (originalPatient) {
        store.addPatient(originalPatient);
      }
    }
  }, []); // Remove store dependency

  const clearAllPatients = useCallback(() => {
    store.clearAllPatients();
  }, []); // Remove store dependency

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
    
    // Direct store actions (for advanced use)
    setPatients: store.setPatients,
  };
};
