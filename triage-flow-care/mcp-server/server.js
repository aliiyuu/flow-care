import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

// In-memory data store (in production, use a real database)
let patients = [];
let analytics = {
  totalPatients: 0,
  averagePriority: 0,
  priorityDistribution: {},
  severityBreakdown: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  }
};

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Priority calculation algorithm
function calculatePriority(severity, condition, age, vitalSigns = {}) {
  let score = 0;
  
  // Base severity score
  const severityScores = {
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
  const conditionKeywords = {
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

// Update analytics
function updateAnalytics() {
  analytics.totalPatients = patients.length;
  
  if (patients.length > 0) {
    analytics.averagePriority = patients.reduce((sum, p) => sum + p.priority, 0) / patients.length;
    
    // Priority distribution
    analytics.priorityDistribution = patients.reduce((dist, patient) => {
      const range = getPriorityRange(patient.priority);
      dist[range] = (dist[range] || 0) + 1;
      return dist;
    }, {});
    
    // Severity breakdown
    analytics.severityBreakdown = patients.reduce((breakdown, patient) => {
      breakdown[patient.severity] = (breakdown[patient.severity] || 0) + 1;
      return breakdown;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
  }
}

function getPriorityRange(priority) {
  if (priority >= 150) return 'critical';
  if (priority >= 100) return 'high';
  if (priority >= 50) return 'medium';
  return 'low';
}

// MCP Tools/Resources
const mcpTools = {
  // Get all patients
  getPatients: {
    name: "get_patients",
    description: "Retrieve all patients in the triage system",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["waiting", "in-treatment", "completed", "all"],
          description: "Filter patients by status"
        }
      }
    }
  },
  
  // Add a new patient
  addPatient: {
    name: "add_patient",
    description: "Add a new patient to the triage system with automatic priority calculation",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Patient's full name" },
        age: { type: "number", description: "Patient's age in years" },
        condition: { type: "string", description: "Medical condition or symptoms" },
        severity: { 
          type: "string", 
          enum: ["critical", "high", "medium", "low"],
          description: "Medical severity assessment" 
        },
        vitalSigns: {
          type: "object",
          properties: {
            heartRate: { type: "number" },
            bloodPressure: { type: "string" },
            oxygenSaturation: { type: "number" },
            temperature: { type: "number" }
          }
        }
      },
      required: ["name", "age", "condition", "severity"]
    }
  },
  
  // Update patient status
  updatePatientStatus: {
    name: "update_patient_status",
    description: "Update a patient's treatment status",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string", description: "Patient's unique ID" },
        status: { 
          type: "string", 
          enum: ["waiting", "in-treatment", "completed"],
          description: "New status" 
        }
      },
      required: ["patientId", "status"]
    }
  },
  
  // Get analytics
  getAnalytics: {
    name: "get_analytics",
    description: "Get real-time analytics and statistics about the triage system",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  
  // Calculate priority for hypothetical patient
  calculatePriority: {
    name: "calculate_priority",
    description: "Calculate priority score for a hypothetical patient without adding them to the system",
    inputSchema: {
      type: "object",
      properties: {
        age: { type: "number", description: "Patient's age" },
        condition: { type: "string", description: "Medical condition" },
        severity: { 
          type: "string", 
          enum: ["critical", "high", "medium", "low"],
          description: "Severity level" 
        },
        vitalSigns: {
          type: "object",
          properties: {
            heartRate: { type: "number" },
            bloodPressure: { type: "string" },
            oxygenSaturation: { type: "number" },
            temperature: { type: "number" }
          }
        }
      },
      required: ["age", "condition", "severity"]
    }
  }
};

// MCP Tool execution
async function executeTool(toolName, args) {
  switch (toolName) {
    case 'get_patients':
      const status = args.status || 'all';
      if (status === 'all') {
        return { patients: patients.sort((a, b) => b.priority - a.priority) };
      }
      return { 
        patients: patients
          .filter(p => p.status === status)
          .sort((a, b) => b.priority - a.priority) 
      };
      
    case 'add_patient':
      const priority = calculatePriority(
        args.severity, 
        args.condition, 
        args.age, 
        args.vitalSigns
      );
      
      const newPatient = {
        id: uuidv4(),
        name: args.name,
        age: args.age,
        condition: args.condition,
        severity: args.severity,
        priority,
        arrivalTime: new Date().toISOString(),
        status: 'waiting',
        vitalSigns: args.vitalSigns || {}
      };
      
      patients.push(newPatient);
      updateAnalytics();
      
      return { 
        success: true, 
        patient: newPatient, 
        message: `Patient ${args.name} added with priority score ${priority}` 
      };
      
    case 'update_patient_status':
      const patientIndex = patients.findIndex(p => p.id === args.patientId);
      if (patientIndex === -1) {
        return { success: false, message: 'Patient not found' };
      }
      
      patients[patientIndex].status = args.status;
      if (args.status === 'in-treatment') {
        patients[patientIndex].treatmentStartTime = new Date().toISOString();
      } else if (args.status === 'completed') {
        patients[patientIndex].treatmentEndTime = new Date().toISOString();
      }
      
      updateAnalytics();
      
      return { 
        success: true, 
        patient: patients[patientIndex],
        message: `Patient status updated to ${args.status}` 
      };
      
    case 'get_analytics':
      updateAnalytics();
      return { analytics };
      
    case 'calculate_priority':
      const calculatedPriority = calculatePriority(
        args.severity, 
        args.condition, 
        args.age, 
        args.vitalSigns
      );
      
      return { 
        priority: calculatedPriority,
        explanation: `Priority calculated based on severity (${args.severity}), age (${args.age}), condition (${args.condition}), and vital signs`
      };
      
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// REST API Endpoints for the Next.js app
app.get('/api/patients', async (req, res) => {
  try {
    const result = await executeTool('get_patients', { status: req.query.status });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const result = await executeTool('add_patient', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patients/:id/status', async (req, res) => {
  try {
    const result = await executeTool('update_patient_status', {
      patientId: req.params.id,
      status: req.body.status
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const result = await executeTool('get_analytics', {});
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/calculate-priority', async (req, res) => {
  try {
    const result = await executeTool('calculate_priority', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MCP Protocol endpoints
app.get('/mcp/tools', (req, res) => {
  res.json({ tools: Object.values(mcpTools) });
});

app.post('/mcp/call', async (req, res) => {
  try {
    const { method, params } = req.body;
    const result = await executeTool(method, params);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    patients: patients.length
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`🏥 Triage MCP Server running on port ${port}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET  /api/patients - Get all patients`);
  console.log(`   - POST /api/patients - Add new patient`);
  console.log(`   - GET  /api/analytics - Get analytics`);
  console.log(`   - POST /api/calculate-priority - Calculate priority`);
  console.log(`   - GET  /mcp/tools - List available MCP tools`);
  console.log(`   - POST /mcp/call - Execute MCP tool`);
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.send(JSON.stringify({ 
    type: 'connection', 
    message: 'Connected to Triage MCP Server' 
  }));
  
  ws.on('message', async (message) => {
    try {
      const { type, data } = JSON.parse(message);
      
      if (type === 'mcp_call') {
        const result = await executeTool(data.method, data.params);
        ws.send(JSON.stringify({ type: 'mcp_result', result }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', error: error.message }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

export default app;
