import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Patient } from '../types/patient';

interface PatientQueueProps {
  patients: Patient[];
  onUpdatePatient?: (patientId: string, updates: Partial<Patient>) => void;
  hasHydrated?: boolean;
}

const PatientQueue: React.FC<PatientQueueProps> = ({ 
  patients, 
  onUpdatePatient, 
  hasHydrated = true 
}) => {
  // Sort patients by priority (highest first) and then by arrival time
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Higher priority first
    }
    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'in-treatment': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card
      title={hasHydrated ? `Patient Queue (${patients.length})` : `Patient Queue (...)`}
      content={
        <div className="space-y-3">
          {!hasHydrated ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">⏳</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading queue...</h3>
              <p className="text-sm">Retrieving patient data...</p>
            </div>
          ) : sortedPatients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
              <p className="text-sm">Add patients using the triage form to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className={`border-l-4 ${getSeverityColor(patient.severity)} bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                        <p className="text-sm text-gray-500">Age {patient.age}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(patient.severity)}`}>
                        {patient.severity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{patient.condition}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Priority Score:</span>
                      <span className="font-semibold text-gray-900">{patient.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Arrival Time:</span>
                      <span className="text-gray-900">{new Date(patient.arrivalTime).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="primary" size="sm" className="flex-1">
                      Start Treatment
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
};

export default PatientQueue;