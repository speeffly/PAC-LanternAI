import express from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../types';

const router = express.Router();

// POST /api/auth/register - Student registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, grade, zipCode, schoolId } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      } as ApiResponse);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      } as ApiResponse);
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      } as ApiResponse);
    }

    const result = await AuthService.registerStudent({
      email,
      password,
      firstName,
      lastName,
      grade,
      zipCode,
      schoolId
    });

    if (result.success) {
      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        },
        message: 'Account created successfully'
      } as ApiResponse);
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      } as ApiResponse);
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    } as ApiResponse);
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse);
    }

    const result = await AuthService.login(email, password);

    if (result.success) {
      res.json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        },
        message: 'Login successful'
      } as ApiResponse);
    } else {
      res.status(401).json({
        success: false,
        error: result.error
      } as ApiResponse);
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    } as ApiResponse);
  }
});

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      } as ApiResponse);
    }

    const token = authHeader.substring(7);
    const tokenResult = AuthService.verifyToken(token);

    if (!tokenResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      } as ApiResponse);
    }

    const user = AuthService.getUserById(tokenResult.userId!);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    } as ApiResponse);
  }
});

// POST /api/auth/link-session - Link anonymous session to user account
router.post('/link-session', (req, res) => {
  try {
    const { sessionId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      } as ApiResponse);
    }

    const token = authHeader.substring(7);
    const tokenResult = AuthService.verifyToken(token);

    if (!tokenResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      } as ApiResponse);
    }

    const linked = AuthService.linkSessionToUser(tokenResult.userId!, sessionId);
    
    if (linked) {
      res.json({
        success: true,
        message: 'Session linked to account successfully'
      } as ApiResponse);
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to link session'
      } as ApiResponse);
    }
  } catch (error) {
    console.error('Link session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to link session'
    } as ApiResponse);
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      } as ApiResponse);
    }

    const token = authHeader.substring(7);
    const tokenResult = AuthService.verifyToken(token);

    if (!tokenResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      } as ApiResponse);
    }

    const updates = req.body;
    const updated = AuthService.updateStudentProfile(tokenResult.userId!, updates);

    if (updated) {
      const user = AuthService.getUserById(tokenResult.userId!);
      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      } as ApiResponse);
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to update profile'
      } as ApiResponse);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    } as ApiResponse);
  }
});

export default router;
