import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Import the same in-memory storage from patients API
let patients: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { message, context, patientData } = await request.json();

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

    // Fetch current patients if not provided in request
    let currentPatients = patientData || [];
    if (!patientData) {
      try {
        const patientsResponse = await fetch(`${request.nextUrl.origin}/api/patients`);
        if (patientsResponse.ok) {
          const data = await patientsResponse.json();
          currentPatients = data.patients || [];
        }
      } catch (error) {
        console.log('Could not fetch current patients for AI context');
      }
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create comprehensive medical context with current state
    const patientSummary = currentPatients.length > 0 
      ? `Current Emergency Department Status:
- Total patients in queue: ${currentPatients.length}
- High priority patients: ${currentPatients.filter((p: any) => p.priority > 75).length}
- Recent arrivals: ${currentPatients.filter((p: any) => {
  const arrivalTime = new Date(p.arrivalTime || p.createdAt);
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return arrivalTime > hourAgo;
}).length}

Current Patients Summary:
${currentPatients.slice(0, 5).map((p: any) => 
  `- ${p.name || 'Patient'} (Age: ${p.age || 'N/A'}, Priority: ${p.priority || 'N/A'}, Condition: ${p.condition || 'N/A'}, Status: ${p.status || 'waiting'})`
).join('\n')}
${currentPatients.length > 5 ? `... and ${currentPatients.length - 5} more patients` : ''}
`
      : 'Current Emergency Department Status: No patients currently in queue.';

    const systemPrompt = `You are a medical AI assistant for Flow Care, a healthcare triage system. 
    Your role is to provide helpful, accurate medical information while maintaining these guidelines:
    
    - Always recommend consulting with healthcare professionals for serious concerns
    - Provide triage guidance based on symptoms and severity
    - Be empathetic and professional
    - Ask clarifying questions when needed
    - Do not provide definitive diagnoses
    - Focus on immediate care needs and appropriate urgency levels
    - You can reference current patient queue status when relevant
    - Help with triage decisions and priority assessments
    
    ${patientSummary}
    
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
