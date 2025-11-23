# Lantern AI - Complete Setup Script

This document provides all the code you need to complete the Lantern AI implementation.

## Current Status
✅ Project structure created
✅ Backend package.json configured
✅ Type definitions complete
✅ Session service created
✅ Assessment questions ready

## Remaining Files to Create

### 1. Install Backend Dependencies

```bash
cd lantern-ai/backend
npm install uuid
npm install --save-dev @types/uuid
```

### 2. Complete Backend Implementation

The backend needs these additional files. I recommend using the existing Rural Career Pathways project as a reference since it has similar functionality:

**Copy and adapt from `PAC-Code/backend/src/`:**
- `services/assessmentService.ts` - Assessment logic
- `services/careerService.ts` - Career matching
- `routes/sessions.ts` - Session endpoints
- `routes/assessment.ts` - Assessment endpoints  
- `routes/careers.ts` - Career endpoints

**Or create minimal versions:**

I'll provide the essential code for each file below.

---

## Essential Backend Files

### File: `backend/src/routes/sessions.ts`

```typescript
import express from 'express';
import { SessionService } from '../services/sessionService';
import { ApiResponse } from '../types';

const router = express.Router();

// POST /api/sessions/start - Create new session
router.post('/start', (req, res) => {
  try {
    const session = SessionService.createSession();
    
    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        expiresAt: session.expiresAt
      },
      message: 'Session created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create session'
    } as ApiResponse);
  }
});

// GET /api/sessions/:id - Get session
router.get('/:id', (req, res) => {
  try {
    const session = SessionService.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: session
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session'
    } as ApiResponse);
  }
});

export default router;
```

### File: `backend/src/routes/assessment.ts`

```typescript
import express from 'express';
import { SessionService } from '../services/sessionService';
import questions from '../data/questions.json';
import { ApiResponse, AssessmentAnswer } from '../types';

const router = express.Router();

// GET /api/assessment/questions
router.get('/questions', (req, res) => {
  res.json({
    success: true,
    data: questions,
    message: `Retrieved ${questions.length} questions`
  } as ApiResponse);
});

// POST /api/assessment/answers
router.post('/answers', (req, res) => {
  try {
    const { sessionId, answers } = req.body;
    
    if (!sessionId || !answers) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and answers are required'
      } as ApiResponse);
    }
    
    const updated = SessionService.updateSessionAnswers(sessionId, answers);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Answers saved successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save answers'
    } as ApiResponse);
  }
});

// POST /api/assessment/complete
router.post('/complete', (req, res) => {
  try {
    const { sessionId, zipCode } = req.body;
    
    const session = SessionService.getSession(sessionId);
    if (!session || !session.assessmentAnswers) {
      return res.status(404).json({
        success: false,
        error: 'Session or answers not found'
      } as ApiResponse);
    }
    
    // Generate profile from answers
    const profile = generateProfile(session.assessmentAnswers, zipCode);
    SessionService.updateSessionProfile(sessionId, profile);
    
    res.json({
      success: true,
      data: profile,
      message: 'Profile generated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate profile'
    } as ApiResponse);
  }
});

function generateProfile(answers: AssessmentAnswer[], zipCode: string) {
  // Simple profile generation logic
  const interests: string[] = [];
  const skills: string[] = [];
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    if (question.category === 'interests' && typeof answer.answer === 'string') {
      if (answer.answer.includes('Agree')) {
        if (question.text.includes('helping')) interests.push('Helping Others');
        if (question.text.includes('hands')) interests.push('Hands-on Work');
        if (question.text.includes('body')) interests.push('Healthcare');
        if (question.text.includes('buildings')) interests.push('Infrastructure');
      }
    }
    
    if (question.category === 'skills' && typeof answer.answer === 'string') {
      if (answer.answer.includes('Agree')) {
        if (question.text.includes('technology')) skills.push('Technology');
        if (question.text.includes('details')) skills.push('Attention to Detail');
        if (question.text.includes('talking')) skills.push('Communication');
      }
    }
  });
  
  return {
    interests: [...new Set(interests)],
    skills: [...new Set(skills)],
    zipCode,
    workEnvironment: 'mixed' as const,
    teamPreference: 'both' as const,
    educationGoal: 'certificate' as const
  };
}

export default router;
```

