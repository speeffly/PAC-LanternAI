import { randomUUID } from 'crypto';
import { SessionData, AssessmentAnswer, StudentProfile } from '../types';

// In-memory session storage (use Redis in production)
const sessions = new Map<string, SessionData>();

// Clean up expired sessions every hour
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId);
    }
  }
}, 3600000);

export class SessionService {
  /**
   * Create a new anonymous session
   */
  static createSession(): SessionData {
    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session: SessionData = {
      sessionId,
      createdAt: now,
      expiresAt,
    };

    sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get session by ID
   */
  static getSession(sessionId: string): SessionData | null {
    const session = sessions.get(sessionId);
    if (!session) return null;

    // Check if expired
    if (session.expiresAt < new Date()) {
      sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Update session with assessment answers
   */
  static updateSessionAnswers(
    sessionId: string,
    answers: AssessmentAnswer[]
  ): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    session.assessmentAnswers = answers;
    sessions.set(sessionId, session);
    return true;
  }

  /**
   * Update session with profile data
   */
  static updateSessionProfile(
    sessionId: string,
    profileData: Partial<StudentProfile>
  ): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    session.profileData = profileData;
    sessions.set(sessionId, session);
    return true;
  }

  /**
   * Delete session
   */
  static deleteSession(sessionId: string): boolean {
    return sessions.delete(sessionId);
  }

  /**
   * Get all active sessions (for debugging)
   */
  static getActiveSessions(): number {
    return sessions.size;
  }
}
