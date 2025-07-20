// Vercel serverless function for analytics
import { VercelRequest, VercelResponse } from '@vercel/node';

// Shared data - in production use a database
let patients: any[] = [];

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const analytics = updateAnalytics();
    return res.status(200).json({ analytics });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
