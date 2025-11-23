import { CareerMatch } from '../types';

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'skills' | 'experience' | 'networking' | 'research';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'website';
  }[];
}

export interface ActionPlan {
  careerTitle: string;
  careerCode: string;
  steps: ActionStep[];
  milestones: {
    title: string;
    description: string;
    targetDate?: string;
  }[];
  estimatedTimeToCareer: string;
}

export class ActionPlanService {
  /**
   * Generate personalized action plan for a career match
   */
  static generateActionPlan(
    career: CareerMatch,
    userGrade?: number,
    userZipCode?: string
  ): ActionPlan {
    const steps: ActionStep[] = [];
    const milestones: { title: string; description: string; targetDate?: string }[] = [];

    // Determine user's current stage
    const isHighSchool = userGrade && userGrade >= 9 && userGrade <= 12;
    const isPostSecondary = userGrade && userGrade > 12;

    // Research Phase (Immediate)
    steps.push({
      id: 'research-1',
      title: 'Explore Career Details',
      description: `Learn more about what ${career.title} professionals do on a daily basis`,
      category: 'research',
      timeframe: 'immediate',
      priority: 'high',
      completed: false,
      resources: [
        {
          title: 'O*NET Career Profile',
          url: `https://www.onetonline.org/link/summary/${career.onetCode}`,
          type: 'website'
        },
        {
          title: 'Career Videos',
          url: `https://www.careeronestop.org/Videos/CareerVideos/career-videos.aspx`,
          type: 'video'
        }
      ]
    });

    steps.push({
      id: 'research-2',
      title: 'Research Local Opportunities',
      description: userZipCode 
        ? `Find ${career.title} jobs and training programs near ${userZipCode}`
        : `Find ${career.title} jobs and training programs in your area`,
      category: 'research',
      timeframe: 'immediate',
      priority: 'high',
      completed: false,
      resources: [
        {
          title: 'CareerOneStop Job Finder',
          url: 'https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx',
          type: 'website'
        }
      ]
    });

    // Education Planning
    if (career.educationLevel === 'High school diploma or equivalent') {
      steps.push({
        id: 'education-1',
        title: 'Complete High School',
        description: 'Focus on relevant coursework in science, math, and health',
        category: 'education',
        timeframe: isHighSchool ? 'short-term' : 'immediate',
        priority: 'high',
        completed: false
      });

      milestones.push({
        title: 'High School Graduation',
        description: 'Earn your high school diploma with strong grades in core subjects'
      });
    } else if (career.educationLevel.includes('Associate')) {
      steps.push({
        id: 'education-1',
        title: 'Research Community Colleges',
        description: 'Find accredited programs for your career path',
        category: 'education',
        timeframe: 'immediate',
        priority: 'high',
        completed: false,
        resources: [
          {
            title: 'Community College Finder',
            url: 'https://www.careeronestop.org/Toolkit/Training/find-community-colleges.aspx',
            type: 'website'
          }
        ]
      });

      milestones.push({
        title: 'Associate Degree',
        description: 'Complete 2-year degree program (typically 60 credits)'
      });
    } else if (career.educationLevel.includes('Bachelor')) {
      steps.push({
        id: 'education-1',
        title: 'Research 4-Year Colleges',
        description: 'Identify universities with strong programs in your field',
        category: 'education',
        timeframe: 'immediate',
        priority: 'high',
        completed: false,
        resources: [
          {
            title: 'College Navigator',
            url: 'https://nces.ed.gov/collegenavigator/',
            type: 'website'
          }
        ]
      });

      milestones.push({
        title: "Bachelor's Degree",
        description: 'Complete 4-year degree program in relevant field'
      });
    }

    // Skills Development
    const topSkills = career.skills?.slice(0, 3) || [];
    topSkills.forEach((skill, index) => {
      steps.push({
        id: `skills-${index + 1}`,
        title: `Develop ${skill} Skills`,
        description: `Take courses or practice activities to build ${skill.toLowerCase()} abilities`,
        category: 'skills',
        timeframe: 'short-term',
        priority: index === 0 ? 'high' : 'medium',
        completed: false,
        resources: [
          {
            title: 'Free Online Courses',
            url: 'https://www.coursera.org',
            type: 'course'
          }
        ]
      });
    });

    // Experience Building
    steps.push({
      id: 'experience-1',
      title: 'Gain Hands-On Experience',
      description: 'Look for internships, volunteer opportunities, or part-time work',
      category: 'experience',
      timeframe: 'short-term',
      priority: 'high',
      completed: false,
      resources: [
        {
          title: 'Internship Finder',
          url: 'https://www.internships.com',
          type: 'website'
        }
      ]
    });

    steps.push({
      id: 'experience-2',
      title: 'Job Shadow a Professional',
      description: `Spend a day observing a ${career.title} at work`,
      category: 'experience',
      timeframe: 'short-term',
      priority: 'medium',
      completed: false
    });

    // Networking
    steps.push({
      id: 'networking-1',
      title: 'Connect with Professionals',
      description: 'Join professional associations and attend industry events',
      category: 'networking',
      timeframe: 'long-term',
      priority: 'medium',
      completed: false,
      resources: [
        {
          title: 'LinkedIn',
          url: 'https://www.linkedin.com',
          type: 'website'
        }
      ]
    });

    steps.push({
      id: 'networking-2',
      title: 'Find a Mentor',
      description: `Connect with an experienced ${career.title} who can guide your career journey`,
      category: 'networking',
      timeframe: 'long-term',
      priority: 'medium',
      completed: false
    });

    // Certification/Licensing (if applicable)
    if (career.title.toLowerCase().includes('nurse') || 
        career.title.toLowerCase().includes('therapist') ||
        career.title.toLowerCase().includes('technician')) {
      steps.push({
        id: 'education-2',
        title: 'Research Certification Requirements',
        description: 'Understand licensing and certification needed in your state',
        category: 'education',
        timeframe: 'short-term',
        priority: 'high',
        completed: false,
        resources: [
          {
            title: 'State Licensing Boards',
            url: 'https://www.careeronestop.org/Toolkit/Training/find-licenses.aspx',
            type: 'website'
          }
        ]
      });

      milestones.push({
        title: 'Professional Certification',
        description: 'Obtain required licenses and certifications for your field'
      });
    }

    // Calculate estimated time to career
    let estimatedYears = 0;
    if (career.educationLevel.includes('High school')) {
      estimatedYears = isHighSchool ? (12 - (userGrade || 9)) : 0;
    } else if (career.educationLevel.includes('Associate')) {
      estimatedYears = isHighSchool ? (12 - (userGrade || 9)) + 2 : 2;
    } else if (career.educationLevel.includes('Bachelor')) {
      estimatedYears = isHighSchool ? (12 - (userGrade || 9)) + 4 : 4;
    }

    const estimatedTimeToCareer = estimatedYears <= 1 
      ? '1-2 years' 
      : estimatedYears <= 3 
        ? '2-4 years' 
        : estimatedYears <= 5 
          ? '4-6 years' 
          : '6+ years';

    return {
      careerTitle: career.title,
      careerCode: career.onetCode,
      steps: steps.sort((a, b) => {
        const timeframeOrder = { immediate: 0, 'short-term': 1, 'long-term': 2 };
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        
        if (timeframeOrder[a.timeframe] !== timeframeOrder[b.timeframe]) {
          return timeframeOrder[a.timeframe] - timeframeOrder[b.timeframe];
        }
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      milestones,
      estimatedTimeToCareer
    };
  }

  /**
   * Get action plans for multiple careers
   */
  static generateMultipleActionPlans(
    careers: CareerMatch[],
    userGrade?: number,
    userZipCode?: string
  ): ActionPlan[] {
    return careers.map(career => 
      this.generateActionPlan(career, userGrade, userZipCode)
    );
  }

  /**
   * Update step completion status
   */
  static updateStepCompletion(
    actionPlan: ActionPlan,
    stepId: string,
    completed: boolean
  ): ActionPlan {
    return {
      ...actionPlan,
      steps: actionPlan.steps.map(step =>
        step.id === stepId ? { ...step, completed } : step
      )
    };
  }

  /**
   * Get progress statistics
   */
  static getProgress(actionPlan: ActionPlan): {
    totalSteps: number;
    completedSteps: number;
    percentComplete: number;
    nextStep?: ActionStep;
  } {
    const totalSteps = actionPlan.steps.length;
    const completedSteps = actionPlan.steps.filter(s => s.completed).length;
    const percentComplete = Math.round((completedSteps / totalSteps) * 100);
    const nextStep = actionPlan.steps.find(s => !s.completed);

    return {
      totalSteps,
      completedSteps,
      percentComplete,
      nextStep
    };
  }
}
