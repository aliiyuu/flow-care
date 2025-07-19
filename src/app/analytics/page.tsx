'use client';

import React from 'react';
import usePatients from '../../hooks/usePatients';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AnalyticsPage() {
  const { patients } = usePatients();

  const getAnalytics = () => {
    const severityDistribution = {
      critical: patients.filter(p => p.severity === 'critical').length,
      high: patients.filter(p => p.severity === 'high').length,
      medium: patients.filter(p => p.severity === 'medium').length,
      low: patients.filter(p => p.severity === 'low').length,
    };

    const statusDistribution = {
      waiting: patients.filter(p => p.status === 'waiting').length,
      inTreatment: patients.filter(p => p.status === 'in-treatment').length,
      completed: patients.filter(p => p.status === 'completed').length,
    };

    const averageAge = patients.length > 0 
      ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)
      : 0;

    return { severityDistribution, statusDistribution, averageAge };
  };

  const analytics = getAnalytics();

  const SeverityChart = () => (
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

  const StatusChart = () => (
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

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Analytics Dashboard</h1>
          <p className="text-primary-700">Patient flow insights and system performance metrics</p>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button variant="primary">
            Export Report
          </Button>
          <Button variant="secondary">
            Refresh Data
          </Button>
          <Button variant="outline">
            Configure Alerts
          </Button>
        </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Severity Distribution"
          content={<SeverityChart />}
        />
        
        <Card
          title="Patient Status"
          content={<StatusChart />}
        />
        
        <Card
          title="Key Metrics"
          content={
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                <p className="text-gray-500">Total Patients</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.averageAge}</div>
                <p className="text-gray-500">Average Age</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((analytics.statusDistribution.completed / Math.max(patients.length, 1)) * 100)}%
                </div>
                <p className="text-gray-500">Completion Rate</p>
              </div>
            </div>
          }
        />
      </div>
      
      {patients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No patient data available for analytics.</p>
          <p className="text-gray-400">Add patients through the triage system to see analytics.</p>
        </div>
      )}
      </div>
    </div>
  );
}