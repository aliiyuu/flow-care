// Vercel serverless function for patients API
import { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage (consider using Vercel KV or external database for production)
let patients: any[] = [];

// Priority calculation algorithm
function calculatePriority(severity: string, condition: string, age: number, vitalSigns: any = {}) {
  let priority = 0;
  
  // Base priority by severity
  switch (severity.toLowerCase()) {
    case 'critical': priority += 200; break;
    case 'high': priority += 150; break;
    case 'medium': priority += 100; break;
    case 'low': priority += 50; break;
    default: priority += 75;
  }
  
  // Age factor (higher priority for very young or old)
  if (age < 2) priority += 50;
  else if (age < 18) priority += 20;
  else if (age > 65) priority += 30;
  else if (age > 80) priority += 50;
  
  // Condition-based keywords
  const highPriorityConditions = [
    'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 
    'severe bleeding', 'unconscious', 'trauma', 'overdose', 'allergic reaction'
  ];
  
  const conditionLower = condition.toLowerCase();
  if (highPriorityConditions.some(keyword => conditionLower.includes(keyword))) {
    priority += 75;
  }
  
  // Vital signs assessment
  if (vitalSigns.heartRate) {
    if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) priority += 25;
  }
  
  if (vitalSigns.oxygenSaturation) {
    if (vitalSigns.oxygenSaturation < 95) priority += 50;
    if (vitalSigns.oxygenSaturation < 90) priority += 75;
  }
  
  if (vitalSigns.temperature) {
    if (vitalSigns.temperature > 102 || vitalSigns.temperature < 95) priority += 25;
  }
  
  return Math.min(priority, 500); // Cap at 500
}

// Update analytics
function updateAnalytics() {
  const analytics = {
    totalPatients: patients.length,
    averagePriority: 0,
    priorityDistribution: {} as any,
    severityBreakdown: { critical: 0, high: 0, medium: 0, low: 0 }
  };
  
  if (patients.length > 0) {
    analytics.averagePriority = patients.reduce((sum, p) => sum + p.priority, 0) / patients.length;
    
    // Severity breakdown
    analytics.severityBreakdown = patients.reduce((breakdown, patient) => {
      breakdown[patient.severity] = (breakdown[patient.severity] || 0) + 1;
      return breakdown;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
  }
  
  return analytics;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const status = req.query.status as string;
        let filteredPatients = patients;
        
        if (status && status !== 'all') {
          filteredPatients = patients.filter(p => p.status === status);
        }
        
        const sortedPatients = filteredPatients.sort((a, b) => b.priority - a.priority);
        return res.status(200).json({ patients: sortedPatients });

      case 'POST':
        const { name, age, condition, severity, vitalSigns } = req.body;
        
        if (!name || !age || !condition || !severity) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const priority = calculatePriority(severity, condition, age, vitalSigns);
        
        const newPatient = {
          id: uuidv4(),
          name,
          age,
          condition,
          severity,
          priority,
          arrivalTime: new Date().toISOString(),
          status: 'waiting',
          vitalSigns: vitalSigns || {}
        };
        
        patients.push(newPatient);
        
        return res.status(201).json({
          success: true,
          patient: newPatient,
          message: `Patient ${name} added with priority score ${priority}`
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
