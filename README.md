# 🏥 Flow Care - Emergency Medical Triage System

> **HackForGaza Submission** - An AI-powered medical triage system designed to optimize emergency healthcare delivery in crisis situations.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://flow-care-53rcnl0z2-clyde0513s-projects.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

## About Flow Care

Flow Care is a comprehensive emergency medical triage system specifically designed to address the critical healthcare challenges faced in Gaza and other crisis situations. The system prioritizes patients based on medical urgency, provides AI-powered medical assistance, and offers real-time analytics to optimize healthcare resource allocation.

### Mission Statement
*"Ensuring no life is lost due to delayed medical attention by providing intelligent, priority-based emergency care management."*

## Live Demo

**Production URL:** [triage-flow-care](https://flow-care-eta.vercel.app/)

## Key Features

### **Smart Triage System**
- **Priority-based patient queue** with intelligent scoring algorithm
- **Real-time arrival tracking** with precise timestamps
- **Multi-factor priority calculation** considering:
  - Medical severity (Critical, High, Medium, Low)
  - Age factors (children and elderly prioritized)
  - Condition-specific weights (trauma, cardiac, respiratory, etc.)
  - Vital signs analysis (heart rate, blood pressure, oxygen saturation)

### **AI-Powered Medical Assistant**
- **Google Gemini AI integration** for medical consultation
- **Context-aware responses** with real-time patient queue visibility
- **Triage guidance** and treatment recommendations
- **24/7 medical support** for healthcare workers

### **Comprehensive Analytics Dashboard**
- **Real-time patient statistics** and queue management
- **Priority distribution analysis** and wait time tracking
- **Visual data representation** with interactive charts
- **PDF export functionality** for reporting and documentation

### **Mobile-First Design**
- **Responsive layout** optimized for all devices
- **Touch-friendly interface** for rapid patient entry
- **Accessibility features** for healthcare workers under stress

### **Real-Time Synchronization**
- **Persistent data storage** with automatic sync
- **Multi-user support** for medical teams
- **Conflict resolution** for simultaneous updates

## Technical Architecture

### **Frontend Stack**
- **Next.js 15.4.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management for patient data
- **React Hooks** - Modern React patterns

### **Backend Stack**
- **Next.js API Routes** - Serverless backend functions
- **Google Gemini Pro** - AI medical assistant
- **UUID** - Unique patient identification
- **In-memory storage** - Fast data access (upgradeable to database)

### **Deployment & DevOps**
- **Vercel** - Serverless deployment platform
- **GitHub** - Version control and CI/CD
- **Environment Variables** - Secure API key management

## Medical Priority Algorithm

Flow Care uses a sophisticated scoring system to determine patient priority:

```typescript
function calculatePriority(severity: string, condition: string, age: number, vitalSigns: any) {
  let score = 0;
  
  // Base severity (25-100 points)
  const severityScores = { critical: 100, high: 75, medium: 50, low: 25 };
  score += severityScores[severity] || 25;
  
  // Age factors (+20-30 points for vulnerable populations)
  if (age < 18 || age > 65) score += 20;
  if (age < 5 || age > 80) score += 30;
  
  // Condition-specific weights (+15-35 points)
  const conditionWeights = {
    stroke: 35, trauma: 30, poisoning: 30, cardiac: 25, 
    bleeding: 25, respiratory: 20, burn: 20, fracture: 15
  };
  
  // Vital signs analysis (+15-25 points for critical values)
  if (heartRate > 120 || heartRate < 50) score += 15;
  if (systolic > 180 || systolic < 90) score += 15;
  if (oxygenSaturation < 95) score += 25;
  
  return Math.min(score, 200); // Maximum priority score
}
```

## User Interface

### **Triage Management**
- Patient registration with comprehensive medical data
- Real-time priority queue visualization
- Quick patient status updates and management

### **AI Medical Assistant**
- Contextual medical consultations
- Emergency treatment guidance
- Patient-specific recommendations based on queue status

### **Analytics Dashboard**
- Patient flow visualization
- Resource utilization metrics
- Performance analytics and reporting

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aliiyuu/flow-care.git
   cd flow-care
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

Flow Care is optimized for Vercel deployment:

```bash
npx vercel
```

Set environment variables in your Vercel dashboard:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `HOCR` - OCR service API key (optional)

## API Documentation

### Patient Management
- `GET /api/patients` - Retrieve all patients (sorted by priority)
- `POST /api/patients` - Add new patient with automatic priority calculation
- `PUT /api/patients` - Update patient information and recalculate priority
- `DELETE /api/patients?id={id}` - Remove patient from queue

### AI Medical Assistant
- `POST /api/ai/chat` - Send medical queries with current patient context

## Impact for Gaza Healthcare

### **Immediate Benefits:**
- **Reduced wait times** through intelligent triage
- **Optimized resource allocation** in overcrowded facilities
- **AI-assisted medical decisions** when specialists are unavailable
- **Real-time patient tracking** for family updates

### **Long-term Impact:**
- **Scalable healthcare infrastructure** that grows with needs
- **Data-driven insights** for healthcare policy improvements
- **Training tool** for medical staff in triage protocols
- **Template system** for other crisis situations worldwide

## Contributing

We welcome contributions to improve Flow Care's impact on emergency healthcare:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## HackForGaza Submission

**Team:** Triage FC Development Team  
**Category:** Healthcare & Medical Technology  
**Submission Date:** July 2025

### **Problem Statement:**
Gaza's healthcare system faces unprecedented challenges with limited resources, overcrowded facilities, and the need for rapid, accurate medical triage during emergencies.

### **Our Solution:**
An AI-powered, web-based triage system that prioritizes patients intelligently, provides medical guidance, and optimizes healthcare resource allocation in real-time.

### **Technical Innovation:**
- Advanced priority scoring algorithm
- Real-time AI medical consultation
- Serverless architecture for reliability
- Mobile-first design for accessibility

## 📞 Contact & Support

- **GitHub:** [aliiyuu/flow-care](https://github.com/aliiyuu/flow-care)
- **Issues:** [Report bugs or request features](https://github.com/aliiyuu/flow-care/issues)

---