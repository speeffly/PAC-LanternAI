import express from 'express';
import { OpenAIService } from '../services/openaiService';
import { CareerService } from '../services/careerService';
import { SessionService } from '../services/sessionService';
import { ApiResponse } from '../types';

const router = express.Router();

// POST /api/chat - Chat with AI about careers
router.post('/', async (req, res) => {
  try {
    const { message, careerId, sessionId, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      } as ApiResponse);
    }

    // Get career context if careerId is provided
    let career = null;
    if (careerId) {
      career = CareerService.getCareerById(careerId);
    }

    // Get user profile from session if available
    let profile = null;
    if (sessionId) {
      const session = SessionService.getSession(sessionId);
      if (session?.profileData) {
        profile = session.profileData;
      }
    }

    // Get all careers for comparison questions
    const allCareers = CareerService.getAllCareers();

    // Validate conversation history format
    const validHistory = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (msg: any) =>
            msg &&
            typeof msg === 'object' &&
            (msg.role === 'user' || msg.role === 'assistant') &&
            typeof msg.content === 'string'
        )
      : [];

    // Generate AI response with all careers available for comparisons
    const response = await OpenAIService.chatAboutCareer(
      message,
      career,
      validHistory,
      profile || undefined,
      allCareers
    );

    res.json({
      success: true,
      data: {
        response,
        careerContext: career
          ? {
              title: career.title,
              id: career.id
            }
          : null
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    } as ApiResponse);
  }
});

export default router;

