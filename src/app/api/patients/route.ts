import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for single project deployment
// In production, you'd want to use a proper database
let patients: any[] = [];

// Priority calculation algorithm
function calculatePriority(severity: string, condition: string, age: number, vitalSigns: any = {}) {
  let score = 0;
  
  // Base severity score
  const severityScores: { [key: string]: number } = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25
  };
  score += severityScores[severity] || 25;
  
  // Age factor (children and elderly get priority)
  if (age < 18 || age > 65) score += 20;
  if (age < 5 || age > 80) score += 30;
  
  // Condition-specific weights
  const conditionKeywords: { [key: string]: number } = {
    trauma: 30,
    cardiac: 25,
    respiratory: 20,
    stroke: 35,
    bleeding: 25,
    fracture: 15,
    burn: 20,
    poisoning: 30
  };
  
  const conditionLower = condition.toLowerCase();
  Object.entries(conditionKeywords).forEach(([keyword, weight]) => {
    if (conditionLower.includes(keyword)) {
      score += weight;
    }
  });
  
  // Vital signs factor
  if (vitalSigns.heartRate) {
    if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) score += 15;
  }
  if (vitalSigns.bloodPressure) {
    const [systolic] = vitalSigns.bloodPressure.split('/').map(Number);
    if (systolic > 180 || systolic < 90) score += 15;
  }
  if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) {
    score += 25;
  }
  
  return Math.min(score, 200); // Cap at 200
}

export async function GET() {
  try {
    // Return patients sorted by priority
    const sortedPatients = patients.sort((a, b) => b.priority - a.priority);
    return NextResponse.json({ patients: sortedPatients });
  } catch (error) {
    console.error('Get patients API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate patient data with arrival time
    const now = new Date().toISOString();
    const patient = {
      id: uuidv4(),
      ...data,
      arrivalTime: now,
      priority: calculatePriority(
        data.severity || 'medium',
        data.condition || '',
        data.age || 30,
        data.vitalSigns || {}
      ),
      createdAt: now,
      updatedAt: now,
      status: 'waiting'
    };
    
    // Add to in-memory storage
    patients.push(patient);
    
    return NextResponse.json({ 
      success: true, 
      patient,
      message: 'Patient added successfully' 
    });
  } catch (error) {
    console.error('Add patient API error:', error);
    return NextResponse.json(
      { error: 'Failed to add patient' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }
    
    const patientIndex = patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Update patient with recalculated priority
    const updatedPatient = {
      ...patients[patientIndex],
      ...data,
      priority: calculatePriority(
        data.severity || patients[patientIndex].severity,
        data.condition || patients[patientIndex].condition,
        data.age || patients[patientIndex].age,
        data.vitalSigns || patients[patientIndex].vitalSigns
      ),
      updatedAt: new Date().toISOString()
    };
    
    patients[patientIndex] = updatedPatient;
    
    return NextResponse.json({ 
      success: true, 
      patient: updatedPatient,
      message: 'Patient updated successfully' 
    });
  } catch (error) {
    console.error('Update patient API error:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }
    
    const patientIndex = patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Remove patient
    patients.splice(patientIndex, 1);
    
    return NextResponse.json({ 
      success: true,
      message: 'Patient removed successfully' 
    });
  } catch (error) {
    console.error('Delete patient API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
