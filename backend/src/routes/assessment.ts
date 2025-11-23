import express from 'express';
import { SessionService } from '../services/sessionService';
import { AssessmentService } from '../services/assessmentService';
import { ApiResponse } from '../types';

const router = express.Router();

// GET /api/assessment/questions
router.get('/questions', (req, res) => {
  try {
    const questions = AssessmentService.getQuestions();
    res.json({
      success: true,
      data: questions,
      message: `Retrieved ${questions.length} questions`
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve questions'
    } as ApiResponse);
  }
});

// POST /api/assessment/answers
router.post('/answers', (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    if (!sessionId || !answers) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and answers are required'
      } as ApiResponse);
    }

    // Validate answers
    const validation = AssessmentService.validateAnswers(answers);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid answers',
        message: validation.errors.join(', ')
      } as ApiResponse);
    }

    // Save answers to session
    const updated = SessionService.updateSessionAnswers(sessionId, answers);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Answers saved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error saving answers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save answers'
    } as ApiResponse);
  }
});

// POST /api/assessment/complete
router.post('/complete', (req, res) => {
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

    // Get session
    const session = SessionService.getSession(sessionId);
    if (!session || !session.assessmentAnswers) {
      return res.status(404).json({
        success: false,
        error: 'Session or answers not found'
      } as ApiResponse);
    }

    // Generate profile from answers
    const profile = AssessmentService.generateProfile(session.assessmentAnswers, zipCode);

    // Update session with profile
    SessionService.updateSessionProfile(sessionId, profile);

    res.json({
      success: true,
      data: profile,
      message: 'Profile generated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error completing assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate profile'
    } as ApiResponse);
  }
});

export default router;
