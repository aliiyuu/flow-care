// Vercel serverless function for updating patient status
import { VercelRequest, VercelResponse } from '@vercel/node';

// This would be shared across functions - in production use a database
let patients: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { status } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ error: 'Patient ID and status are required' });
    }
    
    const patientIndex = patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    patients[patientIndex].status = status;
    if (status === 'in-treatment') {
      patients[patientIndex].treatmentStartTime = new Date().toISOString();
    } else if (status === 'completed') {
      patients[patientIndex].treatmentEndTime = new Date().toISOString();
    }
    
    return res.status(200).json({
      success: true,
      patient: patients[patientIndex],
      message: `Patient status updated to ${status}`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
