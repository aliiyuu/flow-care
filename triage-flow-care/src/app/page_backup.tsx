import React from 'react';
import Link from 'next/link';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-25 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary-900 mb-6 leading-tight">
            TriageFlow Care
          </h1>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Advanced emergency triage management system designed for disaster relief scenarios. 
            Streamline patient care with intelligent priority algorithms and real-time coordination.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/triage">
              <Button size="lg" className="w-full sm:w-auto">
                Start Emergency Triage
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card
            content={
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-xl font-bold">🚨</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Smart Triage</h3>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  AI-powered priority assessment using medical severity, age factors, and condition-specific algorithms
                </p>
                <ul className="text-sm text-primary-600 space-y-1 text-left">
                  <li>• Automated priority scoring</li>
                  <li>• Critical case identification</li>
                  <li>• Real-time queue updates</li>
                </ul>
              </div>
            }
            footer={
              <Link href="/triage">
                <Button variant="primary" className="w-full">
                  Begin Triage
                </Button>
              </Link>
            }
          />

          <Card
            content={
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-xl font-bold">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Live Dashboard</h3>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  Monitor patient flow, treatment assignments, and resource allocation in real-time
                </p>
                <ul className="text-sm text-primary-600 space-y-1 text-left">
                  <li>• Patient queue visualization</li>
                  <li>• Treatment status tracking</li>
                  <li>• Resource management</li>
                </ul>
              </div>
            }
            footer={
              <Link href="/dashboard">
                <Button variant="secondary" className="w-full">
                  Open Dashboard
                </Button>
              </Link>
            }
          />

          <Card
            content={
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 text-xl font-bold">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Analytics</h3>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  Comprehensive insights and performance metrics for emergency response optimization
                </p>
                <ul className="text-sm text-primary-600 space-y-1 text-left">
                  <li>• Interactive visualizations</li>
                  <li>• Performance metrics</li>
                  <li>• Trend analysis</li>
                </ul>
              </div>
            }
            footer={
              <Link href="/analytics">
                <Button variant="success" className="w-full">
                  View Analytics
                </Button>
              </Link>
            }
          />
        </div>

        {/* Trust Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-teal border border-primary-100 p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary-900 mb-4">Trusted by Emergency Response Teams</h2>
            <p className="text-primary-700 leading-relaxed">
              Built with healthcare professionals for critical care situations. Our system ensures HIPAA compliance, 
              accessibility standards, and intuitive workflows that work under pressure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}