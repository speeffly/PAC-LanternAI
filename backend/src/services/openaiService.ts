import OpenAI from 'openai';
import { Career, StudentProfile } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export interface ConversationalExplanation {
  explanation: string;
  highlights: string[];
}

export interface StepByStepPlan {
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    timeframe: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  estimatedTimeToCareer: string;
}

export class OpenAIService {
  /**
   * Generate a conversational explanation for why a career matches a student
   */
  static async generateConversationalExplanation(
    profile: Partial<StudentProfile>,
    career: Career,
    matchScore: number,
    reasoningFactors: string[]
  ): Promise<ConversationalExplanation> {
    try {
      const systemPrompt = `You are a friendly and encouraging career counselor explaining WHY a specific career is being recommended to a student based on their survey responses.

Your task is to EXPLAIN THE RECOMMENDATION by connecting:
1. What the student said in their survey (their interests, skills, preferences)
2. What skills and qualities are required for this job
3. Why this makes the job a good match

Your explanations should:
- Start by explaining WHY this career is recommended based on their survey responses
- Connect their SPECIFIC interests and skills from the survey to the SPECIFIC skills required for this job
- Show how their survey answers indicate they have what it takes for this role
- Mention actual job responsibilities and explain how their skills/interests relate to those tasks
- Be conversational and warm, like explaining to a friend why this job fits them
- Avoid generic phrases - be specific about the connection between survey responses and job requirements
- Keep it concise (2-3 sentences for the main explanation)
- Include 3-4 bullet points as highlights that connect survey responses to job requirements

IMPORTANT: You're explaining WHY this job is recommended, not just describing the job. Show the connection:
- "Based on your survey showing interest in [X], this career requires [specific skill/quality] which matches..."
- "Your survey indicated you have [skill/interest], and this job needs people who can [specific task that uses that skill]..."
- "We're recommending this because your responses showed [X], and this role involves [Y] which requires exactly that..."

Format your response as JSON with:
{
  "explanation": "A 2-3 sentence explanation of WHY this career is recommended, connecting survey responses to job requirements",
  "highlights": ["highlight 1 connecting survey to job", "highlight 2 connecting survey to job", "highlight 3", "highlight 4"]
}`;

      const userPrompt = `Based on the student's survey responses, explain WHY ${career.title} is being recommended to them.

STUDENT'S SURVEY RESPONSES (what they told us about themselves):
- Interests from survey: ${profile.interests?.join(', ') || 'Not specified'}
- Skills from survey: ${profile.skills?.join(', ') || 'Not specified'}
- Education goal from survey: ${profile.educationGoal || 'Not specified'}
- Work environment preference from survey: ${profile.workEnvironment || 'Not specified'}

CAREER REQUIREMENTS (what this job needs):
- Job Title: ${career.title}
- Sector: ${career.sector}
- Description: ${career.description}
- Required Skills/Responsibilities:
${career.responsibilities.map(r => `  • ${r}`).join('\n')}
- Required Education: ${career.requiredEducation}
- Certifications Needed: ${career.certifications.join(', ')}

MATCH INFORMATION:
- Match Score: ${matchScore}% (how well their survey responses match this career)
- Why it matches: ${reasoningFactors.join('; ')}

YOUR TASK: Explain WHY this career is recommended based on their survey responses. Connect what they said in the survey to what this job requires. Show how their interests, skills, and preferences from the survey align with the skills and qualities needed for ${career.title}. Be specific about the connection - don't just say "it matches," explain HOW their survey responses relate to the job requirements.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content) as ConversationalExplanation;
      return parsed;
    } catch (error: any) {
      // Check for OpenAI API errors
      if (error?.status === 429 || error?.message?.includes('rate_limit') || error?.message?.includes('quota')) {
        console.error('OpenAI API rate limit/quota exceeded:', error.message);
        console.error('💡 TIP: Upgrade to a paid OpenAI account for higher rate limits');
      } else if (error?.status === 401 || error?.message?.includes('Invalid API key')) {
        console.error('OpenAI API authentication error - check your OPENAI_API_KEY');
      } else {
        console.error('Error generating conversational explanation:', error);
      }
      
      // Generate unique fallback based on career and profile
      const uniqueExplanation = this.generateUniqueFallbackExplanation(
        profile,
        career,
        matchScore,
        reasoningFactors
      );
      return uniqueExplanation;
    }
  }

  /**
   * Generate a unique fallback explanation when AI fails
   * Focuses on WHY this job is recommended based on survey responses
   */
  private static generateUniqueFallbackExplanation(
    profile: Partial<StudentProfile>,
    career: Career,
    matchScore: number,
    reasoningFactors: string[]
  ): ConversationalExplanation {
    const interests = profile.interests?.join(', ') || 'your interests';
    const skills = profile.skills?.join(', ') || 'your skills';
    
    // Get first 2-3 responsibilities to connect to survey responses
    const mainTasks = career.responsibilities.slice(0, 3);
    const firstTask = mainTasks[0] || 'key responsibilities';
    
    // Create explanation that connects survey responses to job requirements
    let explanation = '';
    let highlights: string[] = [];

    // Build explanation that explains WHY based on survey responses
    if (matchScore >= 80) {
      // Strong match - explain why their survey responses make this a good fit
      if (profile.interests?.some(i => i.toLowerCase().includes('help') || i.toLowerCase().includes('care'))) {
        explanation = `We're recommending ${career.title} because your survey showed you're interested in helping others, and this role requires exactly that - you'd spend your days ${mainTasks.slice(0, 2).join(' and ').toLowerCase()}. Your ${skills} from the survey are essential skills for ${firstTask.toLowerCase()}, making this a strong match.`;
      } else if (profile.interests?.some(i => i.toLowerCase().includes('build') || i.toLowerCase().includes('create'))) {
        explanation = `Based on your survey responses showing interest in ${interests}, ${career.title} is recommended because it requires hands-on work like ${mainTasks.slice(0, 2).join(' and ').toLowerCase()}. Your ${skills} from the survey directly apply to ${firstTask.toLowerCase()}, which is a core part of this job.`;
      } else if (profile.skills && profile.skills.length > 0) {
        explanation = `We're recommending ${career.title} because your survey indicated you have ${skills}, and this job requires people who can ${firstTask.toLowerCase()}. The role involves ${mainTasks.slice(0, 2).join(' and ').toLowerCase()}, which aligns with the skills you mentioned in your survey.`;
      } else {
        explanation = `Based on your survey responses showing interest in ${interests}, ${career.title} is recommended because it involves ${mainTasks.slice(0, 2).join(' and ').toLowerCase()}. Your ${skills} from the survey are valuable for this role, which requires ${firstTask.toLowerCase()}.`;
      }
    } else if (matchScore >= 60) {
      explanation = `We're suggesting ${career.title} because your survey showed interest in ${interests}, and this career involves ${firstTask.toLowerCase()}. While you may need to develop some additional skills, your ${skills} from the survey provide a good foundation for this role.`;
    } else {
      explanation = `While ${career.title} involves ${firstTask.toLowerCase()}, your survey responses suggest you may need to develop some additional skills. However, if you're interested in ${career.sector} work, this could be worth exploring further.`;
    }

