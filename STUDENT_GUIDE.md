# Lantern AI - Student Team Guide

## 🎯 Project Overview

**Lantern AI** is a career exploration tool that helps high school students discover careers in healthcare and infrastructure. Think of it like a "career matchmaker" - students answer questions about their interests, and the app recommends careers that fit them.

### What Does It Do?
1. Students take a 12-question quiz about their interests
2. The app matches them with careers (like Registered Nurse, Medical Assistant, etc.)
3. Students can create an account to save their results
4. Each career gets a personalized "action plan" - step-by-step instructions on how to pursue that career

---

## 🏗️ Project Structure (The Big Picture)

The project has TWO main parts:

### 1. **Backend** (The Brain) 🧠
- Location: `lantern-ai/backend/`
- Language: TypeScript (like JavaScript with extra safety)
- What it does: Stores data, processes quiz answers, calculates career matches
- Runs on: http://localhost:3001

### 2. **Frontend** (The Face) 🎨
- Location: `lantern-ai/frontend/`
- Language: TypeScript + React (for building web pages)
- What it does: Shows the website, handles user interactions
- Runs on: http://localhost:3000

**Think of it like a restaurant:**
- Frontend = The dining room (what customers see)
- Backend = The kitchen (where the cooking happens)

---

## 📂 File Structure Explained

### Backend Files (The Kitchen)

```
lantern-ai/backend/
├── src/
│   ├── index.ts                    # Main entry point (starts the server)
│   ├── types/index.ts              # Defines data structures
│   │
│   ├── data/
│   │   ├── questions.json          # The 12 quiz questions
│   │   └── careers.json            # List of all careers
│   │
│   ├── services/                   # Business logic (the recipes)
│   │   ├── sessionService.ts       # Tracks user sessions
│   │   ├── assessmentService.ts    # Processes quiz answers
│   │   ├── careerService.ts        # Manages career data
│   │   ├── authService.ts          # Handles login/registration
│   │   └── actionPlanService.ts    # Creates career action plans
│   │
│   └── routes/                     # API endpoints (the menu)
│       ├── sessions.ts             # /api/sessions
│       ├── assessment.ts           # /api/assessment
│       ├── careers.ts              # /api/careers
│       ├── auth.ts                 # /api/auth
│       └── actionPlans.ts          # /api/action-plans
│
└── package.json                    # Lists dependencies
```

### Frontend Files (The Dining Room)

```
lantern-ai/frontend/
├── app/
│   ├── page.tsx                    # Homepage (landing page)
│   ├── assessment/page.tsx         # Quiz page
│   ├── results/page.tsx            # Career matches page
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Sign up page
│   ├── dashboard/page.tsx          # Student dashboard
│   ├── careers/[id]/page.tsx       # Individual career details
│   └── action-plan/[careerCode]/page.tsx  # Action plan page
│
└── package.json                    # Lists dependencies
```

---

## 👥 Team Division - 4 Students

Here's how to divide the work so each student owns a piece:

### **Student 1: Quiz & Assessment Expert** 📝
**Focus Area:** The career assessment quiz

**Your Files:**
- `backend/src/data/questions.json` - The quiz questions
- `backend/src/services/assessmentService.ts` - Quiz logic
- `backend/src/routes/assessment.ts` - Quiz API
- `frontend/app/assessment/page.tsx` - Quiz interface

**What You'll Work On:**
- Adding more questions
- Improving the matching algorithm
- Making the quiz more engaging
- Adding question categories (interests, skills, values)

**Skills You'll Learn:**
- JSON data structures
- Scoring algorithms
- Form handling
- User experience design

---

### **Student 2: Career Data & Matching** 💼
**Focus Area:** Career information and recommendations

**Your Files:**
- `backend/src/data/careers.json` - Career database
- `backend/src/services/careerService.ts` - Career logic
- `backend/src/routes/careers.ts` - Career API
- `frontend/app/results/page.tsx` - Results display
- `frontend/app/careers/[id]/page.tsx` - Career details

**What You'll Work On:**
- Adding more careers
- Improving career descriptions
- Adding salary data
- Enhancing the matching algorithm
- Making career cards more attractive

**Skills You'll Learn:**
- Database management
- API design
- Data visualization
- Research skills (finding career info)

---

### **Student 3: User Accounts & Authentication** 🔐
**Focus Area:** Login, registration, and user profiles

**Your Files:**
- `backend/src/services/authService.ts` - Login/signup logic
- `backend/src/routes/auth.ts` - Auth API
- `frontend/app/login/page.tsx` - Login page
- `frontend/app/register/page.tsx` - Signup page
- `frontend/app/dashboard/page.tsx` - User dashboard

**What You'll Work On:**
- Improving the signup process
- Adding profile pictures
- Creating a profile edit page
- Adding password reset
- Making the dashboard more useful

**Skills You'll Learn:**
- Security concepts
- User authentication
- Form validation
- Session management

---

### **Student 4: Action Plans & Guidance** 🎯
**Focus Area:** Career action plans and next steps

**Your Files:**
- `backend/src/services/actionPlanService.ts` - Action plan logic
- `backend/src/routes/actionPlans.ts` - Action plan API
- `frontend/app/action-plan/[careerCode]/page.tsx` - Action plan page

**What You'll Work On:**
- Adding more action steps
- Creating better resources
- Adding progress tracking
- Making plans more personalized
- Adding milestone celebrations

**Skills You'll Learn:**
- Content creation
- User guidance design
- Progress tracking
- Resource curation

---

