# Lantern AI - Requirements Document

## Project Overview

**Project Name**: Lantern AI  
**Version**: 1.0  
**Target Users**: High school students in rural areas (grades 9-12)  
**Purpose**: AI-powered career guidance platform for healthcare and infrastructure careers  
**Competition**: Presidential Innovation Challenge

---

## User Personas

### Primary Persona: Sarah (Rural High School Student)
- **Age**: 16, 11th grade
- **Location**: Rural Montana (population 2,500)
- **Challenge**: No career counselor at school, unsure about career options
- **Goal**: Discover careers that match her interests and are viable in rural areas
- **Tech Comfort**: Moderate (uses smartphone daily, some computer experience)

### Secondary Persona: Mr. Johnson (School Counselor)
- **Role**: Counselor serving 300+ students
- **Challenge**: Limited time for individual career guidance
- **Goal**: Provide students with quality career resources efficiently
- **Need**: Tool to supplement his counseling services

### Tertiary Persona: Maria (Parent/Guardian)
- **Role**: Parent of high school student
- **Challenge**: Wants to support child's career planning but lacks information
- **Goal**: Understand career options and help child make informed decisions
- **Need**: Clear, accessible career information

---

## Epic 1: Anonymous Career Exploration

### User Story 1.1: Landing Page Access
**As a** high school student  
**I want to** visit the Lantern AI website without creating an account  
**So that** I can explore the tool before committing to registration

**Acceptance Criteria:**
- [ ] Homepage loads in under 3 seconds
- [ ] Clear value proposition visible above the fold
- [ ] "Start Your Career Journey" call-to-action button prominently displayed
- [ ] ZIP code input field for location-based recommendations
- [ ] Mobile-responsive design (works on phones and tablets)
- [ ] No login required to start assessment
- [ ] Professional, welcoming design appropriate for students

**Priority**: P0 (Must Have)  
**Story Points**: 3

---

### User Story 1.2: Career Assessment Quiz
**As a** student exploring careers  
**I want to** answer questions about my interests and preferences  
**So that** I can receive personalized career recommendations

**Acceptance Criteria:**
- [ ] 12 questions covering interests, skills, and preferences
- [ ] Multiple choice format (4-5 options per question)
- [ ] Progress indicator showing question X of 12
- [ ] Ability to go back and change previous answers
- [ ] Questions cover both healthcare and infrastructure sectors
- [ ] Clear, age-appropriate language
- [ ] Takes 5-10 minutes to complete
- [ ] Auto-save answers to prevent data loss
- [ ] Submit button at the end
- [ ] Validation prevents submission with unanswered questions

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

### User Story 1.3: View Career Matches
**As a** student who completed the assessment  
**I want to** see my top career matches with match percentages  
**So that** I can understand which careers align with my interests

**Acceptance Criteria:**
- [ ] Display top 5 career matches
- [ ] Show match percentage (0-100%) for each career
- [ ] Display career title, sector, and brief description
- [ ] Show average salary for each career
- [ ] Indicate local demand (high/medium/low)
- [ ] List 3-5 reasons why each career matches the student
- [ ] Sort careers by match percentage (highest first)
- [ ] Filter by sector (healthcare/infrastructure/all)
- [ ] Each career card is clickable for more details
- [ ] Results load in under 2 seconds

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### User Story 1.4: Career Detail View
**As a** student interested in a specific career  
**I want to** view detailed information about that career  
**So that** I can learn what the job involves and what's required

**Acceptance Criteria:**
- [ ] Comprehensive career overview/description
- [ ] List of daily tasks and responsibilities
- [ ] Required skills displayed as tags
- [ ] Education requirements clearly stated
- [ ] Average salary with range
- [ ] Work environment description
- [ ] O*NET code displayed
- [ ] Link to O*NET profile
- [ ] Link to job search resources
- [ ] "Get Action Plan" button
- [ ] "Back to Results" navigation
- [ ] Mobile-responsive layout

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

## Epic 2: User Authentication & Accounts

### User Story 2.1: Student Registration
**As a** student who wants to save my results  
**I want to** create an account with email and password  
**So that** I can access my career matches later

