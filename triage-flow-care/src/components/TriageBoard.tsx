import React from 'react';
import usePatients from '../hooks/usePatients';
import { Patient } from '../types/patient';
import Card from './ui/Card';
import Button from './ui/Button';

const TriageBoard: React.FC = () => {
  const { patients } = usePatients();

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary-900 mb-2">Triage Board</h2>
          <p className="text-primary-700">Overview of all patients in the system</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient: Patient) => (
            <Card
              key={patient.id}
              title={patient.name}
              content={
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-primary-900">Condition:</span>
                    <p className="text-primary-700">{patient.condition}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-primary-900">Priority:</span>
                    <span className="font-bold text-primary-600">{patient.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-primary-900">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      patient.status === 'in-treatment' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              }
              footer={
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" className="flex-1">
                    Update Status
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              }
            />
          ))}
        </div>

        {patients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary-600 text-lg">No patients in the system.</p>
            <p className="text-primary-500">Add patients through the triage form to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriageBoard;