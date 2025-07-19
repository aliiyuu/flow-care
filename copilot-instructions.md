# Triage Flow Care System - Gaza Emergency Medical Response

## Project Overview
This is a **Triage Flow Care System** specifically designed for emergency medical response in Gaza. The application is built with **TypeScript** and **Next.js** framework, providing a comprehensive patient management and triage system for emergency healthcare scenarios.

## Purpose & Context
- **Location**: Gaza emergency medical facilities
- **Use Case**: Mass casualty events, emergency room triage, disaster relief medical response
- **Goal**: Efficiently prioritize and manage patient care based on medical severity and available resources

## Technology Stack
- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.16
- **React**: 19.1.0
- **Development**: Hot reload with `npm run dev`

## Core Features

### 1. Patient Management
- **Patient Registration**: Capture essential patient data (name, age, condition, severity)
- **Priority Calculation**: Automatic priority scoring based on severity, condition, and age
- **Status Tracking**: Monitor patient flow (waiting → in-treatment → completed)
- **Real-time Updates**: Dynamic patient queue management

### 2. Triage System
- **Severity Levels**: Critical, High, Medium, Low
- **Priority Queue**: Intelligent patient ordering based on medical priority
- **Emergency Protocols**: Fast-track critical cases
- **Resource Allocation**: Optimize medical staff deployment

### 3. Analytics & Reporting
- **Patient Statistics**: Real-time dashboards with patient counts and distributions
- **Severity Analytics**: Track critical vs. non-critical patient ratios
- **Treatment Metrics**: Monitor patient flow and treatment completion rates
- **Historical Data**: Trend analysis for resource planning

### 4. Document Scanning (OCR)
- **Medical Document Processing**: Handwritten notes and prescription scanning
- **OCR Integration**: HandwritingOCR API for text extraction
- **Real-time Processing**: Upload progress tracking and status monitoring
- **Text Extraction**: Convert handwritten medical documents to searchable text

## Key Components

### Core Pages
- **`/dashboard`**: Overview statistics and system management
- **`/triage`**: Patient registration and priority queue management
- **`/image-scanner`**: Medical document OCR scanning and transcription
- **`/analytics`**: Data visualization and reporting

### Patient Data Structure
```typescript
interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: number; // Higher = more urgent
  arrivalTime: string;
  status: 'waiting' | 'in-treatment' | 'completed';
}
```

### Priority Algorithm
- Considers medical severity, specific condition, and patient age
- Dynamically calculates priority scores for queue ordering
- Ensures critical patients receive immediate attention

## File Structure
- **`src/app/`**: Next.js app router pages (dashboard, triage, image-scanner, analytics)
- **`src/app/api/`**: API routes for OCR processing and other backend functionality
- **`src/components/`**: Reusable UI components (PatientForm, PatientQueue, TriageBoard)
- **`src/hooks/`**: Custom React hooks (usePatients, useQueue, useAnalytics, useOCR)
- **`src/types/`**: TypeScript interfaces for type safety
- **`src/components/ui/`**: Base UI components (Button, Card, Input, Modal)

## Development Guidelines

### When Contributing
1. **Patient Safety First**: Any changes must prioritize patient care accuracy
2. **Real-time Updates**: Ensure all patient status changes reflect immediately
3. **Accessibility**: UI must be usable under high-stress emergency conditions, ESPECIALLY on mobile devices
4. **Testing**: Implement unit tests for critical components and algorithms
5. **Performance**: System must handle high patient volumes during mass casualty events
6. **Data Integrity**: Patient information must be accurate and persistent

### Emergency Context Considerations
- **Gaza-specific**: Account for resource limitations and infrastructure challenges
- **Multi-language Support**: Consider Arabic and English language needs
- **Offline Capability**: Plan for intermittent internet connectivity
- **Mobile-first**: Designed for tablet/mobile use in field conditions, ESPECIALLY for one-handed operation by medical staff

## MCP Server
- **Location**: `mcp-server/` directory
- **Purpose**: Model Context Protocol server for enhanced AI capabilities
- **Files**: `server.js`, `client.js`, and configuration

## Running the Application
```bash
npm install          # Install dependencies
npm run dev         # Start development server (localhost:3000)
npm run build       # Production build
npm run start       # Start production server
```

## Key Priorities
1. **Patient Safety**: All features must support accurate medical decision-making
2. **Emergency Response**: System designed for high-stress, time-critical scenarios
3. **Scalability**: Handle surge capacity during mass casualty events
4. **Reliability**: Mission-critical system with minimal downtime tolerance
5. **Usability**: Intuitive interface for medical professionals under pressure

---
*This system hopes to save lives by enabling rapid, accurate patient triage in emergency medical situations.*