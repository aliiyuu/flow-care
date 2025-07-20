'use client';

import React, { useState } from 'react';
import AIChat from './AIChat';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 transform hover:scale-110"
        title="Open AI Assistant"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* AI Chat Modal */}
      <AIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
