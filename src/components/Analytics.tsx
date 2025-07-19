import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { usePatientsPersistent } from '../hooks/usePatientsPersistent';

const Analytics = () => {
  const { 
    patients, 
    completedPatients, 
    lastUpdated 
  } = usePatientsPersistent();

  return (
    <div className="space-y-6">
      <Card
        title="Analytics Overview"
        content={
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">Dashboard</div>
              <p className="text-primary-700">Real-time analytics and insights</p>
              {lastUpdated && (
                <p className="text-xs text-primary-500 mt-1">
                  Updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-600">{patients.length}</div>
                <p className="text-primary-700 text-sm">Total Patients</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-600">{completedPatients.length}</div>
                <p className="text-emerald-700 text-sm">Completed</p>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex gap-3">
            <Button variant="primary" size="sm" className="flex-1">
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Export Data
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Analytics;