'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Button from './ui/Button';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant powered by Gemini for the triage system. I can help you with patient assessments, treatment recommendations, and analytics insights. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Fetch current patient data to provide context to AI
      let patientData = [];
      try {
        const patientsResponse = await fetch('/api/patients');
        if (patientsResponse.ok) {
          const data = await patientsResponse.json();
          patientData = data.patients || [];
        }
      } catch (error) {
        console.log('Could not fetch current patients for AI context');
      }

      // Call your Gemini AI endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: 'triage_system', // Add context for the AI
          patientData: patientData // Include current patient data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Chat cleared! I\'m your Gemini-powered AI assistant. How can I help you?',
        timestamp: new Date()
      }
    ]);
  };

  const getQuickActions = () => [
    'Get current analytics insights',
    'Help me assess a critical patient',
    'Show waiting queue summary',
    'Recommend treatment protocols',
    'Calculate patient priority',
    'Emergency procedures guide',
    'Staff allocation recommendations',
    'Recent patient updates'
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Chat Window */}
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-teal-200 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-200 bg-teal-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-teal-900">AI Assistant</h3>
              <p className="text-xs text-teal-600">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-1 hover:bg-teal-100 rounded text-teal-600 transition-colors"
              title={showQuickActions ? "Hide quick actions" : "Show quick actions"}
            >
              {showQuickActions ? '🎯' : '⚡'}
            </button>
            <button
              onClick={clearChat}
              className="p-1 hover:bg-teal-100 rounded text-teal-600 transition-colors"
              title="Clear chat"
            >
              🗑️
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-teal-100 rounded text-teal-600 transition-colors"
              title="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'ai' ? (
                  <div className="prose prose-sm max-w-none text-sm">
                    <ReactMarkdown
                      components={{
                        // Custom styling for markdown elements
                        h1: ({node, ...props}) => <h1 className="text-base font-bold mb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-1" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-sm font-semibold mb-1" {...props} />,
                        p: ({node, ...props}) => <p className="text-sm mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="text-sm list-disc list-inside mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="text-sm list-decimal list-inside mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="text-sm" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        code: ({node, ...props}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                        pre: ({node, ...props}) => <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
            <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto">
              {getQuickActions().map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="text-left text-xs text-teal-600 hover:text-teal-800 hover:bg-teal-50 px-2 py-1 rounded transition-colors border border-teal-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-teal-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about triage, patients, or analytics..."
              className="flex-1 px-3 py-2 border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <Button
              variant="primary"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-3 py-2"
            >
              {isLoading ? '...' : '📤'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
