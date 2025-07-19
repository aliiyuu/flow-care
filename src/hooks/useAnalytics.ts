import { useEffect, useState } from 'react';
import { Patient } from '../types/patient';

interface Analytics {
  totalPatients: number;
  averagePriority: number;
  priorityDistribution: Record<string, number>;
}

const useAnalytics = (patientData: Patient[]): Analytics => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalPatients: 0,
    averagePriority: 0,
    priorityDistribution: {},
  });

  useEffect(() => {
    if (patientData.length > 0) {
      const total = patientData.length;
      const average = patientData.reduce((acc, patient) => acc + patient.priority, 0) / total;
      const distribution = patientData.reduce((acc, patient) => {
        acc[patient.priority.toString()] = (acc[patient.priority.toString()] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setAnalytics({
        totalPatients: total,
        averagePriority: average,
        priorityDistribution: distribution,
      });
    }
  }, [patientData]);

  return analytics;
};

export default useAnalytics;