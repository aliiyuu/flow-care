import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <h3 className="font-bold">Test Component</h3>
      <p>This is a test component to verify rendering works.</p>
    </div>
  );
};

export default TestComponent;
