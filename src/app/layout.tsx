import type { Metadata } from 'next';
import React from 'react';
import { Lexend } from 'next/font/google';
import { Navbar } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import AIChatButton from '../components/AIChatButton';
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
      <body className="bg-teal-50">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        {/* AI Assistant available on all pages */}
        <AIChatButton />
      </body>
    </html>
  );
}