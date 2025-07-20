'use client';

import React, { useState, useEffect } from 'react';
import { usePatientsPersistent } from '../../hooks/usePatientsPersistent';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PatientAddModal from '../../components/PatientAddModal';
import { exportAnalyticsToPDF, exportAnalyticsWithChartsToPDF } from '../../utils/pdfExport';

export default function DashboardPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const { 
    patients, 
    waitingPatients, 
    inTreatmentPatients, 
    completedPatients,
    lastUpdated,
    syncWithServer
  } = usePatientsPersistent();

  // Wait for hydration to complete
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleAddPatient = async (patientData: any) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Patient ${patientData.name} added successfully with priority score ${result.patient.priority}`);
        setShowAddPatientModal(false);
        // Refresh data
        syncWithServer();
      } else {
        alert('Failed to add patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Error adding patient');
    }
  };

  const getAnalytics = () => {
    const severityDistribution = {
      critical: patients.filter(p => p.severity === 'critical').length,
      high: patients.filter(p => p.severity === 'high').length,
      medium: patients.filter(p => p.severity === 'medium').length,
      low: patients.filter(p => p.severity === 'low').length,
    };

    const statusDistribution = {
      waiting: waitingPatients.length,
      inTreatment: inTreatmentPatients.length,
      completed: completedPatients.length,
    };

    const averageAge = patients.length > 0 
      ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)
      : 0;

    const averagePriority = patients.length > 0 
      ? Math.round(patients.reduce((sum, p) => sum + p.priority, 0) / patients.length)
      : 0;

    const completedWithTimes = completedPatients.filter(p => p.treatmentEndTime);
    const averageWaitTime = completedWithTimes.length > 0 
      ? Math.round(completedWithTimes.reduce((sum, p) => {
          const start = new Date(p.arrivalTime).getTime();
          const end = new Date(p.treatmentStartTime || p.treatmentEndTime!).getTime();
          return sum + (end - start) / (1000 * 60); // minutes
        }, 0) / completedWithTimes.length)
      : 0;

    return { 
      severityDistribution, 
      statusDistribution, 
      averageAge, 
      averagePriority, 
      averageWaitTime 
    };
  };

  const analytics = getAnalytics();

  const handleExportPDF = async () => {
    const analyticsData = {
      severityDistribution: analytics.severityDistribution,
      statusDistribution: analytics.statusDistribution,
      averageAge: analytics.averageAge,
      averagePriority: analytics.averagePriority,
      averageWaitTime: analytics.averageWaitTime,
      totalPatients: patients.length,
      completionRate: Math.round((analytics.statusDistribution.completed / Math.max(patients.length, 1)) * 100),
      highPriorityCases: patients.filter(p => p.priority >= 100).length,
      waitingPatients: waitingPatients.length,
      inTreatmentPatients: inTreatmentPatients.length
    };

    const result = await exportAnalyticsToPDF(analyticsData);
    
    if (result.success) {
      alert(`✅ Report exported successfully as ${result.fileName}`);
    } else {
      alert(`❌ Export failed: ${result.error}`);
    }
  };

  const handleExportWithCharts = async () => {
    const result = await exportAnalyticsWithChartsToPDF('dashboard-analytics');
    
    if (result.success) {
      alert(`✅ Dashboard exported successfully as ${result.fileName}`);
    } else {
      alert(`❌ Export failed: ${result.error}`);
    }
  };

  const stats = {
    total: hasHydrated ? patients.length : 0,
    critical: hasHydrated ? patients.filter(p => p.severity === 'critical').length : 0,
    high: hasHydrated ? patients.filter(p => p.severity === 'high').length : 0,
    waiting: hasHydrated ? waitingPatients.length : 0,
    inTreatment: hasHydrated ? inTreatmentPatients.length : 0,
  };

  const SeverityChart = () => {
    if (!hasHydrated) return <div className="text-gray-500">Loading...</div>;
    
    return (
      <div className="space-y-3">
        {Object.entries(analytics.severityDistribution).map(([severity, count]) => (
          <div key={severity} className="flex items-center justify-between">
            <span className="capitalize font-medium">{severity}</span>
            <div className="flex items-center space-x-2">
              <div 
                className={`h-4 bg-gradient-to-r rounded ${
                  severity === 'critical' ? 'from-red-500 to-red-600' :
                  severity === 'high' ? 'from-orange-500 to-orange-600' :
                  severity === 'medium' ? 'from-yellow-500 to-yellow-600' :
                  'from-green-500 to-green-600'
                }`}
                style={{ width: `${Math.max(count * 20, 20)}px` }}
              />
              <span className="text-sm font-bold">{count}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const StatusChart = () => {
    if (!hasHydrated) return <div className="text-gray-500">Loading...</div>;
    
    return (
      <div className="space-y-3">
        {Object.entries(analytics.statusDistribution).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between">
            <span className="capitalize font-medium">{status.replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex items-center space-x-2">
              <div 
                className={`h-4 bg-gradient-to-r rounded ${
                  status === 'waiting' ? 'from-blue-500 to-blue-600' :
                  status === 'inTreatment' ? 'from-purple-500 to-purple-600' :
                  'from-green-500 to-green-600'
                }`}
                style={{ width: `${Math.max(count * 20, 20)}px` }}
              />
              <span className="text-sm font-bold">{count}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">TriageFlow Dashboard</h1>
          <p className="text-primary-700">Comprehensive patient management and analytics</p>
          {lastUpdated && (
            <p className="text-sm text-primary-600 mt-2">
              📂 Data from persistent store • Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Quick Action Bar */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button 
            variant="primary" 
            size="md"
            onClick={() => setShowAddPatientModal(true)}
          >
            ➕ Add Patient
          </Button>
          <Button 
            variant="secondary" 
            size="md"
            onClick={() => window.location.href = '/triage'}
          >
            👥 View Queue
          </Button>
          <Button 
            variant="primary"
            onClick={handleExportPDF}
            className="bg-green-600 hover:bg-green-700"
          >
            📄 Export Report
          </Button>
          {/* <Button 
            variant="primary"
            onClick={handleExportWithCharts}
            className="bg-blue-600 hover:bg-blue-700"
          >
            📊 Export Dashboard
          </Button> */}
        </div>
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

      {/* Analytics and Activity Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card
          title="Severity Distribution"
          content={<SeverityChart />}
        />
        
        <Card
          title="Patient Status"
          content={<StatusChart />}
        />
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          title="Recent Activity"
          content={
            <div className="space-y-4">
              {patients.slice(-6).map((patient, index) => (
                <div key={patient.id} className="p-4 bg-primary-50 rounded-lg border border-primary-100 hover:bg-primary-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-primary-900">{patient.name}</h4>
                      <p className="text-sm text-primary-600">Age: {patient.age} • ID: {patient.id.slice(-6)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      patient.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      patient.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-primary-700 mb-2">
                    <strong>Condition:</strong> {patient.condition}
                  </div>
                  <div className="flex justify-between items-center text-xs text-primary-600">
                    <span>Priority: {patient.priority}</span>
                    <span className={`px-2 py-1 rounded ${
                      patient.status === 'waiting' ? 'bg-blue-100 text-blue-700' :
                      patient.status === 'in-treatment' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {patient.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-primary-500 mt-1">
                    Arrived: {new Date(patient.arrivalTime).toLocaleString()}
                  </div>
                </div>
              ))}
              {patients.length === 0 && (
                <p className="text-primary-500 text-center py-8">No recent activity</p>
              )}
            </div>
          }
        />

        <Card
          title="Performance Metrics"
          content={
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.averageAge}</div>
                  <div className="text-sm text-blue-700">Avg Age</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analytics.averagePriority}</div>
                  <div className="text-sm text-purple-700">Avg Priority</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.averageWaitTime} min</div>
                <div className="text-sm text-green-700">Average Wait Time</div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary-900">System Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-primary-700">Completion Rate</span>
                    <span className="text-sm font-medium text-primary-900">
                      {Math.round((analytics.statusDistribution.completed / Math.max(patients.length, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary-700">High Priority Cases</span>
                    <span className="text-sm font-medium text-primary-900">
                      {patients.filter(p => p.priority >= 100).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary-700">Active Treatments</span>
                    <span className="text-sm font-medium text-primary-900">
                      {inTreatmentPatients.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-primary-200">
                <Button 
                  variant="success" 
                  size="md" 
                  className="w-full"
                  onClick={syncWithServer}
                >
                  Refresh Analytics
                </Button>
              </div>
            </div>
          }
        />
      </div>

      {/* Patient Add Modal */}
      <PatientAddModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}