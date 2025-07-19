'use client';

import React from 'react';
import { Patient } from '../../types/patient';

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">
          Emergency Triage System
        </h1>
        <p className="text-primary-700">
          Register new patients and manage the treatment queue
        </p>
      </div>
    </div>
  );
}