**Acceptance Criteria:**
- [ ] Registration form with fields: first name, last name, email, password, confirm password
- [ ] Optional fields: grade level, ZIP code
- [ ] Email format validation
- [ ] Password minimum 6 characters
- [ ] Password confirmation must match
- [ ] Clear error messages for validation failures
- [ ] Success message after registration
- [ ] Automatic login after registration
- [ ] Link existing anonymous session to new account
- [ ] Redirect to dashboard after registration
- [ ] "Already have an account?" link to login page

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

### User Story 2.2: Student Login
**As a** returning student  
**I want to** log in with my email and password  
**So that** I can access my saved career information

**Acceptance Criteria:**
- [ ] Login form with email and password fields
- [ ] "Remember me" option (optional)
- [ ] Clear error message for invalid credentials
- [ ] Redirect to dashboard after successful login
- [ ] "Don't have an account?" link to registration
- [ ] "Continue without account" option
- [ ] Session persists for 7 days
- [ ] Secure password handling (hashed, not plain text)
- [ ] Login completes in under 2 seconds

**Priority**: P0 (Must Have)  
**Story Points**: 3

---

### User Story 2.3: Student Dashboard
**As a** logged-in student  
**I want to** see a personalized dashboard  
**So that** I can quickly access my career information and track progress

**Acceptance Criteria:**
- [ ] Welcome message with student's first name
- [ ] Quick access cards for: Assessment, Results, Profile
- [ ] Profile completion status indicators
- [ ] Assessment status (completed/not started)
- [ ] Location status (ZIP code set/not set)
- [ ] Grade level status (set/not set)
- [ ] Logout button
- [ ] Navigation to all major features
- [ ] Clean, organized layout
- [ ] Mobile-responsive design

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

### User Story 2.4: Session Linking
**As a** student who took the assessment anonymously  
**I want to** my results automatically saved when I create an account  
**So that** I don't have to retake the assessment

**Acceptance Criteria:**
- [ ] Anonymous session ID stored in browser
- [ ] Session ID linked to user account upon registration
- [ ] Previous assessment results appear in new account
- [ ] Career matches preserved
- [ ] No data loss during account creation
- [ ] Seamless transition from anonymous to authenticated
- [ ] Works even if user closes browser before registering

**Priority**: P1 (Should Have)  
**Story Points**: 3

---

## Epic 3: Personalized Action Plans

### User Story 3.1: Generate Action Plan
**As a** student interested in a specific career  
**I want to** receive a step-by-step action plan  
**So that** I know exactly what to do to pursue that career

**Acceptance Criteria:**
- [ ] Action plan generated for each career
- [ ] 10-15 actionable steps per career
- [ ] Steps categorized: education, skills, experience, networking, research
- [ ] Steps prioritized: high, medium, low priority
- [ ] Timeframe for each step: immediate, short-term, long-term
- [ ] Resource links for each step (when applicable)
- [ ] Steps personalized based on student's grade level
- [ ] Steps consider student's location (ZIP code)
- [ ] Estimated time to career displayed
- [ ] Key milestones highlighted
- [ ] Plan generates in under 3 seconds

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### User Story 3.2: Track Action Plan Progress
**As a** student working toward a career  
**I want to** check off completed action steps  
**So that** I can track my progress and stay motivated

**Acceptance Criteria:**
- [ ] Checkbox for each action step
- [ ] Checked items visually distinguished (strikethrough, opacity)
- [ ] Progress percentage displayed (X% complete)
- [ ] Progress bar visualization
- [ ] Completed count (X of Y steps completed)
- [ ] Next uncompleted step highlighted
- [ ] Progress saved to browser (localStorage)
- [ ] Progress persists across sessions
- [ ] Filter steps by timeframe (immediate/short-term/long-term)
- [ ] Filter steps by category

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

### User Story 3.3: Access Action Plan Resources
**As a** student following an action plan  
**I want to** click on resource links  
**So that** I can access helpful information and tools