    // Generate highlights that connect survey to job requirements
    if (profile.interests && profile.interests.length > 0 && career.responsibilities.length > 0) {
      highlights = [
        `Your survey interest in ${profile.interests[0]} connects to ${career.responsibilities[0]}`,
        profile.skills && profile.skills.length > 0 
          ? `Your survey skills in ${profile.skills[0]} are needed for ${career.responsibilities[1] || career.responsibilities[0]}`
          : `This role requires ${career.requiredEducation} education`,
        `Average salary: $${career.averageSalary.toLocaleString()}`,
        career.growthOutlook
      ];
    } else if (career.responsibilities.length > 0) {
      highlights = [
        `This role involves ${career.responsibilities[0]}`,
        career.responsibilities.length > 1 
          ? `You'd also ${career.responsibilities[1].toLowerCase()}`
          : `Requires ${career.requiredEducation} education`,
        `Average salary: $${career.averageSalary.toLocaleString()}`,
        career.growthOutlook
      ];
    } else {
      highlights = [
        `Career in ${career.sector} sector`,
        `Requires ${career.requiredEducation} education`,
        `Average salary: $${career.averageSalary.toLocaleString()}`,
        career.growthOutlook
      ];
    }

    return { explanation, highlights };
  }

  /**
   * Generate a step-by-step plan to achieve a career goal
   */
  static async generateStepByStepPlan(
    profile: Partial<StudentProfile>,
    career: Career,
    matchScore: number
  ): Promise<StepByStepPlan> {
    try {
      const systemPrompt = `You are a career planning expert who creates personalized, actionable step-by-step plans for students to achieve their career goals.
Your plans should be:
- Specific and actionable (not vague)
- Based on the student's current education level and situation
- Realistic and achievable
- Include timeframes for each step
- Prioritize steps (high/medium/low)
- Consider the student's location and available resources
- Include 5-7 concrete steps

Format your response as JSON with:
{
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed description of what to do",
      "timeframe": "e.g., '1-2 months', '6-12 months', '1-2 years'",
      "priority": "high" | "medium" | "low"
    }
  ],
  "estimatedTimeToCareer": "e.g., '2-4 years', '4-6 years'"
}`;

      // Determine current education level
      let currentLevel = 'High school student';
      if (profile.educationGoal) {
        const levelMap: Record<string, string> = {
          'high-school': 'High school student',
          'certificate': 'High school graduate seeking certificate',
          'associate': 'High school graduate seeking associate degree',
          'bachelor': 'High school graduate seeking bachelor degree'
        };
        currentLevel = levelMap[profile.educationGoal] || currentLevel;
      }

      const userPrompt = `Student Profile:
- Current Education Level: ${currentLevel}
- Interests: ${profile.interests?.join(', ') || 'Not specified'}
- Skills: ${profile.skills?.join(', ') || 'Not specified'}
- Location: ${profile.zipCode || 'Not specified'}

Career Goal: ${career.title}
Sector: ${career.sector}
Required Education: ${career.requiredEducation}
Certifications Needed: ${career.certifications.join(', ')}
Average Salary: $${career.averageSalary.toLocaleString()}
Growth Outlook: ${career.growthOutlook}

Responsibilities: ${career.responsibilities.join(', ')}

Create a personalized, step-by-step plan for this student to achieve their goal of becoming a ${career.title}. 
Make it specific, actionable, and tailored to their current situation.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content) as StepByStepPlan;
      return parsed;
    } catch (error: any) {
      // Check for OpenAI API errors
      if (error?.status === 429 || error?.message?.includes('rate_limit') || error?.message?.includes('quota')) {
        console.error('OpenAI API rate limit/quota exceeded:', error.message);
        console.error('💡 TIP: Upgrade to a paid OpenAI account for higher rate limits');
      } else if (error?.status === 401 || error?.message?.includes('Invalid API key')) {
        console.error('OpenAI API authentication error - check your OPENAI_API_KEY');
      } else {
        console.error('Error generating step-by-step plan:', error);
      }
      // Fallback to a basic plan
      return {
        steps: [
          {
            stepNumber: 1,
            title: 'Research the Career',
            description: `Learn more about what ${career.title} professionals do and the requirements`,
            timeframe: '1-2 weeks',
            priority: 'high' as const
          },
          {
            stepNumber: 2,
            title: 'Complete Required Education',
            description: `Pursue ${career.requiredEducation} education as required for this career`,
            timeframe: career.requiredEducation === 'certificate' ? '6-18 months' : '2-4 years',
            priority: 'high' as const
          },
          {
            stepNumber: 3,
            title: 'Obtain Certifications',
            description: `Get required certifications: ${career.certifications.join(', ')}`,
            timeframe: '3-6 months',
            priority: 'high' as const
          },
          {
            stepNumber: 4,
            title: 'Gain Experience',
            description: 'Look for internships, volunteer opportunities, or entry-level positions',
            timeframe: '6-12 months',
            priority: 'medium' as const
          },
          {
            stepNumber: 5,
            title: 'Apply for Positions',
            description: `Start applying for ${career.title} positions in your area`,
            timeframe: '1-3 months',
            priority: 'high' as const
          }
        ],
        estimatedTimeToCareer: career.requiredEducation === 'certificate' ? '1-2 years' : '2-4 years'
      };
    }
  }

  /**
   * Generate both conversational explanation and step-by-step plan in one call (more efficient)
   */
  static async generateCareerInsights(
    profile: Partial<StudentProfile>,
    career: Career,
    matchScore: number,
    reasoningFactors: string[]
  ): Promise<{
    conversationalExplanation: ConversationalExplanation;
    stepByStepPlan: StepByStepPlan;
  }> {
    // Generate both in parallel for better performance
    const [conversationalExplanation, stepByStepPlan] = await Promise.all([
      this.generateConversationalExplanation(profile, career, matchScore, reasoningFactors),
      this.generateStepByStepPlan(profile, career, matchScore)
    ]);

    return {
      conversationalExplanation,
      stepByStepPlan
    };
  }

  /**
   * Chat with AI about a career - answers questions about career paths
   */
  static async chatAboutCareer(
    message: string,
    career: Career | null,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    profile?: Partial<StudentProfile>,
    allCareers?: Career[]
  ): Promise<string> {
    try {
      const systemPrompt = `You are a friendly and knowledgeable career counselor assistant helping students explore career paths. 
Your role is to:
- Answer questions about careers, education requirements, job outlook, salaries, and career paths
- Compare and contrast different careers when asked
- Provide encouraging and supportive guidance
- Be conversational and approachable
- Give specific, actionable advice when possible
- If asked about specific careers, use the career information provided
- If the student has a profile, consider their interests, skills, and education level when answering
- Keep responses concise but informative (2-4 sentences typically, longer if needed for complex questions or comparisons)
- You can answer general career questions even without specific career context
- If you don't know something, admit it rather than making things up

Be helpful, encouraging, and focus on helping students make informed career decisions.`;

      let contextPrompt = '';
      
      // Add specific career context if available
      if (career) {
        contextPrompt = `Current Career Context (the career the student is currently viewing):
- Title: ${career.title}
- Sector: ${career.sector}
- Description: ${career.description}
- Required Education: ${career.requiredEducation}
- Certifications: ${career.certifications.join(', ')}
- Average Salary: $${career.averageSalary.toLocaleString()}
- Salary Range: $${career.salaryRange.min.toLocaleString()} - $${career.salaryRange.max.toLocaleString()}
- Growth Outlook: ${career.growthOutlook}
- Responsibilities: ${career.responsibilities.join(', ')}
- O*NET Code: ${career.onetCode || 'N/A'}

`;
      }

      // Add all available careers for comparison questions
      if (allCareers && allCareers.length > 0) {
        contextPrompt += `Available Careers (for comparison questions):
${allCareers.map(c => `- ${c.title} (${c.sector}, $${c.averageSalary.toLocaleString()}, ${c.requiredEducation}, ${c.growthOutlook})`).join('\n')}

`;
      }

      if (profile) {
        contextPrompt += `Student Profile:
- Interests: ${profile.interests?.join(', ') || 'Not specified'}
- Skills: ${profile.skills?.join(', ') || 'Not specified'}
- Education Goal: ${profile.educationGoal || 'Not specified'}
- Work Environment Preference: ${profile.workEnvironment || 'Not specified'}
- Location: ${profile.zipCode || 'Not specified'}

`;
      }

      // Build message history
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt }
      ];

      // Add context if available
      if (contextPrompt) {
        messages.push({
          role: 'user',
          content: contextPrompt + 'The student may ask questions about careers, compare different careers, or ask general career questions. Answer their questions helpfully using the information provided.'
        });
      }

      // Add conversation history (last 10 messages to keep context manageable)
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });

      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 800 // Increased for comparison questions
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return content;
    } catch (error: any) {
      // Check for OpenAI API errors
      if (error?.status === 429 || error?.message?.includes('rate_limit') || error?.message?.includes('quota')) {
        console.error('OpenAI API rate limit/quota exceeded:', error.message);
        console.error('💡 TIP: Upgrade to a paid OpenAI account for higher rate limits');
        return "I'm currently experiencing high demand. Please try again in a moment, or contact support if this persists. (Note: If you're on a free OpenAI account, you may need to upgrade to a paid plan for better rate limits.)";
      } else if (error?.status === 401 || error?.message?.includes('Invalid API key')) {
        console.error('OpenAI API authentication error - check your OPENAI_API_KEY');
        return "I'm having trouble connecting to my service. Please check your API configuration.";
      } else {
        console.error('Error in career chat:', error);
      }
      
      // More helpful fallback response
      if (message.toLowerCase().includes('difference') || message.toLowerCase().includes('compare')) {
        return "I can help you compare careers! Could you tell me which specific careers you'd like to compare? For example, you could ask 'What's the difference between Registered Nurse and Medical Assistant?' or 'Compare Electrician and Plumber.'";
      }
      return "I'm here to help with career questions! You can ask me about education requirements, salaries, job outlook, daily tasks, or compare different careers. What would you like to know?";
    }
  }
}

