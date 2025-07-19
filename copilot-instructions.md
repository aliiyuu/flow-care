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

### 5. Removal of local-mode and addition of updating and deleting patients

1. Removed Local Mode
File: page.tsx
Changes:
Removed the syncMode state and toggle UI
Simplified the UI to only show server sync button
All operations now automatically sync with the server

2. Fixed Deletion Bug & Added Delete/Edit Functionality
- MCP Server Updates (server.js):
- Added new MCP tools:
- delete_patient: Remove a patient from the system
- update_patient: Update patient information (name, age, condition, severity)

Added new REST endpoints:

- DELETE /api/patients/:id - Delete a patient
- PUT /api/patients/:id - Update patient information

Updated server logs to show all available endpoints:

-Hook Updates (usePatientsPersistent.ts):
- Completely refactored to use server-first approach

All operations now sync with server:
- addPatient: Optimistically updates local state, then syncs with server
- updatePatient: Updates locally, syncs with server, refreshes from server
- removePatient: Removes locally, syncs with server, refreshes from server
- Added error handling: If server sync fails, local changes are reverted
- Auto-sync on mount: App automatically syncs with server when it loads

UI Updates (PatientQueue.tsx):
- Added edit functionality:
- Click "Edit" button to enter edit mode
- Inline form with fields for name, age, condition, and severity
- Save/Cancel buttons for edit operations

Added delete functionality:
- Delete button with confirmation dialog
- Optimistic deletion with server sync
Enhanced status management:
- Dropdown to change patient status (waiting, in-treatment, completed)
- Immediate sync with server when status changes

Improved UI:
- Better button styling
- Clear visual feedback for edit mode
- Responsive design
3. Key Improvements Made:
- Server-First Architecture: Everything now syncs with the MCP server immediately
- Optimistic Updates: UI updates immediately for better user experience, but reverts if server sync fails
- Error Handling: Robust error handling with fallback to local state if server is unavailable
- Consistent State: Analytics page will now always show accurate data because everything syncs through the server
- Better UX: Users can edit any patient field and delete patients with confirmation

4. How the Fixed System Works
Adding a Patient:

Form submission immediately adds to local state:
- Sends to server, gets server response
- Refreshes from server to ensure consistency
- Editing a Patient:

Click edit button to enter edit mode: 
- Make changes in inline form
- Save sends updates to server and refreshes data

Deleting a Patient:

- Click delete with confirmation
- Optimistically removes from UI
- Syncs deletion with server
- If deletion fails, patient is restored to UI

Status Updates:

- Use dropdown to change status
- Immediately syncs with server

Analytics Consistency:

Since all operations go through the server, analytics page always shows current data
HOPEFULLY no more sync issues between triage and analytics pages
Please fix if there are any remaining inconsistencies or and issues

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

## Infinite loops and such
// ❌ Had syncWithServer in dependency array
const addPatient = useCallback(async (patient: Patient) => {
  // ... add logic ...
  await syncWithServer(); // ❌ Called memoized function
}, [store, syncWithServer]); // ❌ Dependency on syncWithServer

always do [store] in the dependency array, but never [syncWithServer] or any other function that is memoized

After (fixed):

// ✅ Only depends on store
const addPatient = useCallback(async (patient: Patient) => {
  // ... add logic ...
  // ✅ Direct fetch call instead of memoized function
  const refreshResponse = await fetch('http://localhost:3001/api/patients');
  if (refreshResponse.ok) {
    const data = await refreshResponse.json();
    if (data.patients) {
      store.setPatients(data.patients);
    }
  }
}, [store]); // ✅ Only depends on stable store



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