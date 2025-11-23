import express from 'express';
import { SessionService } from '../services/sessionService';
import { ApiResponse } from '../types';

const router = express.Router();

router.post('/start', (req, res) => {
  try {
    const session = SessionService.createSession();
    res.json({
      success: true,
      data: { sessionId: session.sessionId, expiresAt: session.expiresAt },
      message: 'Session created'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create session' } as ApiResponse);
  }
});

router.get('/:id', (req, res) => {
  try {
    const session = SessionService.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' } as ApiResponse);
    }
    res.json({ success: true, data: session } as ApiResponse);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get session' } as ApiResponse);
  }
});

export default router;
