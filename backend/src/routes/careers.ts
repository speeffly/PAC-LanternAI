import express from 'express';
import { CareerService } from '../services/careerService';
import { SessionService } from '../services/sessionService';
import { ApiResponse } from '../types';

const router = express.Router();

// GET /api/careers - Get all careers
router.get('/', (req, res) => {
  try {
    const careers = CareerService.getAllCareers();
    res.json({
      success: true,
      data: careers,
      message: `Retrieved ${careers.length} careers`
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve careers'
    } as ApiResponse);
  }
});

// GET /api/careers/:id - Get career by ID
router.get('/:id', (req, res) => {
  try {
    const career = CareerService.getCareerById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: career,
      message: 'Career retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve career'
    } as ApiResponse);
  }
});

// POST /api/careers/matches - Get career matches for a profile
router.post('/matches', async (req, res) => {
  try {
    const { sessionId, zipCode } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      } as ApiResponse);
    }

    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({
        success: false,
        error: 'Valid 5-digit ZIP code is required'
      } as ApiResponse);
    }

    // Get session with profile
    const session = SessionService.getSession(sessionId);
    if (!session || !session.profileData) {
      return res.status(404).json({
        success: false,
        error: 'Session or profile not found. Please complete the assessment first.'
      } as ApiResponse);
    }

    // Get career matches
    const matches = CareerService.getCareerMatches(session.profileData, zipCode);

    // Enrich top matches with AI-generated conversational explanations and step-by-step plans
    const enrichedMatches = await CareerService.enrichMatchesWithAI(
      matches,
      session.profileData,
      5 // Enrich top 5 matches
    );

    res.json({
      success: true,
      data: {
        matches: enrichedMatches,
        profile: session.profileData,
        totalMatches: enrichedMatches.length
      },
      message: `Found ${enrichedMatches.length} career matches`
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting career matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get career matches'
    } as ApiResponse);
  }
});

// GET /api/careers/:id/pathway - Get career pathway
router.get('/:id/pathway', (req, res) => {
  try {
    const career = CareerService.getCareerById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      } as ApiResponse);
    }

    // Generate a simple pathway (in production, this would be more detailed)
    const pathway = {
      careerId: career.id,
      stages: [
        {
          order: 1,
          title: 'High School Preparation',
          description: 'Take relevant courses and explore the field',
          duration: '1-4 years',
          requirements: ['Complete high school', 'Take science/math courses', 'Volunteer or shadow professionals'],
          providers: ['Your local high school'],
          cost: 0
        },
        {
          order: 2,
          title: 'Training & Education',
          description: `Complete ${career.requiredEducation} program`,
          duration: career.requiredEducation === 'certificate' ? '6-18 months' : '2-4 years',
          requirements: career.certifications,
          providers: ['Community colleges', 'Vocational schools', 'Apprenticeship programs'],
          cost: career.requiredEducation === 'certificate' ? 5000 : 15000
        },
        {
          order: 3,
          title: 'Entry-Level Position',
          description: `Start working as ${career.title}`,
          duration: '1-3 years',
          requirements: ['Complete training', 'Obtain certifications', 'Pass background checks'],
          providers: ['Local employers'],
          cost: 0
        },
        {
          order: 4,
          title: 'Career Growth',
          description: 'Advance to senior positions or specializations',
          duration: 'Ongoing',
          requirements: ['Continuing education', 'Additional certifications', 'Experience'],
          providers: ['Professional organizations', 'Employers'],
          cost: 2000
        }
      ],
      totalDuration: career.requiredEducation === 'certificate' ? '2-6 years' : '4-8 years',
      estimatedCost: career.requiredEducation === 'certificate' ? 5000 : 17000
    };

    res.json({
      success: true,
      data: pathway,
      message: 'Career pathway retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting career pathway:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get career pathway'
    } as ApiResponse);
  }
});

export default router;
