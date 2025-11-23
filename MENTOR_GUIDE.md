# Lantern AI - Mentor Guide

## 🎯 Overview for Mentors

This guide helps you understand the project architecture and guide your 4 high school students through the Presidential Innovation Challenge.

---

## 📊 Project Architecture (High Level)

### The Stack
- **Frontend**: Next.js 14 (React framework) + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Data**: JSON files (MVP), ready for database migration
- **Auth**: JWT tokens + bcrypt password hashing

### How It Works
```
User Browser (Frontend)
    ↓ HTTP Requests
Backend API Server
    ↓ Processes Data
JSON Files (careers, questions)
    ↓ Returns Results
Backend API Server
    ↓ HTTP Response
User Browser (Frontend)
```

---

## 🏗️ System Components

### 1. Session Management
**Purpose**: Track anonymous users before they create accounts

**Flow**:
1. User visits homepage → Frontend creates session ID
2. Session ID stored in localStorage
3. All quiz answers linked to session ID
4. When user creates account → session data linked to user

**Files**:
- `backend/src/services/sessionService.ts`
- `backend/src/routes/sessions.ts`

### 2. Assessment System
**Purpose**: Quiz that matches students to careers

**Flow**:
1. User answers 12 questions
2. Each answer has a weight (1-5)
3. Answers mapped to career sectors (healthcare/infrastructure)
4. Scoring algorithm calculates best matches
5. Returns top 5 careers with match percentages

**Files**:
- `backend/src/data/questions.json` (quiz questions)
- `backend/src/services/assessmentService.ts` (scoring logic)
- `frontend/app/assessment/page.tsx` (quiz UI)

**Algorithm**:
```typescript
// Simplified scoring
for each career:
  score = 0
  for each answer:
    if answer.sector matches career.sector:
      score += answer.weight
  matchPercentage = (score / maxPossibleScore) * 100
```

### 3. Career Matching
**Purpose**: Recommend careers based on quiz results

**Flow**:
1. Get user's quiz answers
2. Calculate match scores for all careers
3. Filter by sector preferences
4. Sort by match percentage
5. Return top 5 with reasoning

**Files**:
- `backend/src/data/careers.json` (career database)
- `backend/src/services/careerService.ts`
- `frontend/app/results/page.tsx`

### 4. Authentication
**Purpose**: Let students create accounts and save progress

**Flow**:
1. User registers → password hashed with bcrypt
2. JWT token generated (expires in 7 days)
3. Token stored in localStorage
4. Token sent with each API request
5. Backend verifies token for protected routes

**Files**:
- `backend/src/services/authService.ts`
- `backend/src/routes/auth.ts`
- `frontend/app/login/page.tsx`
- `frontend/app/register/page.tsx`

**Security**:
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens signed with secret key
- Token verification on protected routes
- Input validation on all forms

### 5. Action Plans
**Purpose**: Give students step-by-step career guidance

**Flow**:
1. User selects a career
2. System generates personalized action plan
3. Steps categorized (education, skills, experience, etc.)
4. Steps prioritized (high, medium, low)
5. User can check off completed steps

**Files**:
- `backend/src/services/actionPlanService.ts`
- `frontend/app/action-plan/[careerCode]/page.tsx`

---

## 👥 Student Team Structure

### Recommended Division

#### Student 1: Assessment & Quiz
**Complexity**: ⭐⭐ (Moderate)
**Skills Needed**: JSON, basic algorithms, UI design
**Growth Areas**: Data structures, user experience

**Key Tasks**:
- Modify `questions.json` to add/edit questions
- Adjust scoring in `assessmentService.ts`
- Improve quiz UI in `assessment/page.tsx`

**Starter Projects**:
1. Add 3 new questions to the quiz
2. Add a progress bar to the quiz
3. Create question categories

#### Student 2: Career Data & Display
**Complexity**: ⭐⭐ (Moderate)
**Skills Needed**: JSON, API understanding, UI design
**Growth Areas**: Data management, research skills

**Key Tasks**:
- Add careers to `careers.json`
- Enhance career display in `results/page.tsx`
- Improve career details in `careers/[id]/page.tsx`

**Starter Projects**:
1. Add 5 new careers with complete data
2. Add career comparison feature
3. Create career category filters

