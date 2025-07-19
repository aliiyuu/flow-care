import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import { Patient } from '../types/patient';

interface PatientFormProps {
  onAddPatient?: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onAddPatient }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [arrivalTime, setArrivalTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priority = calculatePriority(severity, condition, parseInt(age));
    
    const newPatient: Patient = {
      id: Date.now().toString(),
      name,
      age: parseInt(age),
      condition,
      severity: severity as 'critical' | 'high' | 'medium' | 'low',
      priority,
      arrivalTime: arrivalTime || new Date().toISOString(),
      status: 'waiting'
    };
    
    if (onAddPatient) {
      onAddPatient(newPatient);
    }
    
    // Reset form
    setName('');
    setAge('');
    setCondition('');
    setSeverity('medium');
    setArrivalTime('');
  };

  const calculatePriority = (severity: string, condition: string, age: number): number => {
    let score = 0;
    
    // Severity weight
    switch (severity) {
      case 'critical': score += 100; break;
      case 'high': score += 75; break;
      case 'medium': score += 50; break;
      case 'low': score += 25; break;
    }
    
    // Age weight (children and elderly get priority)
    if (age < 18 || age > 65) score += 20;
    
    // Condition specific weights
    if (condition.toLowerCase().includes('trauma')) score += 30;
    if (condition.toLowerCase().includes('cardiac')) score += 25;
    if (condition.toLowerCase().includes('respiratory')) score += 20;
    
    return score;
  };

  return (
    <Card
      title="Patient Registration"
      content={
        <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" suppressHydrationWarning>
            <Input
              label="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
            
            <Input
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age in years"
              required
            />
          </div>
          
          <Input
            label="Medical Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Describe the primary medical condition or symptoms"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level <span className="text-red-500">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white font-sans"
              required
              suppressHydrationWarning
            >
              <option value="critical">🚨 Critical - Immediate life-threatening emergency</option>
              <option value="high">⚠️ High - Urgent care required within 30 minutes</option>
              <option value="medium">🟡 Medium - Can wait 1-2 hours for treatment</option>
              <option value="low">🟢 Low - Non-urgent, can wait several hours</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select the appropriate triage level based on medical assessment
            </p>
          </div>
          
          <Input
            label="Arrival Time (Optional)"
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
          
          <div className="pt-4 border-t border-gray-200">
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Add Patient to Queue
            </Button>
          </div>
        </form>
      }
    />
  );
};

export default PatientForm;