**Acceptance Criteria:**
- [ ] Each step with resources shows clickable links
- [ ] Links open in new tab
- [ ] Resource types indicated (article, video, course, website)
- [ ] Links to O*NET career profiles
- [ ] Links to CareerOneStop resources
- [ ] Links to training program finders
- [ ] Links to job search tools
- [ ] Links to scholarship information
- [ ] All links verified and working
- [ ] Resources appropriate for high school students

**Priority**: P1 (Should Have)  
**Story Points**: 3

---

### User Story 3.4: Print Action Plan
**As a** student or counselor  
**I want to** print the action plan  
**So that** I can reference it offline or share with others

**Acceptance Criteria:**
- [ ] "Print" button on action plan page
- [ ] Print-friendly layout (removes navigation, optimizes spacing)
- [ ] All steps included in print version
- [ ] Resources included with URLs
- [ ] Student name included (if logged in)
- [ ] Career title and match score included
- [ ] Date generated included
- [ ] Fits on standard letter-size paper
- [ ] Black and white printer friendly

**Priority**: P2 (Nice to Have)  
**Story Points**: 2

---

## Epic 4: AI-Powered Features

### User Story 4.1: AI Career Matching
**As a** student taking the assessment  
**I want to** receive AI-powered career recommendations  
**So that** I get accurate, personalized matches

**Acceptance Criteria:**
- [ ] Machine learning algorithm analyzes assessment responses
- [ ] Multiple factors considered: interests, skills, location, education
- [ ] Match score calculated (0-100%)
- [ ] Confidence level calculated (high/medium/low)
- [ ] Top 5 careers returned
- [ ] Reasoning factors generated for each match
- [ ] Algorithm considers local job market data
- [ ] Results consistent for same inputs
- [ ] Processing completes in under 2 seconds
- [ ] Fallback logic if AI service unavailable

**Priority**: P0 (Must Have)  
**Story Points**: 13

---

### User Story 4.2: AI Explanations
**As a** student viewing career matches  
**I want to** understand why each career was recommended  
**So that** I can trust the recommendations and make informed decisions

**Acceptance Criteria:**
- [ ] "Why this matches you" section for each career
- [ ] 3-5 specific reasoning factors listed
- [ ] Factors reference specific assessment answers
- [ ] Plain language explanations (no jargon)
- [ ] Confidence level displayed (high/medium/low)
- [ ] Confidence level explained in simple terms
- [ ] Match score breakdown available
- [ ] Factors prioritized by importance
- [ ] Explanations personalized to student
- [ ] Explanations appropriate for high school reading level

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

### User Story 4.3: AI Literacy Education
**As a** student using AI recommendations  
**I want to** learn how the AI works  
**So that** I understand the technology and its limitations

