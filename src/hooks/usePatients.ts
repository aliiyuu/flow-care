import { useState } from 'react';
import { Patient } from '../types/patient';

const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const addPatient = (newPatient: Patient) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };

  const removePatient = (patientId: string) => {
    setPatients((prevPatients) => 
      prevPatients.filter((patient) => patient.id !== patientId)
    );
  };

  return {
    patients,
    addPatient,
    updatePatient,
    removePatient,
  };
};

export default usePatients;