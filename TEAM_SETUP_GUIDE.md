# Team Setup Guide - Getting 4 Students Ready to Code

## 🎯 Overview

This guide will help you set up development environments for 4 students to work on Lantern AI simultaneously.

---

## 📋 Prerequisites Checklist

Before the first meeting, ensure each student has:

- [ ] A computer (Windows, Mac, or Linux)
- [ ] Internet connection
- [ ] Email address (for GitHub account)
- [ ] Admin access to install software

---

## 🛠️ Step-by-Step Setup (Do This Together)

### Session 1: Install Required Software (45-60 minutes)

#### Step 1: Install Node.js (10 minutes)

**What it is**: JavaScript runtime needed to run the project

**Installation**:
1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Keep clicking "Next" with default settings
5. Restart computer after installation

**Verify Installation**:
Open Terminal/Command Prompt and type:
```bash
node --version
# Should show: v20.x.x or similar

npm --version
# Should show: 10.x.x or similar
```

---

#### Step 2: Install Git (10 minutes)

**What it is**: Version control system to manage code changes

**Installation**:

**Windows**:
1. Go to https://git-scm.com/download/win
2. Download and run installer
3. Use default settings (just keep clicking Next)

**Mac**:
1. Open Terminal
2. Type: `git --version`
3. If not installed, it will prompt you to install

**Linux**:
```bash
sudo apt-get install git
```

**Verify Installation**:
```bash
git --version
# Should show: git version 2.x.x
```

**Configure Git** (each student does this):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

#### Step 3: Install VS Code (10 minutes)

**What it is**: Code editor (like Microsoft Word, but for code)

**Installation**:
1. Go to https://code.visualstudio.com/
2. Download for your operating system
3. Run installer
4. Keep default settings

**Install Helpful Extensions**:
Open VS Code, click Extensions icon (left sidebar), search and install:
- "ESLint" - Finds code errors
- "Prettier" - Formats code nicely
- "TypeScript and JavaScript Language Features" (usually pre-installed)

---

#### Step 4: Create GitHub Account (10 minutes)

**What it is**: Where code is stored and shared

**Each student**:
1. Go to https://github.com/
2. Click "Sign up"
3. Create account with email
4. Verify email address
5. Choose free plan

**Share GitHub usernames** with mentor

---

### Session 2: Set Up the Project (45-60 minutes)

#### Option A: Using GitHub (Recommended for Teams)

This allows students to work independently and merge their changes.

**Mentor Does Once**:

1. **Create GitHub Repository**:
   ```bash
   # In your lantern-ai folder
   cd lantern-ai
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   - Go to https://github.com/new
   - Create repository named "lantern-ai"
   - Follow instructions to push existing repository:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/lantern-ai.git
   git branch -M main
   git push -u origin main
   ```

3. **Add Students as Collaborators**:
   - Go to repository on GitHub
   - Click "Settings" → "Collaborators"
   - Click "Add people"
   - Add each student's GitHub username

**Each Student Does**:

1. **Clone the Repository**:
   ```bash
   # Create a folder for projects
   cd Desktop
   mkdir Projects
   cd Projects
   
   # Clone the repository
   git clone https://github.com/MENTOR-USERNAME/lantern-ai.git
   cd lantern-ai
   ```

2. **Install Dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Create Environment Files**:

   **Backend** - Create `backend/.env`:
   ```bash
   cd backend
   # Windows:
   echo PORT=3001 > .env
   echo FRONTEND_URL=http://localhost:3000 >> .env
   echo JWT_SECRET=lantern-ai-secret-key >> .env
   echo NODE_ENV=development >> .env
   
   # Mac/Linux:
   cat > .env << EOF
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=lantern-ai-secret-key
   NODE_ENV=development
   EOF
   ```

   **Frontend** - Create `frontend/.env.local`:
   ```bash
   cd ../frontend
   # Windows:
   echo NEXT_PUBLIC_API_URL=http://localhost:3001 > .env.local
   
   # Mac/Linux:
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

4. **Test the Setup**:
   
   Open **2 terminals** in VS Code:
   
   **Terminal 1 - Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Should see: "🚀 Lantern AI API running on port 3001"
   
   **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Should see: "▲ Next.js ... Local: http://localhost:3000"

5. **Open in Browser**:
   - Go to http://localhost:3000
   - You should see the Lantern AI homepage!

---

#### Option B: Using USB Drive (If No Internet/GitHub Access)

**Mentor Does**:
1. Copy entire `lantern-ai` folder to USB drive
2. Give to each student

**Each Student Does**:
1. Copy folder from USB to their computer (e.g., Desktop/Projects/)
2. Follow steps 2-5 from Option A above

---

## 🔀 Git Workflow for Team Collaboration

### Basic Workflow (Teach This First)

**Before Starting Work**:
```bash
# Get latest changes from team
git pull origin main
```

**After Making Changes**:
```bash
# See what you changed
git status

# Add your changes
git add .

# Save your changes with a message
git commit -m "Added 3 new quiz questions"

# Share your changes with team
git push origin main
```

### Branch Workflow (Recommended for Avoiding Conflicts)

Each student works on their own branch:

**Student 1 (Quiz)**:
```bash
git checkout -b quiz-improvements
# Make changes
git add .
git commit -m "Added new questions"
git push origin quiz-improvements
```

**Student 2 (Careers)**:
```bash
git checkout -b career-data
# Make changes
git add .
git commit -m "Added 5 new careers"
git push origin career-data
```

**Student 3 (Auth)**:
```bash
git checkout -b auth-features
# Make changes
git add .
git commit -m "Improved login page"
git push origin auth-features
```

**Student 4 (Action Plans)**:
```bash
git checkout -b action-plans
# Make changes
git add .
git commit -m "Enhanced action steps"
git push origin action-plans
```

**Merging Changes** (Mentor helps with this):
```bash
# Switch to main branch
git checkout main

