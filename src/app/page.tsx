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
            Advanced emergency triage management system designed for critical zones. 
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
          />

          <Card
            content={
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl font-bold">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Real-time Analytics</h3>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  Comprehensive dashboards providing insights into patient flow, resource allocation, and treatment efficiency
                </p>
                <ul className="text-sm text-primary-600 space-y-1 text-left">
                  <li>• Live patient tracking</li>
                  <li>• Resource optimization</li>
                  <li>• Performance metrics</li>
                </ul>
              </div>
            }
          />

          <Card
            content={
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl font-bold">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Rapid Response</h3>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  Streamlined workflows designed for high-pressure emergency scenarios with intuitive interfaces
                </p>
                <ul className="text-sm text-primary-600 space-y-1 text-left">
                  <li>• One-click patient entry</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            }
          />
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-primary-900 mb-8">
            Built for Emergency Response
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">{"<"}30s</div>
              <p className="text-primary-700">Average patient registration time</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
              <p className="text-primary-700">System uptime during disasters</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <p className="text-primary-700">Continuous monitoring and support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            Ready to deploy in your emergency response system?
          </h2>
          <p className="text-primary-700 mb-8 max-w-2xl mx-auto">
            Get started with TriageFlow Care today and transform how your organization handles emergency medical situations.
          </p>
          <Link href="/triage">
            <Button size="lg" className="mx-auto">
              Begin Emergency Triage →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
