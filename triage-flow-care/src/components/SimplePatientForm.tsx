import React, { useState } from 'react';

const SimplePatientForm: React.FC = () => {
  console.log('SimplePatientForm rendering...');
  
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with name:', name);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default SimplePatientForm;
