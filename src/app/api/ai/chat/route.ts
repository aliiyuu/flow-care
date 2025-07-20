import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create medical context system prompt
    const systemPrompt = `You are a medical AI assistant for Flow Care, a healthcare triage system. 
    Your role is to provide helpful, accurate medical information while maintaining these guidelines:
    
    - Always recommend consulting with healthcare professionals for serious concerns
    - Provide triage guidance based on symptoms and severity
    - Be empathetic and professional
    - Ask clarifying questions when needed
    - Do not provide definitive diagnoses
    - Focus on immediate care needs and appropriate urgency levels
    
    Context: ${context || 'general medical consultation'}
    
    User message: ${message}`;

    // Generate response
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI request',
        response: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.'
      },
      { status: 500 }
    );
  }
}
