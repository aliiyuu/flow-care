# Triage MCP Server

A Model Context Protocol (MCP) server for the TriageFlow Care system that enables AI assistants to interact with real-time triage data, calculate patient priorities, and manage emergency care workflows.

## Features

- **Real-time Patient Data**: Access current patient queue and status
- **Smart Priority Calculation**: AI-powered triage scoring based on severity, age, condition, and vital signs
- **Live Analytics**: Real-time statistics and insights
- **WebSocket Support**: Live updates for real-time collaboration
- **RESTful API**: Standard HTTP endpoints for integration
- **MCP Protocol**: Direct integration with AI systems following the Model Context Protocol standard
- **Gemini AI**: Powered by Google's Gemini AI for intelligent triage decisions

## Quick Start

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Start the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start on `http://localhost:3001`

### 3. Test the Connection

```bash
curl http://localhost:3001/health
```

## MCP Tools Available

### 1. `get_patients`
Retrieve all patients in the triage system
```json
{
  "name": "get_patients",
  "params": {
    "status": "waiting" // "waiting", "in-treatment", "completed", or "all"
  }
}
```

### 2. `add_patient`
Add a new patient with automatic priority calculation
```json
{
  "name": "add_patient",
  "params": {
    "name": "John Doe",
    "age": 45,
    "condition": "Chest pain with shortness of breath",
    "severity": "high",
    "vitalSigns": {
      "heartRate": 125,
      "bloodPressure": "160/95",
      "oxygenSaturation": 92,
      "temperature": 99.8
    }
  }
}
```

### 3. `update_patient_status`
Update a patient's treatment status
```json
{
  "name": "update_patient_status",
  "params": {
    "patientId": "uuid-here",
    "status": "in-treatment"
  }
}
```

### 4. `get_analytics`
Get real-time analytics and statistics
```json
{
  "name": "get_analytics",
  "params": {}
}
```

### 5. `calculate_priority`
Calculate priority score for a hypothetical patient
```json
{
  "name": "calculate_priority",
  "params": {
    "age": 65,
    "condition": "Severe trauma from motor vehicle accident",
    "severity": "critical",
    "vitalSigns": {
      "heartRate": 140,
      "bloodPressure": "80/50",
      "oxygenSaturation": 88
    }
  }
}
```

## API Endpoints

### REST API
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient
- `PUT /api/patients/:id/status` - Update patient status
- `GET /api/analytics` - Get analytics
- `POST /api/calculate-priority` - Calculate priority

### MCP Protocol
- `GET /mcp/tools` - List available tools
- `POST /mcp/call` - Execute MCP tool

### WebSocket
- `ws://localhost:3001` - Real-time updates

## Priority Calculation Algorithm

The server uses a sophisticated algorithm to calculate patient priority:

1. **Base Severity Score**:
   - Critical: 100 points
   - High: 75 points
   - Medium: 50 points
   - Low: 25 points

2. **Age Factors**:
   - Under 18 or over 65: +20 points
   - Under 5 or over 80: +30 points

3. **Condition Keywords**:
   - Trauma: +30 points
   - Stroke: +35 points
   - Cardiac: +25 points
   - Respiratory: +20 points
   - Bleeding: +25 points
   - Poisoning: +30 points
   - Burns: +20 points
   - Fracture: +15 points

4. **Vital Signs**:
   - Heart rate >120 or <50: +15 points
   - Blood pressure >180 systolic or <90: +15 points
   - Oxygen saturation <95%: +25 points

**Maximum Score**: 200 points

## Integration with AI Systems

### Gemini AI Integration

This server is powered by Google's Gemini AI. Configure your API key in the `.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

```json
{
  "mcpServers": {
    "triage-care": {
      "command": "node",
      "args": ["/path/to/triage-flow-care/mcp-server/server.js"],
      "env": {
        "PORT": "3001"
      }
    }
  }
}
```

### Using with AI Prompts

Example prompts for AI interaction:

```
"Check the current triage situation and recommend the next patient for treatment"

"Add a new patient: 28-year-old with severe allergic reaction, difficulty breathing, heart rate 130"

"Calculate priority for a 75-year-old with stroke symptoms presenting within 2 hours"

"Get analytics on current patient load and provide recommendations for resource allocation"
```

## Client Integration

Use the provided client library in your Next.js app:

```javascript
import TriageMCPClient from '../mcp-server/client.js';

const mcpClient = new TriageMCPClient('http://localhost:3001');

// Get all patients
const patients = await mcpClient.getAllPatients();

// Add new patient
const result = await mcpClient.addPatient({
  name: "Jane Smith",
  age: 32,
  condition: "Fractured arm",
  severity: "medium"
});

// Get analytics
const analytics = await mcpClient.getAnalytics();
```

## Development

### File Structure
```
mcp-server/
├── server.js      # Main MCP server
├── client.js      # Client library for integration
├── package.json   # Dependencies
├── .env          # Environment configuration
└── README.md     # This file
```

### Environment Variables
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origins

### Adding New Tools

To add new MCP tools:

1. Add tool definition to `mcpTools` object
2. Add execution logic in `executeTool` function
3. Add REST endpoint if needed
4. Update this README

## Security Considerations

- This is a development server - add authentication for production
- Validate all input parameters
- Implement rate limiting for production use
- Use HTTPS in production
- Store data in a proper database (currently uses in-memory storage)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in `.env` file
2. **CORS errors**: Update CORS_ORIGIN in `.env`
3. **WebSocket connection failed**: Check firewall settings

### Logs
The server logs all connections and tool executions to the console.

## Next Steps

1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Add JWT or API key authentication
3. **Rate Limiting**: Implement request throttling
4. **Monitoring**: Add health checks and metrics
5. **Backup**: Implement data backup and recovery
6. **Scaling**: Add clustering support for high availability
