/**
 * MCP Client for Triage Flow Care
 * This client can be used by AI systems to interact with the triage data
 */

class TriageMCPClient {
  constructor(serverUrl = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
    this.wsUrl = serverUrl.replace('http', 'ws');
    this.ws = null;
  }

  // Connect to WebSocket for real-time updates
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('Connected to Triage MCP Server');
        resolve();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };
    });
  }

  handleMessage(data) {
    console.log('Received from MCP server:', data);
    // Handle real-time updates here
  }

  // Get available MCP tools
  async getTools() {
    const response = await fetch(`${this.serverUrl}/mcp/tools`);
    return await response.json();
  }

  // Execute an MCP tool
  async callTool(method, params = {}) {
    const response = await fetch(`${this.serverUrl}/mcp/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, params })
    });
    
    if (!response.ok) {
      throw new Error(`MCP call failed: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // Convenience methods for common operations
  async getAllPatients() {
    return await this.callTool('get_patients', { status: 'all' });
  }

  async getWaitingPatients() {
    return await this.callTool('get_patients', { status: 'waiting' });
  }

  async addPatient(patientData) {
    return await this.callTool('add_patient', patientData);
  }

  async updatePatientStatus(patientId, status) {
    return await this.callTool('update_patient_status', { patientId, status });
  }

  async getAnalytics() {
    return await this.callTool('get_analytics', {});
  }

  async calculatePriority(patientData) {
    return await this.callTool('calculate_priority', patientData);
  }

  // Send real-time MCP call via WebSocket
  sendMCPCall(method, params) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'mcp_call',
        data: { method, params }
      }));
    } else {
      throw new Error('WebSocket not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Example usage for AI systems
export default TriageMCPClient;

// Example functions that AI can use
export const aiHelpers = {
  // Analyze current triage situation
  async analyzeTriage(mcpClient) {
    const [patients, analytics] = await Promise.all([
      mcpClient.getAllPatients(),
      mcpClient.getAnalytics()
    ]);
    
    return {
      currentSituation: {
        totalPatients: analytics.result.analytics.totalPatients,
        waitingPatients: patients.result.patients.filter(p => p.status === 'waiting').length,
        criticalPatients: patients.result.patients.filter(p => p.severity === 'critical').length
      },
      recommendations: generateRecommendations(patients.result.patients, analytics.result.analytics)
    };
  },

  // Suggest next patient for treatment
  async suggestNextPatient(mcpClient) {
    const waiting = await mcpClient.getWaitingPatients();
    const patients = waiting.result.patients;
    
    if (patients.length === 0) {
      return { message: 'No patients waiting for treatment' };
    }
    
    // Sort by priority and waiting time
    const nextPatient = patients.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    })[0];
    
    return {
      nextPatient,
      reasoning: `Patient ${nextPatient.name} has highest priority (${nextPatient.priority}) and has been waiting since ${new Date(nextPatient.arrivalTime).toLocaleTimeString()}`
    };
  },

  // Assess if new patient should get immediate attention
  async assessUrgency(mcpClient, patientData) {
    const priority = await mcpClient.calculatePriority(patientData);
    const currentPatients = await mcpClient.getWaitingPatients();
    
    const waitingPriorities = currentPatients.result.patients.map(p => p.priority);
    const highestWaiting = Math.max(...waitingPriorities, 0);
    
    return {
      priority: priority.result.priority,
      shouldJumpQueue: priority.result.priority > highestWaiting,
      explanation: priority.result.explanation,
      recommendation: priority.result.priority > highestWaiting 
        ? 'This patient should receive immediate attention'
        : `This patient can wait in queue (${waitingPriorities.length} patients ahead)`
    };
  }
};

function generateRecommendations(patients, analytics) {
  const recommendations = [];
  
  if (analytics.severityBreakdown.critical > 0) {
    recommendations.push(`🚨 ${analytics.severityBreakdown.critical} critical patients require immediate attention`);
  }
  
  if (analytics.totalPatients > 10) {
    recommendations.push(`⚠️ High patient volume (${analytics.totalPatients}). Consider opening additional treatment areas`);
  }
  
  const waitingTime = patients.filter(p => p.status === 'waiting').length;
  if (waitingTime > 5) {
    recommendations.push(`⏱️ ${waitingTime} patients waiting. Prioritize by triage score`);
  }
  
  return recommendations;
}
