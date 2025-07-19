import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          TriageFlow Care
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Emergency triage management system
        </p>
        <Link href="/triage" className="bg-blue-500 text-white px-6 py-3 rounded-lg">
          Start Triage
        </Link>
      </div>
    </div>
  );
}
