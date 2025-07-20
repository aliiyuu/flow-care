'use client';

import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface PatientAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patientData: any) => void;
  suggestedData?: {
    suggestedName?: string;
    suggestedAge?: number | string;
    suggestedCondition?: string;
    suggestedSeverity?: string;
    foundVitalSigns?: Record<string, any>;
  };
}

const PatientAddModal: React.FC<PatientAddModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddPatient,
  suggestedData = {}
}) => {
  const [formData, setFormData] = useState({
    name: suggestedData.suggestedName || '',
    age: suggestedData.suggestedAge || '',
    condition: suggestedData.suggestedCondition || '',
    severity: suggestedData.suggestedSeverity || 'medium',
    vitalSigns: suggestedData.foundVitalSigns || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.condition) {
      onAddPatient({
        name: formData.name,
        age: parseInt(String(formData.age)),
        condition: formData.condition,
        severity: formData.severity,
        vitalSigns: formData.vitalSigns
      });
      // Reset form
      setFormData({
        name: '',
        age: '',
        condition: '',
        severity: 'medium',
        vitalSigns: {}
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVitalSignChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [key]: value
      }
    }));
  };

  const addVitalSign = () => {
    const key = prompt('Enter vital sign name (e.g., heartRate, bloodPressure):');
    if (key) {
      handleVitalSignChange(key, '');
    }
  };

  const removeVitalSign = (key: string) => {
    setFormData(prev => {
      const newVitalSigns = { ...prev.vitalSigns };
      delete newVitalSigns[key];
      return { ...prev, vitalSigns: newVitalSigns };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Patient to Triage System"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter patient's full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Patient's age"
            min="0"
            max="150"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Condition *
          </label>
          <textarea
            value={formData.condition}
            onChange={(e) => handleInputChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-none"
            placeholder="Describe symptoms, injuries, or medical condition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity Level *
          </label>
          <select
            value={formData.severity}
            onChange={(e) => handleInputChange('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="low">Low - Minor injuries, stable condition</option>
            <option value="medium">Medium - Moderate injuries, requires attention</option>
            <option value="high">High - Serious condition, urgent care needed</option>
            <option value="critical">Critical - Life-threatening, immediate intervention</option>
          </select>
        </div>

        {/* Vital Signs Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Vital Signs (Optional)
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVitalSign}
              className="text-xs"
            >
              + Add Vital Sign
            </Button>
          </div>
          
          {Object.keys(formData.vitalSigns).length > 0 ? (
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              {Object.entries(formData.vitalSigns).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className="text-sm font-medium capitalize min-w-[100px]">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => handleVitalSignChange(key, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="Enter value"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVitalSign(key)}
                    className="text-xs px-2 py-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No vital signs added. Common examples: heartRate, bloodPressure, oxygenSaturation, temperature
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            Add Patient to Queue
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientAddModal;
