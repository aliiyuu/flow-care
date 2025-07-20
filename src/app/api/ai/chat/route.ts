import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Call your MCP server's AI endpoint
    const serverResponse = await fetch(`${process.env.MCP_SERVER_URL || 'http://localhost:3001'}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: context || 'general',
        timestamp: new Date().toISOString()
      }),
    });

    if (!serverResponse.ok) {
      throw new Error(`Server responded with ${serverResponse.status}`);
    }

    const data = await serverResponse.json();
    
    return NextResponse.json({
      response: data.response,
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
