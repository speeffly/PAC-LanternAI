# Lantern AI

**AI-Powered Career Exploration Platform for Rural Students**

Lantern AI helps rural high school students explore career pathways in healthcare and infrastructure, connecting them with local training programs, apprenticeships, and actionable next steps.

## Features

### For Students
- 🎯 Anonymous exploration with optional account creation
- 📝 Conversational interest & skill assessment (10-15 questions)
- 🗺️ ZIP code-based local career matching
- 📊 Personalized career recommendations with match scores
- 🛤️ Visual pathway timelines from high school to career
- 📋 Actionable plans with counselor outreach templates
- 🔔 Deadline reminders and progress tracking
- 👨‍👩‍👧 Parent-friendly summaries (English/Spanish)

### For Counselors & Teachers
- 👥 Student progress dashboard
- 📈 Aggregate trends and insights
- 📝 Individual student profile views
- 💬 Counselor notes and guidance tools

### For Administrators
- 🏫 School course catalog management
- 📚 Local program & apprenticeship data uploads
- ⚙️ System configuration and data management

## Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive, mobile-first design
- **React Hook Form** - Form management

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe backend
- **PostgreSQL** - Primary database
- **Redis** - Session management for anonymous users
- **JWT** - Authentication & authorization

## Project Structure

```
lantern-ai/
├── frontend/          # Next.js frontend application
├── backend/           # Express API server
├── database/          # Database schemas and migrations
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lantern-ai
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env files
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

4. **Set up database**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api-docs

## User Roles

- **Student** - Explore careers, take assessments, create action plans
- **Counselor** - View student progress, provide guidance
- **Teacher** - View class trends, support students
- **Admin** - Manage system data, schools, and programs

## Key Features by Epic

### EPIC A - Student Onboarding
- Anonymous start without account
- Optional account creation
- Secure login with session management

### EPIC B - Assessment
- 10-15 question conversational quiz
- Interest & skill profile generation
- Editable profiles

### EPIC C - Career Matching
- ZIP code-based local filtering
- 10+ career recommendations
- Detailed career views with local data
- HS class & CTE mapping
- Local apprenticeships & programs

### EPIC D - Pathway Visualization
- Step-by-step career timelines
- "What if" scenario exploration
- Adjustable preferences

### EPIC E - Action Plans
- Personalized action plans
- Auto-generated counselor email templates
- Deadline reminders

### EPIC F - Counselor Tools
- Student list & progress tracking
- Individual student profiles
- Aggregate dashboards

### EPIC G - Parent Engagement
- Parent-friendly summaries
- Bilingual support (English/Spanish)
- PDF export

### EPIC H - Admin Tools
- School catalog uploads
- Program data management
- System configuration

## Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## API Documentation

API documentation is available at `/api-docs` when running the backend server.

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

[License Type] - See LICENSE file for details

## Support

For questions or issues, please contact [support contact]

---

Built with ❤️ for rural students exploring their future careers
