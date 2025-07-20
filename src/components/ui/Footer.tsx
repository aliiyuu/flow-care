import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">&copy; 2025 TriageFlow Care. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-1">
            Emergency triage management system for disaster relief
          </p>
        </div>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
          <a href="/legal" className="hover:underline">
            Legal
          </a>
        </div>
      </div>
    </footer>
  );
};