#### Student 3: User Accounts
**Complexity**: ⭐⭐⭐ (Advanced)
**Skills Needed**: Security concepts, forms, state management
**Growth Areas**: Authentication, security, backend logic

**Key Tasks**:
- Enhance `authService.ts` with new features
- Improve login/register pages
- Build profile management

**Starter Projects**:
1. Add "forgot password" feature
2. Create profile edit page
3. Add user statistics to dashboard

#### Student 4: Action Plans & Guidance
**Complexity**: ⭐⭐ (Moderate)
**Skills Needed**: Content creation, UI design, logic
**Growth Areas**: User guidance, content strategy

**Key Tasks**:
- Enhance `actionPlanService.ts` with more steps
- Improve action plan UI
- Add progress tracking features

**Starter Projects**:
1. Add 5 more action steps per career
2. Create printable action plan
3. Add milestone celebrations

---

## 🎓 Teaching Strategy

### Week 1: Orientation
**Goal**: Students understand the project and their role

**Activities**:
1. **Demo the App** (30 min)
   - Show complete user flow
   - Explain each feature
   - Highlight what each student will work on

2. **Code Walkthrough** (45 min)
   - Show file structure
   - Explain frontend vs backend
   - Demonstrate making a simple change

3. **Setup Environment** (45 min)
   - Install Node.js, VS Code
   - Clone repository
   - Run both servers
   - Make first change (change text on homepage)

**Homework**: Each student explores their assigned files

### Week 2: First Changes
**Goal**: Each student makes their first meaningful contribution

**Activities**:
1. **Code Review Session** (30 min)
   - Review each student's assigned files
   - Explain key concepts
   - Answer questions

2. **Pair Programming** (60 min)
   - Work with each student individually
   - Guide them through first change
   - Commit and test

3. **Team Standup** (15 min)
   - Each student shares what they learned
   - Discuss challenges
   - Plan next steps

**Homework**: Complete first feature

### Week 3-4: Feature Development
**Goal**: Students work independently with guidance

**Daily**:
- 5-minute standup
- Check-ins as needed
- Code reviews

**Weekly**:
- 30-minute demo session
- Team retrospective
- Planning for next week

### Week 5-6: Polish & Prepare
**Goal**: Refine features and prepare presentation

**Activities**:
1. User testing with other students
2. Bug fixing
3. Documentation
4. Presentation preparation
5. Demo practice

---

## 🛠️ Technical Concepts to Teach

### 1. Frontend vs Backend
**Analogy**: Restaurant
- Frontend = Dining room (what customers see)
- Backend = Kitchen (where food is prepared)
- API = Waiter (carries requests and responses)

**Show Them**:
```typescript
// Frontend makes request
const response = await fetch('/api/careers/matches', {
  method: 'POST',
  body: JSON.stringify({ sessionId: '123' })
});

// Backend handles request
router.post('/matches', (req, res) => {
  const { sessionId } = req.body;
  const matches = getMatches(sessionId);
  res.json({ success: true, data: matches });
});
```

### 2. JSON Data Structure
**Analogy**: Digital filing cabinet

**Show Them**:
```json
{
  "id": "29-1141.00",
  "title": "Registered Nurse",
  "sector": "healthcare",
  "description": "Assess patient health...",
  "averageSalary": 75000,
  "educationLevel": "Bachelor's degree"
}
```

### 3. TypeScript Types
**Analogy**: Labels on containers

**Show Them**:
```typescript
// This variable can ONLY hold numbers
let age: number = 16;

// This variable can ONLY hold text
let name: string = "Sarah";

// This object must have these exact properties
interface Career {
  id: string;
  title: string;
  salary: number;
}
```

### 4. React Components
**Analogy**: LEGO blocks for websites

**Show Them**:
```tsx
// A reusable button component
function Button({ text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {text}
    </button>
  );
}

// Use it anywhere
<Button text="Click Me" onClick={handleClick} />
```

### 5. APIs and HTTP
**Analogy**: Sending letters

