import express from 'express';
import { ActionPlanService } from '../services/actionPlanService';
import { CareerService } from '../services/careerService';
import { SessionService } from '../services/sessionService';
import { OpenAIService } from '../services/openaiService';
import { ApiResponse } from '../types';

const router = express.Router();

// GET /api/action-plans/:careerId - Get action plan for a specific career
router.get('/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;
    const { grade, zipCode, sessionId, useAI } = req.query;

    // Get career details
    const career = CareerService.getCareerById(careerId);
    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      } as ApiResponse);
    }

    // Try to get user profile from session if available
    let profile = null;
    if (sessionId) {
      const session = SessionService.getSession(sessionId as string);
      if (session?.profileData) {
        profile = session.profileData;
      }
    }

    // Use AI-generated plan if requested and OpenAI is available
    const useAIGenerated = useAI === 'true' && process.env.OPENAI_API_KEY;
    
    if (useAIGenerated && profile) {
      try {
        // Create a mock CareerMatch for AI generation
        const mockMatch = {
          careerId: career.id,
          career,
          matchScore: 85,
          reasoningFactors: ['Strong interest alignment', 'Skills match requirements'],
          localDemand: 'high' as const,
          localSalary: {
            min: career.salaryRange.min,
            max: career.salaryRange.max,
            location: (zipCode as string) || 'unknown'
          },
          localEmployers: []
        };

        const aiPlan = await OpenAIService.generateStepByStepPlan(
          profile,
          career,
          mockMatch.matchScore
        );

        // Convert AI plan to ActionPlan format
        const actionPlan = {
          careerTitle: career.title,
          careerCode: career.onetCode || career.id,
          steps: aiPlan.steps.map((step, index) => ({
            id: `ai-step-${index + 1}`,
            title: step.title,
            description: step.description,
            category: mapTimeframeToCategory(step.timeframe),
            timeframe: mapTimeframeToActionPlanTimeframe(step.timeframe),
            priority: step.priority,
            completed: false,
            resources: []
          })),
          milestones: [],
          estimatedTimeToCareer: aiPlan.estimatedTimeToCareer
        };

        return res.json({
          success: true,
          data: actionPlan,
          source: 'ai'
        } as ApiResponse);
      } catch (aiError) {
        console.error('AI plan generation failed, falling back to rule-based:', aiError);
        // Fall through to rule-based plan
      }
    }

    // Generate rule-based action plan (fallback or default)
    // Create a mock CareerMatch for the existing service
    const mockMatch = {
      careerId: career.id,
      career,
      matchScore: 85,
      reasoningFactors: [],
      localDemand: 'high' as const,
      localSalary: {
        min: career.salaryRange.min,
        max: career.salaryRange.max,
        location: (zipCode as string) || 'unknown'
      },
      localEmployers: []
    };

    const actionPlan = ActionPlanService.generateActionPlan(
      mockMatch as any,
      grade ? parseInt(grade as string) : undefined,
      zipCode as string
    );

    res.json({
      success: true,
      data: actionPlan,
      source: 'rule-based'
    } as ApiResponse);
  } catch (error) {
    console.error('Error generating action plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate action plan'
    } as ApiResponse);
  }
});

// Helper function to map timeframe to category
function mapTimeframeToCategory(timeframe: string): 'education' | 'skills' | 'experience' | 'networking' | 'research' {
  if (timeframe.includes('month') || timeframe.includes('week')) {
    return 'research';
  }
  if (timeframe.includes('year') && parseInt(timeframe) >= 2) {
    return 'education';
  }
  return 'skills';
}

// Helper function to map timeframe string to ActionPlan timeframe
function mapTimeframeToActionPlanTimeframe(timeframe: string): 'immediate' | 'short-term' | 'long-term' {
  const lower = timeframe.toLowerCase();
  if (lower.includes('week') || lower.includes('month') && parseInt(timeframe) <= 2) {
    return 'immediate';
  }
  if (lower.includes('month') && parseInt(timeframe) <= 12) {
    return 'short-term';
  }
  return 'long-term';
}

// POST /api/action-plans/multiple - Get action plans for multiple careers
router.post('/multiple', async (req, res) => {
  try {
    const { careerIds, grade, zipCode, sessionId, useAI } = req.body;

    if (!careerIds || !Array.isArray(careerIds)) {
      return res.status(400).json({
        success: false,
        error: 'Career IDs array is required'
      } as ApiResponse);
    }

    // Get career details for all IDs
    const careers = careerIds
      .map(id => CareerService.getCareerById(id))
      .filter(c => c !== null);

    if (careers.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No valid careers found'
      } as ApiResponse);
    }

    // Get user profile if available
    let profile = null;
    if (sessionId) {
      const session = SessionService.getSession(sessionId);
      if (session?.profileData) {
        profile = session.profileData;
      }
    }

    // Generate action plans
    const useAIGenerated = useAI === true && process.env.OPENAI_API_KEY && profile;
    const actionPlans = [];

    for (const career of careers) {
      if (useAIGenerated) {
        try {
          const mockMatch = {
            careerId: career!.id,
            career: career!,
            matchScore: 85,
            reasoningFactors: [],
            localDemand: 'high' as const,
            localSalary: {
              min: career!.salaryRange.min,
              max: career!.salaryRange.max,
              location: zipCode || 'unknown'
            },
            localEmployers: []
          };

          const aiPlan = await OpenAIService.generateStepByStepPlan(
            profile!,
            career!,
            mockMatch.matchScore
          );

          actionPlans.push({
            careerTitle: career!.title,
            careerCode: career!.onetCode || career!.id,
            steps: aiPlan.steps.map((step, index) => ({
              id: `ai-step-${index + 1}`,
              title: step.title,
              description: step.description,
              category: mapTimeframeToCategory(step.timeframe),
              timeframe: mapTimeframeToActionPlanTimeframe(step.timeframe),
              priority: step.priority,
              completed: false,
              resources: []
            })),
            milestones: [],
            estimatedTimeToCareer: aiPlan.estimatedTimeToCareer
          });
        } catch (aiError) {
          console.error(`AI plan generation failed for ${career!.id}, using rule-based:`, aiError);
          // Fall back to rule-based
          const mockMatch = {
            careerId: career!.id,
            career: career!,
            matchScore: 85,
            reasoningFactors: [],
            localDemand: 'high' as const,
            localSalary: {
              min: career!.salaryRange.min,
              max: career!.salaryRange.max,
              location: zipCode || 'unknown'
            },
            localEmployers: []
          };
          actionPlans.push(ActionPlanService.generateActionPlan(
            mockMatch as any,
            grade,
            zipCode
          ));
        }
      } else {
        // Use rule-based plan
        const mockMatch = {
          careerId: career!.id,
          career: career!,
          matchScore: 85,
          reasoningFactors: [],
          localDemand: 'high' as const,
          localSalary: {
            min: career!.salaryRange.min,
            max: career!.salaryRange.max,
            location: zipCode || 'unknown'
          },
          localEmployers: []
        };
        actionPlans.push(ActionPlanService.generateActionPlan(
          mockMatch as any,
          grade,
          zipCode
        ));
      }
    }

    res.json({
      success: true,
      data: actionPlans
    } as ApiResponse);
  } catch (error) {
    console.error('Error generating action plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate action plans'
    } as ApiResponse);
  }
});

export default router;
