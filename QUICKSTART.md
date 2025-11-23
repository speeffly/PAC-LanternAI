# Lantern AI - Quick Start Guide

Get Lantern AI running in under 10 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- (Optional) PostgreSQL 14+ for database
- (Optional) Redis for sessions

## Option 1: Quick MVP (No Database)

This gets you a working demo using in-memory storage.

### Step 1: Install Backend
```bash
cd lantern-ai/backend
npm install
```

### Step 2: Create .env file
```bash
cp .env.example .env
# Edit .env and set:
# PORT=3001
# FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Backend
```bash
npm run dev
```

Backend will run on http://localhost:3001

### Step 4: Test Backend
Open browser to http://localhost:3001/health

You should see:
```json
{
  "status": "OK",
  "message": "Lantern AI API is running"
}
```

### Step 5: Install Frontend
```bash
cd ../frontend
# Create package.json first (see below)
npm install
```

### Step 6: Start Frontend
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Option 2: Full Setup (With Database)

### Step 1: Setup PostgreSQL

```bash
# Install PostgreSQL (if not installed)
# On Windows: Download from postgresql.org
# On Mac: brew install postgresql
# On Linux: sudo apt-get install postgresql

# Create database
psql -U postgres
CREATE DATABASE lantern_ai;
\q
```

### Step 2: Run Migrations
```bash
cd lantern-ai/backend
psql -U postgres -d lantern_ai -f ../database/schema.sql
psql -U postgres -d lantern_ai -f ../database/seed.sql
```

### Step 3: Configure Environment
```bash
# Edit backend/.env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/lantern_ai
```

### Step 4: Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Testing the Application

### 1. Start Assessment
- Go to http://localhost:3000
- Click "Get Started"
- Answer 12 questions

### 2. View Results
- See your interest profile
- View career matches
- Check match scores

### 3. Explore Careers
- Click on a career card
- View details and pathway
- See local programs

### 4. Create Action Plan
- Click "Create Action Plan"
- View recommended actions
- Generate counselor email

## API Endpoints

Test these with curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Start session
curl -X POST http://localhost:3001/api/sessions/start

# Get assessment questions
curl http://localhost:3001/api/assessment/questions

# Submit answers (with session ID)
curl -X POST http://localhost:3001/api/assessment/answers \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"xxx", "answers":[...]}'

# Get career matches
curl -X POST http://localhost:3001/api/careers/matches \
  -H "Content-Type: application/json" \
  -d '{"zipCode":"12345", "profile":{...}}'
```

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify Node.js version (18+)
- Check .env file exists

### Frontend won't start
- Check if port 3000 is available
- Run `npm install` again
- Clear node_modules and reinstall

### Database connection fails
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### CORS errors
- Check FRONTEND_URL in backend .env
- Verify both servers are running
- Check browser console for details

## What's Next?

After getting the MVP running:

1. **Add Authentication** - Implement user accounts
2. **Add Counselor Dashboard** - For teachers/counselors
3. **Add Admin Panel** - For data management
4. **Deploy** - Host on cloud platform

## Need More Help?

See IMPLEMENTATION_GUIDE.md for detailed setup instructions.

## Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm test             # Run tests

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build

# Database
psql -U postgres -d lantern_ai -f schema.sql    # Run migrations
psql -U postgres -d lantern_ai -f seed.sql      # Seed data
```

---

🎉 You're ready to go! Start with Option 1 for the quickest setup.
