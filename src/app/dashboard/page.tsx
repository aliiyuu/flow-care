'use client';

import React, { useState, useEffect } from 'react';
import { usePatientsPersistent } from '../../hooks/usePatientsPersistent';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function DashboardPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { 
    patients, 
    waitingPatients, 
    inTreatmentPatients, 
    completedPatients,
    lastUpdated 
  } = usePatientsPersistent();

  // Wait for hydration to complete
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const stats = {
    total: hasHydrated ? patients.length : 0,
    critical: hasHydrated ? patients.filter(p => p.severity === 'critical').length : 0,
    high: hasHydrated ? patients.filter(p => p.severity === 'high').length : 0,
    waiting: hasHydrated ? waitingPatients.length : 0,
    inTreatment: hasHydrated ? inTreatmentPatients.length : 0,
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard Overview</h1>
          <p className="text-primary-700">Real-time patient management and system insights</p>
          {lastUpdated && (
            <p className="text-sm text-primary-600 mt-2">
              📂 Data persisted • Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Quick Action Bar */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button variant="primary" size="md">
            Add Patient
          </Button>
          <Button variant="secondary" size="md">
            View Queue
          </Button>
          <Button variant="outline" size="md">
            Export Data
          </Button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card
            title="Total Patients"
            content={
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
                <p className="text-primary-600">In system</p>
              </div>
            }
          />
          
          <Card
            title="Critical Cases"
            content={
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
                <p className="text-red-500">Immediate attention</p>
              </div>
            }
          />
          
          <Card
            title="High Priority"
            content={
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.high}</div>
                <p className="text-orange-500">Urgent care</p>
              </div>
            }
          />
          
          <Card
            title="Waiting"
            content={
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.waiting}</div>
                <p className="text-yellow-600">In queue</p>
              </div>
            }
          />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          title="Quick Actions"
          content={
            <div className="space-y-4">
              <Button variant="primary" size="md" className="w-full">
                Add New Patient
              </Button>
              <Button variant="secondary" size="md" className="w-full">
                View All Patients
              </Button>
              <Button variant="success" size="md" className="w-full">
                Generate Report
              </Button>
            </div>
          }
        />
        
        <Card
          title="Recent Activity"
          content={
            <div className="space-y-3">
              {patients.slice(-5).map((patient, index) => (
                <div key={patient.id} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100">
                  <span className="font-medium text-primary-900">{patient.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    patient.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    patient.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {patient.severity.toUpperCase()}
                  </span>
                </div>
              ))}
              {patients.length === 0 && (
                <p className="text-primary-500 text-center py-4">No recent activity</p>
              )}
            </div>
          }
        />
      </div>
      </div>
    </div>
  );
}