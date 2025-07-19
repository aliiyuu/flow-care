import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Patient } from '../types/patient';

interface PatientQueueProps {
  patients: Patient[];
  onUpdatePatient?: (patientId: string, updates: Partial<Patient>) => void;
  onRemovePatient?: (patientId: string) => void;
  hasHydrated?: boolean;
}

const PatientQueue: React.FC<PatientQueueProps> = ({ 
  patients, 
  onUpdatePatient, 
  onRemovePatient,
  hasHydrated = true 
}) => {
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Patient>>({});

  // Sort patients by priority (highest first) and then by arrival time
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Higher priority first
    }
    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
  });

  const handleStartEdit = (patient: Patient) => {
    setEditingPatient(patient.id);
    setEditFormData({
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      severity: patient.severity,
    });
  };

  const handleSaveEdit = () => {
    if (editingPatient && onUpdatePatient) {
      onUpdatePatient(editingPatient, editFormData);
      setEditingPatient(null);
      setEditFormData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingPatient(null);
    setEditFormData({});
  };

  const handleDelete = (patientId: string) => {
    if (onRemovePatient && confirm('Are you sure you want to remove this patient?')) {
      onRemovePatient(patientId);
    }
  };

  const handleStatusChange = (patientId: string, newStatus: Patient['status']) => {
    if (onUpdatePatient) {
      onUpdatePatient(patientId, { status: newStatus });
    }
  };

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
                  {editingPatient === patient.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 text-lg">Edit Patient</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={handleSaveEdit}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={editFormData.name || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            value={editFormData.age || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <textarea
                          value={editFormData.condition || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                          value={editFormData.severity || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, severity: e.target.value as Patient['severity'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    // Regular View
                    <>
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
                      
                      <div className="flex gap-2 mb-3">
                        <select
                          value={patient.status}
                          onChange={(e) => handleStatusChange(patient.id, e.target.value as Patient['status'])}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="waiting">Waiting</option>
                          <option value="in-treatment">In Treatment</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleStartEdit(patient)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => handleDelete(patient.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </>
                  )}
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