**Acceptance Criteria:**
- [ ] "How AI Works" educational section
- [ ] Explains recommendation algorithm in simple terms
- [ ] Discusses AI strengths and limitations
- [ ] Addresses potential biases
- [ ] Interactive examples showing how inputs affect outputs
- [ ] Microlearning modules (bite-sized lessons)
- [ ] Progressive disclosure (basic → advanced)
- [ ] Age-appropriate content
- [ ] Optional (doesn't block main workflow)
- [ ] Engaging, not preachy

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

### User Story 4.4: OpenAI Integration
**As a** student seeking detailed career guidance  
**I want to** receive AI-generated personalized explanations  
**So that** I get human-like, contextual career advice

**Acceptance Criteria:**
- [ ] OpenAI GPT-4 integration for natural language generation
- [ ] Personalized career explanations generated
- [ ] Explanations consider student profile and location
- [ ] Natural, conversational tone
- [ ] Accurate career information
- [ ] Appropriate for high school students
- [ ] Responses generated in under 5 seconds
- [ ] Fallback to template responses if API unavailable
- [ ] API key securely stored
- [ ] Rate limiting to control costs

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

## Epic 5: Data Integration

### User Story 5.1: O*NET Career Data
**As a** student viewing career information  
**I want to** see accurate, up-to-date career data  
**So that** I can make decisions based on reliable information

**Acceptance Criteria:**
- [ ] Integration with O*NET API
- [ ] Career titles from O*NET database
- [ ] O*NET codes displayed
- [ ] Job descriptions from O*NET
- [ ] Required skills from O*NET
- [ ] Education requirements from O*NET
- [ ] Tasks and responsibilities from O*NET
- [ ] Links to full O*NET profiles
- [ ] Data cached to reduce API calls
- [ ] Graceful handling of API failures

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### User Story 5.2: Salary Information
**As a** student considering careers  
**I want to** see realistic salary information  
**So that** I can understand earning potential

**Acceptance Criteria:**
- [ ] Average salary displayed for each career
- [ ] Salary data from Bureau of Labor Statistics
- [ ] Salary ranges (min-max) when available
- [ ] Location-based salary adjustments
- [ ] Salary displayed in clear format ($XX,XXX)
- [ ] Salary data updated regularly
- [ ] Source of salary data indicated
- [ ] Salary appropriate for entry-level positions
- [ ] Rural vs urban salary differences noted

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

### User Story 5.3: Local Job Market Data
**As a** student in a rural area  
**I want to** see job demand in my location  
**So that** I know if careers are viable where I live

**Acceptance Criteria:**
- [ ] Local demand indicator (high/medium/low)
- [ ] Based on ZIP code entered
- [ ] Data from CareerOneStop or BLS
- [ ] Considers rural vs urban differences
- [ ] Updates when ZIP code changes
- [ ] Explains what demand levels mean
- [ ] Shows nearby areas if local data unavailable
- [ ] Indicates if remote work possible
- [ ] Links to local job postings

**Priority**: P1 (Should Have)  
**Story Points**: 8

---

## Epic 6: User Experience & Accessibility

### User Story 6.1: Mobile Responsiveness
**As a** student using a smartphone  
**I want to** access all features on my phone  
**So that** I can explore careers anywhere

**Acceptance Criteria:**
- [ ] All pages work on mobile devices (320px+ width)
- [ ] Touch-friendly buttons and links (44px+ tap targets)
- [ ] Readable text without zooming (16px+ font size)
- [ ] No horizontal scrolling required
- [ ] Forms easy to fill on mobile
- [ ] Navigation accessible on small screens
- [ ] Images scale appropriately
- [ ] Fast loading on mobile networks
- [ ] Tested on iOS and Android
- [ ] Works in portrait and landscape

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### User Story 6.2: Fast Performance
**As a** student with limited internet  
**I want to** pages to load quickly  
**So that** I can use the tool without frustration

**Acceptance Criteria:**
- [ ] Homepage loads in under 3 seconds
- [ ] Assessment page loads in under 2 seconds
- [ ] Results page loads in under 3 seconds
- [ ] Action plan generates in under 3 seconds
- [ ] Images optimized for web
- [ ] Code minified and compressed
- [ ] Lazy loading for images
- [ ] Caching for static assets
- [ ] Progress indicators for slow operations
- [ ] Works on 3G connections

**Priority**: P0 (Must Have)  
**Story Points**: 5

---

### User Story 6.3: Clear Navigation
**As a** student using the platform  
**I want to** easily navigate between sections  
**So that** I don't get lost or confused

**Acceptance Criteria:**
- [ ] Consistent navigation across all pages
- [ ] Clear "Back" buttons where appropriate
- [ ] Breadcrumbs for deep pages
- [ ] Logo links to homepage
- [ ] Current page highlighted in navigation
- [ ] Logical information architecture
- [ ] Maximum 3 clicks to any feature
- [ ] Search functionality (optional)
- [ ] Help/FAQ accessible from all pages
- [ ] Logout button always visible when logged in

**Priority**: P0 (Must Have)  
**Story Points**: 3

---

### User Story 6.4: Error Handling
**As a** student encountering an error  
**I want to** see helpful error messages  
**So that** I know what went wrong and how to fix it

**Acceptance Criteria:**
- [ ] User-friendly error messages (no technical jargon)
- [ ] Specific guidance on how to resolve errors
- [ ] Form validation errors shown inline
- [ ] Network errors handled gracefully
- [ ] 404 page with navigation back to site
- [ ] 500 errors logged for debugging
- [ ] Errors don't expose sensitive information
- [ ] Contact information for support
- [ ] Errors don't crash the application
- [ ] Recovery options provided

**Priority**: P1 (Should Have)  
**Story Points**: 5

---

## Epic 7: Security & Privacy

### User Story 7.1: Secure Authentication
**As a** student creating an account  
**I want to** my password to be stored securely  
**So that** my account cannot be easily hacked

**Acceptance Criteria:**
- [ ] Passwords hashed with bcrypt (10+ salt rounds)
- [ ] Passwords never stored in plain text
- [ ] Passwords never logged or displayed
- [ ] JWT tokens for session management
- [ ] Tokens expire after 7 days
- [ ] HTTPS enforced in production
- [ ] SQL injection prevention
- [ ] XSS attack prevention
- [ ] CSRF protection
- [ ] Rate limiting on login attempts

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### User Story 7.2: Data Privacy
**As a** student using the platform  
**I want to** my personal information kept private  
**So that** I feel safe using the tool

**Acceptance Criteria:**
- [ ] Privacy policy clearly stated
- [ ] Minimal data collection (only what's needed)
- [ ] No data sold to third parties
- [ ] Data encrypted in transit (HTTPS)
- [ ] Data encrypted at rest (database)
- [ ] User can delete their account
- [ ] User can export their data
- [ ] Compliant with COPPA (under 13) if applicable
- [ ] Compliant with FERPA (educational records)
- [ ] Clear consent for data collection

**Priority**: P0 (Must Have)  
**Story Points**: 8

---

### User Story 7.3: Anonymous Usage
**As a** student concerned about privacy  
**I want to** use the tool without creating an account  
**So that** I can explore careers privately

**Acceptance Criteria:**
- [ ] Full assessment available without login
- [ ] Career matches viewable without login
- [ ] Career details viewable without login
- [ ] No personal information required for basic features
- [ ] Session data stored locally (browser)
- [ ] Session data not sent to server unless user registers
- [ ] Clear indication of what's saved vs not saved
- [ ] Option to create account later
- [ ] Anonymous sessions expire after 30 days

**Priority**: P0 (Must Have)  
**Story Points**: 3

---

## Epic 8: Content Management

### User Story 8.1: Career Database
**As a** platform administrator  
**I want to** easily add and update careers  
**So that** the platform stays current and comprehensive

**Acceptance Criteria:**
- [ ] Careers stored in JSON format
- [ ] Easy to add new careers
- [ ] Easy to update existing careers
- [ ] Required fields: title, sector, description, O*NET code
- [ ] Optional fields: salary, skills, tasks, education
- [ ] Validation prevents incomplete careers
- [ ] Changes reflected immediately
- [ ] Backup of career data
- [ ] Version control for career data
- [ ] Documentation for adding careers

**Priority**: P1 (Should Have)  
**Story Points**: 3

---

### User Story 8.2: Assessment Questions
**As a** platform administrator  
**I want to** modify assessment questions  
**So that** the quiz stays relevant and effective

**Acceptance Criteria:**
- [ ] Questions stored in JSON format
- [ ] Easy to add new questions
- [ ] Easy to update existing questions
- [ ] Required fields: question text, options, sector mapping
- [ ] Question order configurable
- [ ] Weights adjustable per option
- [ ] Changes reflected immediately
- [ ] Backup of question data
- [ ] Version control for questions
- [ ] Documentation for modifying questions

**Priority**: P1 (Should Have)  
**Story Points**: 3

---

## Non-Functional Requirements

### Performance
- [ ] Homepage loads in < 3 seconds
- [ ] API responses in < 2 seconds
- [ ] Supports 100 concurrent users
- [ ] 99% uptime
- [ ] Database queries optimized

### Scalability
- [ ] Architecture supports 10,000+ users
- [ ] Horizontal scaling possible
- [ ] Database can handle growth
- [ ] CDN for static assets
- [ ] Caching strategy implemented

### Compatibility
- [ ] Works on Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Works on iOS 12+ and Android 8+
- [ ] Works on tablets and desktops
- [ ] Graceful degradation for older browsers
- [ ] Progressive enhancement approach

### Accessibility (WCAG 2.1 Level AA)
- [ ] Keyboard navigation support
- [ ] Screen reader compatible
- [ ] Sufficient color contrast (4.5:1)
- [ ] Alt text for images
- [ ] Form labels properly associated
- [ ] Focus indicators visible
- [ ] No flashing content
- [ ] Semantic HTML

### Maintainability
- [ ] Code documented with comments
- [ ] README with setup instructions
- [ ] API documentation
- [ ] TypeScript for type safety
- [ ] Consistent code style
- [ ] Automated tests (unit, integration)
- [ ] Error logging and monitoring
- [ ] Version control (Git)

---

## Success Metrics

### User Engagement
- **Target**: 1,000+ students complete assessment in first 3 months
- **Target**: 70% completion rate for assessment
- **Target**: 65% create accounts after viewing results
- **Target**: 50% generate at least one action plan

### User Satisfaction
- **Target**: 4.5/5 average rating
- **Target**: 80% find recommendations helpful
- **Target**: 75% would recommend to a friend
- **Target**: 60% return to platform within 30 days

### Technical Performance
- **Target**: 99% uptime
- **Target**: < 3 second average page load
- **Target**: < 1% error rate
- **Target**: Zero critical security vulnerabilities

### Educational Impact
- **Target**: 80% better understand career options
- **Target**: 70% feel more confident about career decisions
- **Target**: 60% take action on at least one step
- **Target**: 50% share with peers or family

---

## Out of Scope (Future Versions)

### Version 2.0 Features
- Parent/guardian accounts
- Counselor dashboard with student analytics
- Group/classroom features
- Career comparison tool
- Saved career lists
- Email notifications
- Social sharing features
- Video content integration
- Virtual career fairs
- Mentor matching

### Version 3.0 Features
- Mobile app (iOS/Android)
- AI chatbot for career questions
- Resume builder
- Interview preparation
- Scholarship finder
- College application tracker
- Internship matching
- Peer networking
- Career success stories
- Gamification elements

---

## Assumptions

1. Students have access to internet-connected devices
2. Students can read at 9th grade level or higher
3. O*NET and BLS APIs remain available and free
4. OpenAI API costs remain within budget
5. Students have valid email addresses for registration
6. ZIP codes are sufficient for location-based features
7. Healthcare and infrastructure are priority sectors
8. Rural students are primary target audience
9. English is primary language (localization future)
10. Students are motivated to explore careers

---

## Dependencies

### External Services
- O*NET API for career data
- Bureau of Labor Statistics API for salary data
- OpenAI API for AI-generated content
- CareerOneStop for training programs
- Email service for account verification (future)

### Technical Dependencies
- Node.js 18+ runtime
- TypeScript 5+ compiler
- React 18+ framework
- Next.js 14+ framework
- Express.js for backend
- PostgreSQL or MongoDB (future)

### Team Dependencies
- 4 high school students (developers)
- 1 mentor (guidance and code review)
- Access to testing devices
- GitHub for version control
- Hosting platform (Vercel, Netlify, or similar)

---

## Risks & Mitigation

### Risk 1: API Rate Limits
**Impact**: High  
**Probability**: Medium  
**Mitigation**: Implement caching, use fallback data, monitor usage

### Risk 2: Student Skill Gaps
**Impact**: Medium  
**Probability**: High  
**Mitigation**: Provide training, pair programming, clear documentation

### Risk 3: Scope Creep
**Impact**: High  
**Probability**: Medium  
**Mitigation**: Strict prioritization, MVP focus, defer nice-to-haves

### Risk 4: Data Accuracy
**Impact**: High  
**Probability**: Low  
**Mitigation**: Use authoritative sources, regular updates, user feedback

### Risk 5: Security Vulnerabilities
**Impact**: High  
**Probability**: Medium  
**Mitigation**: Security best practices, code reviews, penetration testing

---

## Approval

**Product Owner**: [Name]  
**Date**: [Date]  
**Signature**: _______________

**Technical Lead**: [Name]  
**Date**: [Date]  
**Signature**: _______________

**Mentor**: [Name]  
**Date**: [Date]  
**Signature**: _______________

---

**Document Version**: 1.0  
**Last Updated**: November 25, 2024  
**Next Review**: December 15, 2024
