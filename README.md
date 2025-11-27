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

5. **Configure BLS API (Optional)**
   
   To enable economic data enrichment from the Bureau of Labor Statistics:
   
   a. Register for a free API key at https://data.bls.gov/registrationEngine/
   
   b. Add to your `.env` file:
   ```bash
   BLS_API_KEY=your_api_key_here
   BLS_ENABLED=true
   ```
   
   > **Note:** The BLS API works without an API key, but with lower rate limits (25 series per request, 500 daily requests). With an API key, you get 50 series per request and 500 daily requests.

6. **Start development servers**
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

## BLS API Integration

Lantern AI integrates with the U.S. Bureau of Labor Statistics (BLS) API to provide accurate economic data for career recommendations.

### Fetching BLS Data

```typescript
import { getSeries, getMultipleSeries, BLS_SERIES } from './services/blsClient';

// Fetch CPI (Consumer Price Index) data
const cpiData = await getSeries(BLS_SERIES.CPI_ALL_URBAN, 2020, 2023);

// Fetch unemployment rate
const unemploymentData = await getSeries(BLS_SERIES.UNEMPLOYMENT_RATE, 2020, 2023);

// Fetch multiple series at once
const economicData = await getMultipleSeries([
  BLS_SERIES.CPI_ALL_URBAN,
  BLS_SERIES.UNEMPLOYMENT_RATE,
  BLS_SERIES.AVERAGE_HOURLY_EARNINGS
], 2020, 2023);
```

### Available Series Constants

| Constant | Series ID | Description |
|----------|-----------|-------------|
| `CPI_ALL_URBAN` | CUSR0000SA0 | Consumer Price Index for All Urban Consumers |
| `CPI_FOOD` | CUSR0000SAF1 | CPI for Food |
| `CPI_ENERGY` | CUSR0000SA0E | CPI for Energy |
| `CPI_MEDICAL` | CUSR0000SAM | CPI for Medical Care |
| `UNEMPLOYMENT_RATE` | LNS14000000 | Civilian Unemployment Rate |
| `AVERAGE_HOURLY_EARNINGS` | CES0500000003 | Average Hourly Earnings |

### Configuration Options

Set these environment variables to configure the BLS integration:

| Variable | Default | Description |
|----------|---------|-------------|
| `BLS_API_KEY` | (none) | Your BLS API registration key |
| `BLS_ENABLED` | `true` | Enable/disable BLS data enrichment |
| `BLS_CACHE_ENABLED` | `true` | Enable/disable response caching |
| `BLS_CACHE_TTL_MS` | `3600000` | Cache time-to-live in milliseconds (1 hour) |

### Testing the BLS Integration

Once the backend is running with `npm run dev`, you can access the BLS economic data endpoint:

```bash
# Get economic indicators (CPI, unemployment rate, wages)
curl http://localhost:3001/api/careers/economic-data
```

Or visit `http://localhost:3001/api/careers/economic-data` in your browser.

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
