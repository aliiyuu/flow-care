import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

const TestPatientForm: React.FC = () => {
  console.log('TestPatientForm rendering...');
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [severity, setSeverity] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { name, age, condition, severity });
  };

  return (
    <Card
      title="Patient Registration (Test Version)"
      content={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-sans"
              required
            >
              <option value="critical">🚨 Critical - Immediate life-threatening emergency</option>
              <option value="high">⚠️ High - Urgent care required within 30 minutes</option>
              <option value="medium">🟡 Medium - Can wait 1-2 hours for treatment</option>
              <option value="low">🟢 Low - Non-urgent, can wait several hours</option>
            </select>
          </div>
          
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Add Patient to Queue
          </Button>
        </form>
      }
    />
  );
};

export default TestPatientForm;
