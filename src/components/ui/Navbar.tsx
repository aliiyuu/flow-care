import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">+</span>
              </div>
              <h1 className="text-xl font-semibold text-teal-900">TriageFlow Care</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            <Link href="/dashboard" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/triage" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Triage
            </Link>
            <Link href="/image-scanner" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Document Scanner
            </Link>
            <Link href="/analytics" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
