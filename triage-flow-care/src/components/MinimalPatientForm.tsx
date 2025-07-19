import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface MinimalPatientFormProps {
  onAddPatient?: (patient: any) => void;
}

const MinimalPatientForm: React.FC<MinimalPatientFormProps> = ({ onAddPatient }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddPatient) {
      onAddPatient({ id: Date.now().toString(), name });
    }
    setName('');
  };

  return (
    <Card
      title="Minimal Patient Form"
      content={
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Patient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
          <Button type="submit" variant="primary" className="w-full">
            Add Patient
          </Button>
        </form>
      }
    />
  );
};

export default MinimalPatientForm;
