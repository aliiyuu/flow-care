import React from 'react';

const SimplePatientForm: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Simple Patient Form</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter patient name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default SimplePatientForm;
