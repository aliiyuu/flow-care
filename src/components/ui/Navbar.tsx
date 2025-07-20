"use client";
// Navbar component for Flow Care
// Provides navigation links and responsive design for desktop and mobile

import React, { useState } from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">+</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-teal-900">TriageFlow Care</h1>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/triage" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Triage
            </Link>
            <Link href="/image-scanner" className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Document Scanner
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-teal-700 hover:text-teal-500 hover:bg-teal-50 p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-teal-100">
              <Link
                href="/dashboard"
                className="block text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/triage"
                className="block text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Triage
              </Link>
              <Link
                href="/image-scanner"
                className="block text-teal-700 hover:text-teal-500 hover:bg-teal-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Document Scanner
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
