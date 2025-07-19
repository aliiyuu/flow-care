import type { Metadata } from 'next';
import React from 'react';
import { Lexend } from 'next/font/google';
import { Navbar } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import './globals.css';

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TriageFlow Care',
  description: 'Emergency triage management system for disaster relief',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lexend.className}>
      <body className="bg-primary-50">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}