**Show Them**:
```
GET /api/careers/123
→ "Please send me career #123"
← { id: "123", title: "Nurse", ... }

POST /api/auth/login
→ "Here's my email and password"
← { success: true, token: "abc123" }
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "npm run dev" fails
**Cause**: Missing dependencies
**Solution**: 
```bash
cd lantern-ai/backend
npm install
npm run dev
```

### Issue 2: "Port already in use"
**Cause**: Server already running
**Solution**: 
- Find and kill the process
- Or change port in `.env` file

### Issue 3: Changes not showing
**Cause**: Browser cache or server not restarting
**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Restart the server
- Check for syntax errors in console

### Issue 4: TypeScript errors
**Cause**: Type mismatch
**Solution**:
- Read the error message carefully
- Check the type definition
- Add proper type annotations

### Issue 5: API not working
**Cause**: Backend not running or wrong URL
**Solution**:
- Check backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check browser network tab for errors

---

## 📊 Progress Tracking

### Weekly Checklist

**Week 1**:
- [ ] All students have environment set up
- [ ] Everyone can run the app
- [ ] Each student made one small change
- [ ] Team understands project goals

**Week 2**:
- [ ] Student 1: Added 2+ questions
- [ ] Student 2: Added 3+ careers
- [ ] Student 3: Improved login/signup UI
- [ ] Student 4: Enhanced action plan steps

**Week 3-4**:
- [ ] Each student completed 2+ features
- [ ] Code reviews done
- [ ] Features tested
- [ ] Documentation updated

**Week 5-6**:
- [ ] All features polished
- [ ] User testing completed
- [ ] Presentation prepared
- [ ] Demo practiced

---

## 🎯 Competition Preparation

### Presentation Structure (10 minutes)

1. **Problem** (2 min)
   - Rural students lack career guidance
   - Limited access to counselors
   - Need for healthcare/infrastructure workers

2. **Solution** (3 min)
   - AI-powered career matching
   - Personalized action plans
   - Accessible to all students

3. **Demo** (3 min)
   - Live walkthrough
   - Show key features
   - Highlight student contributions

4. **Impact** (2 min)
   - How many students helped
   - Success stories
   - Future plans

### Demo Script

```
1. Homepage → "This is where students start"
2. Take quiz → "12 questions about interests"
3. View results → "AI matches them with careers"
4. Create account → "Save progress"
5. Action plan → "Step-by-step guidance"
6. Show dashboard → "Track progress"
```

### Talking Points

**Innovation**:
- AI-powered matching algorithm
- Personalized action plans
- Focus on rural communities
- Built by high school students

**Technical**:
- Modern web technologies
- Secure authentication
- Scalable architecture
- Mobile-responsive design

**Impact**:
- Helps underserved communities
- Addresses workforce shortage
- Empowers students
- Free and accessible

---

## 📚 Resources for You

### Learning Resources
- **TypeScript**: https://www.typescriptlang.org/docs/
- **React**: https://react.dev/learn
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com/

### Tools
- **VS Code**: Best code editor
- **Git**: Version control
- **Postman**: API testing
- **Chrome DevTools**: Debugging

### Community
- **Stack Overflow**: Q&A
- **GitHub Discussions**: Project-specific help
- **Discord/Slack**: Team communication

---

## 🤝 Mentoring Tips

### Do's ✅
- Encourage experimentation
- Celebrate small wins
- Pair program when stuck
- Ask guiding questions
- Share your own learning journey

### Don'ts ❌
- Don't write code for them
- Don't expect perfection
- Don't skip code reviews
- Don't let one student dominate
- Don't forget to have fun!

### When Students Are Stuck

**Level 1**: Ask guiding questions
- "What do you think is causing this?"
- "Where have you seen similar code?"
- "What does the error message say?"

**Level 2**: Point them to resources
- "Check the documentation for this function"
- "Look at how we did this in another file"
- "Search for this error on Stack Overflow"

**Level 3**: Work through it together
- "Let's debug this together"
- "I'll share my screen and show you"
- "Let's break this into smaller steps"

---

## 🎉 Celebrating Success

### Milestones to Celebrate
- First code commit
- First feature completed
- First bug fixed
- First code review
- First user test
- Competition submission
- Competition presentation

### Recognition Ideas
- Shout-outs in team meetings
- Feature spotlight in documentation
- GitHub contribution graph
- Team photo with the app
- Certificates of completion

---

## 📞 Getting Help

If you need technical assistance:
1. Check the documentation files in the project
2. Review error messages carefully
3. Search GitHub issues
4. Ask in competition forums
5. Reach out to competition organizers

---

**Remember**: Your role is to guide, not to do the work for them. The best learning happens when students struggle a bit, then figure it out with your support. You've got this! 🚀