## 🎓 Learning Path for Each Student

### Week 1: Understanding Your Area
1. Read through YOUR files
2. Run the app and test YOUR features
3. Make a small change (like changing text)
4. See your change work!

### Week 2: Small Improvements
1. Fix a bug or improve styling
2. Add a new feature (small)
3. Test your changes
4. Share with the team

### Week 3: Bigger Features
1. Plan a bigger improvement
2. Break it into small steps
3. Implement step by step
4. Get feedback from team

### Week 4: Polish & Present
1. Make your area shine
2. Write documentation
3. Prepare demo
4. Present to judges!

---

## 🛠️ Key Concepts Explained Simply

### 1. **Frontend vs Backend**
- **Frontend**: What users see and click (like a website)
- **Backend**: The server that stores data and does calculations
- They talk to each other through **APIs** (like sending messages)

### 2. **API (Application Programming Interface)**
Think of it like a restaurant menu:
- Frontend: "I'd like the career matches for session 123"
- Backend: "Here are 5 careers that match!"

Example API call:
```
POST /api/careers/matches
Request: { sessionId: "123", zipCode: "12345" }
Response: { success: true, data: [careers...] }
```

### 3. **TypeScript**
JavaScript with extra safety - it catches mistakes before you run the code.

```typescript
// TypeScript knows this is a number
let age: number = 16;
age = "sixteen"; // ERROR! Can't put text in a number variable
```

### 4. **React Components**
Building blocks for web pages - like LEGO pieces.

```tsx
function WelcomeMessage() {
  return <h1>Welcome to Lantern AI!</h1>;
}
```

### 5. **JSON (JavaScript Object Notation)**
A way to store data - like a digital filing cabinet.

```json
{
  "id": "1",
  "title": "Registered Nurse",
  "salary": 75000,
  "sector": "healthcare"
}
```

---

## 🚀 How to Make Changes

### Step 1: Find Your File
Use the file structure above to locate the file you want to change.

### Step 2: Make Your Change
Edit the file in your code editor (VS Code, etc.)

### Step 3: Save and Test
The servers will automatically reload! Check your browser.

### Step 4: Share with Team
Use Git to share your changes (your mentor can help with this).

---

## 💡 Project Ideas for Each Student

### Student 1 (Quiz Expert)
- [ ] Add 5 more questions
- [ ] Create question categories
- [ ] Add a progress bar
- [ ] Make questions more engaging
- [ ] Add images to questions

### Student 2 (Career Expert)
- [ ] Add 10 more careers
- [ ] Add career videos
- [ ] Create career comparison tool
- [ ] Add "day in the life" descriptions
- [ ] Show career growth paths

### Student 3 (Auth Expert)
- [ ] Add profile pictures
- [ ] Create profile edit page
- [ ] Add "forgot password"
- [ ] Show user statistics
- [ ] Add achievement badges

### Student 4 (Action Plan Expert)
- [ ] Add more action steps
- [ ] Create printable action plans
- [ ] Add deadline reminders
- [ ] Create milestone celebrations
- [ ] Add mentor connection feature

---

## 🎯 Success Metrics

How to know you're doing well:

1. **Code Works**: Your changes don't break the app
2. **Users Happy**: Features are easy to use
3. **Team Collaboration**: You help each other
4. **Learning**: You understand more each week
5. **Impact**: Students find careers they love!

---

## 📚 Resources for Learning

### For Everyone:
- **TypeScript**: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- **React**: https://react.dev/learn
- **JSON**: https://www.json.org/json-en.html

### For Student 1 (Quiz):
- Form design best practices
- Survey question writing
- User experience (UX) design

### For Student 2 (Careers):
- O*NET career database: https://www.onetonline.org/
- Bureau of Labor Statistics: https://www.bls.gov/
- Career research methods

### For Student 3 (Auth):
- Web security basics
- Password best practices
- User privacy

### For Student 4 (Action Plans):
- Career counseling principles
- Goal setting frameworks
- Educational pathways

---

## 🤝 Working as a Team

### Daily Standup (5 minutes)
Each person shares:
1. What I did yesterday
2. What I'm doing today
3. Any blockers/problems

### Weekly Demo (30 minutes)
Each person shows:
1. What they built
2. How it works
3. What they learned

### Code Reviews
Before merging changes:
1. Another student reviews your code
2. They test it
3. They give feedback
4. You improve it

---

## 🆘 When You're Stuck

1. **Read the error message** - It usually tells you what's wrong
2. **Check the console** - Browser console (F12) shows errors
3. **Ask your teammate** - Someone might know!
4. **Google it** - Copy the error message and search
5. **Ask your mentor** - That's what they're there for!

---

## 🏆 Competition Tips

1. **Focus on Impact**: How does your feature help students?
2. **Tell Stories**: Share real examples of how it works
3. **Show, Don't Tell**: Live demos are powerful
4. **Explain Simply**: Judges aren't all programmers
5. **Highlight Innovation**: What makes your approach unique?

---

## 📝 Documentation Tips

For each feature you build, document:
1. **What it does**: Brief description
2. **Why it matters**: How it helps users
3. **How to use it**: Step-by-step instructions
4. **Technical details**: For other developers

---

## 🎉 Celebrate Wins!

- First successful code change ✅
- First bug fixed 🐛
- First feature completed 🎯
- First user test 👥
- Competition submission 🏆

Remember: Everyone starts as a beginner. The key is to keep learning, help each other, and have fun building something that helps other students!

---

**Good luck, team! You've got this! 🚀**