# Merge student's work
git merge quiz-improvements

# Push to GitHub
git push origin main
```

---

## 📁 Folder Structure for Each Student

After setup, each student should have:

```
Desktop/
└── Projects/
    └── lantern-ai/
        ├── backend/
        │   ├── src/
        │   ├── node_modules/
        │   ├── package.json
        │   └── .env
        ├── frontend/
        │   ├── app/
        │   ├── node_modules/
        │   ├── package.json
        │   └── .env.local
        └── README.md
```

---

## 🎯 First Day Activity: "Hello World" Change

Have each student make a simple change to verify their setup works:

### Student 1: Change Quiz Title
**File**: `frontend/app/assessment/page.tsx`
**Change**: Line with "Career Assessment" → "My Career Quiz"

### Student 2: Change Homepage Text
**File**: `frontend/app/page.tsx`
**Change**: "Start Your Career Journey" → "Discover Your Future"

### Student 3: Change Login Button
**File**: `frontend/app/login/page.tsx`
**Change**: "Sign in" → "Login Now"

### Student 4: Change Dashboard Welcome
**File**: `frontend/app/dashboard/page.tsx`
**Change**: "Your Career Journey" → "My Career Path"

**After Each Change**:
1. Save the file
2. Check browser - should auto-refresh
3. See your change!
4. Commit and push:
   ```bash
   git add .
   git commit -m "My first change!"
   git push
   ```

---

## 🐛 Troubleshooting Common Setup Issues

### Issue 1: "npm: command not found"
**Problem**: Node.js not installed or not in PATH
**Solution**: 
- Reinstall Node.js
- Restart computer
- Restart terminal

### Issue 2: "Port 3000 already in use"
**Problem**: Another app using the port
**Solution**:
```bash
# Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue 3: "Permission denied" errors
**Problem**: Need admin rights
**Solution**:
- Run terminal as administrator (Windows)
- Use `sudo` on Mac/Linux
- Or install Node.js with admin rights

### Issue 4: "Module not found" errors
**Problem**: Dependencies not installed
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue 5: Git push fails
**Problem**: Authentication issue
**Solution**:
- Use GitHub personal access token
- Or use GitHub Desktop app (easier for beginners)

---

## 📱 Alternative: GitHub Desktop (Easier for Beginners)

If command-line Git is too complex:

1. **Install GitHub Desktop**:
   - Go to https://desktop.github.com/
   - Download and install

2. **Clone Repository**:
   - Open GitHub Desktop
   - File → Clone Repository
   - Enter repository URL
   - Choose location

3. **Make Changes**:
   - Edit files in VS Code
   - GitHub Desktop shows changes automatically

4. **Commit and Push**:
   - Write commit message in GitHub Desktop
   - Click "Commit to main"
   - Click "Push origin"

Much easier for beginners!

---

## 🎓 Setup Verification Checklist

Before students start coding, verify each has:

- [ ] Node.js installed and working
- [ ] Git installed and configured
- [ ] VS Code installed with extensions
- [ ] GitHub account created
- [ ] Project cloned to their computer
- [ ] Dependencies installed (node_modules folders exist)
- [ ] Environment files created (.env files)
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can see the app in browser
- [ ] Made and committed first change
- [ ] Can push changes to GitHub

---

## 📅 Recommended Setup Timeline

### Day 1 (2 hours)
- Install Node.js, Git, VS Code (1 hour)
- Create GitHub accounts (15 min)
- Break (15 min)
- Clone project and install dependencies (30 min)

### Day 2 (1.5 hours)
- Review file structure (30 min)
- Start servers and test (15 min)
- Make first "Hello World" changes (30 min)
- Learn Git basics (15 min)

### Day 3 (1 hour)
- Review Git workflow (20 min)
- Assign areas to each student (20 min)
- Plan first real features (20 min)

---

## 💡 Tips for Smooth Setup

1. **Do It Together**: Set up all 4 students at the same time in one room
2. **Use Projector**: Show steps on big screen
3. **Buddy System**: Pair faster students with slower ones
4. **Take Breaks**: Setup can be tedious
5. **Celebrate**: When everyone's setup works, celebrate!
6. **Document Issues**: Write down any problems for future reference
7. **Have Backup**: Keep project on USB drive just in case

---

## 🆘 Getting Help During Setup

If stuck:
1. **Check error message** - Often tells you what's wrong
2. **Google the error** - Someone else has had this problem
3. **Ask in team chat** - Maybe another student knows
4. **Check GitHub Issues** - Common problems documented
5. **Ask mentor** - That's what you're there for!

---

## 📚 Resources to Share with Students

**After Setup, Share These**:
- `STUDENT_GUIDE.md` - Their main reference
- `START_SERVERS.md` - How to run the app
- `MENTOR_GUIDE.md` - For you to reference

**Bookmark These Websites**:
- https://nodejs.org/docs - Node.js documentation
- https://react.dev/learn - React tutorial
- https://www.typescriptlang.org/docs - TypeScript docs
- https://stackoverflow.com/ - Q&A for programmers

---

## 🎉 Success!

Once all 4 students can:
1. Start both servers
2. See the app in their browser
3. Make a change and see it update
4. Commit and push their change

**You're ready to start building! 🚀**

---

## 📞 Next Steps After Setup

1. **Review STUDENT_GUIDE.md together** (30 min)
2. **Assign each student their area** (15 min)
3. **Plan first features** (30 min)
4. **Set up daily standup time** (5 min)
5. **Create team communication channel** (Discord/Slack)
6. **Schedule weekly demo meetings**

Good luck with your team! 🎓
