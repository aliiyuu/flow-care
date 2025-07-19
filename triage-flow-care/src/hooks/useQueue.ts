import { useState } from 'react';
import { Patient } from '../types/patient';
import usePatients from './usePatients';

const useQueue = () => {
  const [queue, setQueue] = useState<Patient[]>([]);
  const { patients, addPatient, removePatient } = usePatients();

  const enqueuePatient = (patient: Patient) => {
    const newQueue = [...queue, patient];
    // Sort by priority (higher first) then by arrival time
    newQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
    });
    setQueue(newQueue);
  };

  const dequeuePatient = (): Patient | undefined => {
    if (queue.length === 0) return undefined;
    const [nextPatient, ...rest] = queue;
    setQueue(rest);
    return nextPatient;
  };

  const getQueue = (): Patient[] => {
    return queue;
  };

  return {
    enqueuePatient,
    dequeuePatient,
    getQueue,
    patients,
    addPatient,
    removePatient,
  };
};

export default useQueue;