### File: `backend/src/data/careers.json`

```json
[
  {
    "id": "rn-001",
    "title": "Registered Nurse",
    "sector": "healthcare",
    "description": "Provide and coordinate patient care, educate patients about health conditions, and provide advice and emotional support.",
    "responsibilities": [
      "Assess patient health and record symptoms",
      "Administer medications and treatments",
      "Operate medical equipment",
      "Collaborate with doctors and healthcare team"
    ],
    "requiredEducation": "associate",
    "certifications": ["RN License", "BLS Certification"],
    "averageSalary": 75000,
    "salaryRange": { "min": 65000, "max": 85000 },
    "growthOutlook": "Much faster than average (9% growth)",
    "onetCode": "29-1141.00"
  },
  {
    "id": "ma-001",
    "title": "Medical Assistant",
    "sector": "healthcare",
    "description": "Perform administrative and clinical tasks to support doctors and other health professionals.",
    "responsibilities": [
      "Take patient vital signs",
      "Prepare patients for examination",
      "Assist with minor procedures",
      "Schedule appointments and maintain records"
    ],
    "requiredEducation": "certificate",
    "certifications": ["CMA or RMA Certification"],
    "averageSalary": 37000,
    "salaryRange": { "min": 32000, "max": 42000 },
    "growthOutlook": "Much faster than average (16% growth)",
    "onetCode": "31-9092.00"
  },
  {
    "id": "lpn-001",
    "title": "Licensed Practical Nurse",
    "sector": "healthcare",
    "description": "Provide basic nursing care under the direction of registered nurses and doctors.",
    "responsibilities": [
      "Monitor patient health",
      "Change bandages and insert catheters",
      "Collect samples for testing",
      "Feed and bathe patients"
    ],
    "requiredEducation": "certificate",
    "certifications": ["LPN License"],
    "averageSalary": 50000,
    "salaryRange": { "min": 45000, "max": 55000 },
    "growthOutlook": "Faster than average (6% growth)",
    "onetCode": "29-2061.00"
  },
  {
    "id": "chw-001",
    "title": "Community Health Worker",
    "sector": "healthcare",
    "description": "Assist individuals and communities to adopt healthy behaviors and access healthcare services.",
    "responsibilities": [
      "Conduct outreach and education",
      "Provide informal counseling",
      "Connect people to resources",
      "Advocate for community health needs"
    ],
    "requiredEducation": "certificate",
    "certifications": ["CHW Certification (varies by state)"],
    "averageSalary": 43000,
    "salaryRange": { "min": 38000, "max": 48000 },
    "growthOutlook": "Much faster than average (13% growth)",
    "onetCode": "21-1094.00"
  },
  {
    "id": "emt-001",
    "title": "Emergency Medical Technician",
    "sector": "healthcare",
    "description": "Respond to emergency calls and provide medical care and transportation to patients.",
    "responsibilities": [
      "Assess patient condition",
      "Provide emergency medical care",
      "Transport patients safely",
      "Document care provided"
    ],
    "requiredEducation": "certificate",
    "certifications": ["EMT Certification", "CPR/AED"],
    "averageSalary": 38000,
    "salaryRange": { "min": 33000, "max": 43000 },
    "growthOutlook": "Faster than average (7% growth)",
    "onetCode": "29-2041.00"
  },
  {
    "id": "elec-001",
    "title": "Electrician",
    "sector": "infrastructure",
    "description": "Install, maintain, and repair electrical power, communications, lighting, and control systems.",
    "responsibilities": [
      "Read blueprints and technical diagrams",
      "Install electrical systems",
      "Inspect and test electrical components",
      "Troubleshoot and repair issues"
    ],
    "requiredEducation": "certificate",
    "certifications": ["Electrician License", "OSHA Safety"],
    "averageSalary": 60000,
    "salaryRange": { "min": 50000, "max": 70000 },
    "growthOutlook": "Faster than average (8% growth)",
    "onetCode": "47-2111.00"
  },
  {
    "id": "plumb-001",
    "title": "Plumber",
    "sector": "infrastructure",
    "description": "Install and repair pipes that carry water, gas, or waste to and from homes and businesses.",
    "responsibilities": [
      "Install pipe systems",
      "Repair and maintain plumbing",
      "Read blueprints",
      "Ensure code compliance"
    ],
    "requiredEducation": "certificate",
    "certifications": ["Plumbing License", "Safety Certification"],
    "averageSalary": 58000,
    "salaryRange": { "min": 48000, "max": 68000 },
    "growthOutlook": "Faster than average (5% growth)",
    "onetCode": "47-2152.00"
  },
  {
    "id": "hvac-001",
    "title": "HVAC Technician",
    "sector": "infrastructure",
    "description": "Install, maintain, and repair heating, ventilation, air conditioning, and refrigeration systems.",
    "responsibilities": [
      "Install HVAC systems",
      "Perform maintenance and repairs",
      "Test system performance",
      "Follow safety procedures"
    ],
    "requiredEducation": "certificate",
    "certifications": ["EPA Certification", "HVAC License"],
    "averageSalary": 52000,
    "salaryRange": { "min": 45000, "max": 59000 },
    "growthOutlook": "Faster than average (5% growth)",
    "onetCode": "49-9021.00"
  },
  {
    "id": "const-001",
    "title": "Construction Worker",
    "sector": "infrastructure",
    "description": "Perform physical labor at construction sites, including building, demolition, and site preparation.",
    "responsibilities": [
      "Operate construction equipment",
      "Load and unload materials",
      "Follow safety protocols",
      "Assist skilled tradespeople"
    ],
    "requiredEducation": "high-school",
    "certifications": ["OSHA 10 or 30", "Equipment Certifications"],
    "averageSalary": 40000,
    "salaryRange": { "min": 35000, "max": 45000 },
    "growthOutlook": "Average (4% growth)",
    "onetCode": "47-2061.00"
  },
  {
    "id": "weld-001",
    "title": "Welder",
    "sector": "infrastructure",
    "description": "Join metal parts together using heat and pressure, working in construction, manufacturing, and repair.",
    "responsibilities": [
      "Read blueprints and specifications",
      "Set up welding equipment",
      "Weld metal components",
      "Inspect welds for quality"
    ],
    "requiredEducation": "certificate",
    "certifications": ["AWS Welding Certification"],
    "averageSalary": 47000,
    "salaryRange": { "min": 40000, "max": 54000 },
    "growthOutlook": "Slower than average (2% growth)",
    "onetCode": "51-4121.00"
  }
]
```

### Update `backend/src/index.ts`

Add these imports and routes:

```typescript
import sessionRoutes from './routes/sessions';
import assessmentRoutes from './routes/assessment';

// Add after other middleware
app.use('/api/sessions', sessionRoutes);
app.use('/api/assessment', assessmentRoutes);
```

---

## Frontend Setup

### 1. Create Frontend Package.json

```bash
cd lantern-ai/frontend
```

Create `package.json`:

```json
{
  "name": "lantern-ai-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "react-hook-form": "^7.49.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Next.js

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4. Configure Tailwind

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## Quick Test

1. Start backend:
```bash
cd lantern-ai/backend
npm run dev
```

2. Test health endpoint:
```bash
curl http://localhost:3001/health
```

3. Test session creation:
```bash
curl -X POST http://localhost:3001/api/sessions/start
```

4. Test questions:
```bash
curl http://localhost:3001/api/assessment/questions
```

---

## Next: Create Frontend Pages

I can provide the frontend page code next. The key pages needed are:

1. `app/page.tsx` - Landing page
2. `app/assessment/page.tsx` - Assessment flow
3. `app/results/page.tsx` - Career matches
4. `app/layout.tsx` - Root layout
5. `app/globals.css` - Styles

Would you like me to provide these files?
