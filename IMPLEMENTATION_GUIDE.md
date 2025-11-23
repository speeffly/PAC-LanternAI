# Lantern AI - Implementation Guide

This guide will help you complete the Lantern AI implementation with all three components: Frontend, Backend, and Database.

## Current Status

✅ **Completed:**
- Project structure created
- Backend package.json with dependencies
- TypeScript configuration
- Type definitions for all data models
- Environment configuration template
- Main server file (basic)

## Implementation Steps

### Phase 1: Backend Core (2-3 hours)

#### 1.1 Install Dependencies
```bash
cd lantern-ai/backend
npm install
```

#### 1.2 Create Core Services

**File: `src/services/sessionService.ts`**
- Manages anonymous sessions
- Session storage (in-memory for MVP, Redis for production)
- Session expiration handling

**File: `src/services/assessmentService.ts`**
- Assessment questions management
- Answer processing
- Profile generation from answers

**File: `src/services/careerService.ts`**
- Career data management
- Career matching algorithm
- Local filtering by ZIP code

**File: `src/services/actionPlanService.ts`**
- Action plan generation
- Email template creation
- Reminder management

#### 1.3 Create API Routes

**File: `src/routes/sessions.ts`**
```typescript
POST /api/sessions/start - Create anonymous session
GET /api/sessions/:id - Get session data
```

**File: `src/routes/assessment.ts`**
```typescript
GET /api/assessment/questions - Get all questions
POST /api/assessment/answers - Submit answers
POST /api/assessment/complete - Complete assessment & generate profile
```

**File: `src/routes/careers.ts`**
```typescript
POST /api/careers/matches - Get career matches for profile
GET /api/careers/:id - Get career details
GET /api/careers/:id/pathway - Get career pathway
```

**File: `src/routes/actionPlans.ts`**
```typescript
POST /api/action-plans - Create action plan
GET /api/action-plans/:id - Get action plan
PUT /api/action-plans/:id/actions/:actionId - Update action
```

#### 1.4 Sample Data Files

**File: `src/data/questions.json`**
- 12 assessment questions

**File: `src/data/careers.json`**
- 10 sample careers (5 healthcare, 5 infrastructure)

**File: `src/data/programs.json`**
- Sample training programs

### Phase 2: Database Layer (1-2 hours)

#### 2.1 Database Schema

**File: `database/schema.sql`**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL,
  school_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  grade INTEGER,
  zip_code VARCHAR(10),
  profile_completed BOOLEAN DEFAULT FALSE,
  consent_given BOOLEAN DEFAULT FALSE
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  interests TEXT[],
  skills TEXT[],
  work_environment VARCHAR(20),
  team_preference VARCHAR(20),
  education_goal VARCHAR(50),
  zip_code VARCHAR(10),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Careers
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  sector VARCHAR(50) NOT NULL,
  description TEXT,
  responsibilities TEXT[],
  required_education VARCHAR(50),
  certifications TEXT[],
  average_salary INTEGER,
  salary_min INTEGER,
  salary_max INTEGER,
  growth_outlook TEXT,
  onet_code VARCHAR(20)
);

-- Career matches
CREATE TABLE career_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  career_id UUID REFERENCES careers(id),
  match_score INTEGER,
  reasoning_factors TEXT[],
  local_demand VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Action plans
CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  career_id UUID REFERENCES careers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Actions
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id UUID REFERENCES action_plans(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_date DATE,
  notes TEXT
);

-- Training programs
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  type VARCHAR(50),
  sector VARCHAR(50),
  target_careers TEXT[],
  duration VARCHAR(100),
  cost INTEGER,
  is_paid BOOLEAN,
  zip_code VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(2),
  eligibility TEXT[],
  application_url TEXT,
  application_deadline DATE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Schools
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  district VARCHAR(255),
  zip_code VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(2)
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  code VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  grade_levels INTEGER[],
  category VARCHAR(100),
  is_cte BOOLEAN DEFAULT FALSE,
  related_careers TEXT[]
);

-- Sessions (for anonymous users)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  profile_data JSONB,
  assessment_answers JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_students_zip ON students(zip_code);
CREATE INDEX idx_careers_sector ON careers(sector);
CREATE INDEX idx_career_matches_student ON career_matches(student_id);
CREATE INDEX idx_sessions_session_id ON sessions(session_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

#### 2.2 Database Connection

**File: `src/config/database.ts`**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

#### 2.3 Seed Data

**File: `database/seed.sql`**
- Insert sample careers
- Insert sample programs
- Insert sample schools

### Phase 3: Frontend (3-4 hours)

#### 3.1 Setup Next.js

```bash
cd lantern-ai/frontend
npm init -y
npm install next@latest react@latest react-dom@latest typescript @types/react @types/node
npm install tailwindcss postcss autoprefixer
npm install react-hook-form axios
npx tailwindcss init -p
```

#### 3.2 Frontend Structure

```
frontend/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── assessment/
│   │   └── page.tsx            # Assessment flow
│   ├── results/
│   │   └── page.tsx            # Career results
│   ├── careers/
│   │   └── [id]/
│   │       └── page.tsx        # Career detail
│   └── action-plan/
│       └── page.tsx            # Action plan
├── components/
│   ├── assessment/
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ProfileSummary.tsx
│   ├── careers/
│   │   ├── CareerCard.tsx
│   │   ├── CareerList.tsx
│   │   ├── CareerDetail.tsx
│   │   └── PathwayTimeline.tsx
│   ├── actionPlan/
│   │   ├── ActionList.tsx
│   │   ├── ActionItem.tsx
│   │   └── EmailTemplate.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   ├── api.ts                  # API client
│   └── types.ts                # Type definitions
└── public/
    └── images/
```

#### 3.3 Key Frontend Files

**File: `app/page.tsx`** - Landing page with "Get Started" button

**File: `app/assessment/page.tsx`** - Assessment flow (12 questions)

**File: `app/results/page.tsx`** - Career matches display

**File: `app/careers/[id]/page.tsx`** - Career detail view

**File: `lib/api.ts`** - API client for backend communication

### Phase 4: Testing & Launch (1 hour)

#### 4.1 Test Backend
```bash
cd backend
npm run dev
# Test endpoints with curl or Postman
```

#### 4.2 Test Frontend
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

#### 4.3 End-to-End Test
1. Start assessment
2. Answer questions
3. View career matches
4. View career details
5. Create action plan

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd lantern-ai/backend
npm install
npm run dev

# Terminal 2 - Frontend
cd lantern-ai/frontend
npm install
npm run dev

# Terminal 3 - Database (if using PostgreSQL)
psql -U postgres
CREATE DATABASE lantern_ai;
\c lantern_ai
\i database/schema.sql
\i database/seed.sql
```

## Environment Setup

**Backend `.env`:**
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/lantern_ai
JWT_SECRET=your-secret-key
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Next Steps After MVP

1. Add authentication (JWT)
2. Add counselor dashboard
3. Add admin panel
4. Add email notifications
5. Add PDF generation
6. Deploy to production

## Need Help?

Each phase can be implemented incrementally. Start with Phase 1 (Backend Core) to get the API working, then add Frontend, then Database for persistence.

Would you like me to create specific files for any phase?
