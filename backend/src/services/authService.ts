import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User, Student, Counselor } from '../types';

// In-memory user storage (use database in production)
const users = new Map<string, User>();
const students = new Map<string, Student>();
const counselors = new Map<string, Counselor>();

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'lantern-ai-secret-key';
  private static readonly SALT_ROUNDS = 10;

  /**
   * Register a new student
   */
  static async registerStudent(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    grade?: number;
    zipCode?: string;
    schoolId?: string;
  }): Promise<{ success: boolean; user?: Student; token?: string; error?: string }> {
    try {
      // Check if email already exists
      const existingUser = Array.from(users.values()).find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

      // Create user
      const userId = randomUUID();
      const user: User = {
        id: userId,
        email: data.email,
        role: 'student',
        schoolId: data.schoolId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create student profile
      const student: Student = {
        ...user,
        role: 'student',
        firstName: data.firstName,
        lastName: data.lastName,
        grade: data.grade,
        zipCode: data.zipCode,
        profileCompleted: false,
        consentGiven: true
      };

      // Store user and student
      users.set(userId, user);
      students.set(userId, student);

      // Store password separately (in production, use proper user table)
      (user as any).passwordHash = passwordHash;

      // Generate JWT token
      const token = jwt.sign(
        { userId, email: data.email, role: 'student' },
        this.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { success: true, user: student, token };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: Student | Counselor;
    token?: string;
    error?: string;
  }> {
    try {
      // Find user by email
      const user = Array.from(users.values()).find(u => u.email === email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Check password
      const passwordHash = (user as any).passwordHash;
      if (!passwordHash) {
        return { success: false, error: 'Invalid account' };
      }

      const isValidPassword = await bcrypt.compare(password, passwordHash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Get user profile based on role
      let userProfile: Student | Counselor;
      if (user.role === 'student') {
        userProfile = students.get(user.id)!;
      } else if (user.role === 'counselor') {
        userProfile = counselors.get(user.id)!;
      } else {
        return { success: false, error: 'Invalid user role' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        this.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { success: true, user: userProfile, token };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): {
    success: boolean;
    userId?: string;
    email?: string;
    role?: string;
    error?: string;
  } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return {
        success: true,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      return { success: false, error: 'Invalid token' };
    }
  }

  /**
   * Get user by ID
   */
  static getUserById(userId: string): Student | Counselor | null {
    const user = users.get(userId);
    if (!user) return null;

    if (user.role === 'student') {
      return students.get(userId) || null;
    } else if (user.role === 'counselor') {
      return counselors.get(userId) || null;
    }

    return null;
  }

  /**
   * Update student profile
   */
  static updateStudentProfile(userId: string, updates: Partial<Student>): boolean {
    const student = students.get(userId);
    if (!student) return false;

    const updatedStudent = {
      ...student,
      ...updates,
      updatedAt: new Date()
    };

    students.set(userId, updatedStudent);
    return true;
  }

  /**
   * Link session data to user account
   */
  static linkSessionToUser(userId: string, sessionId: string): boolean {
    // This would link existing session data to the user account
    // For now, we'll just mark the profile as completed if they have session data
    const student = students.get(userId);
    if (student) {
      student.profileCompleted = true;
      students.set(userId, student);
      return true;
    }
    return false;
  }

  /**
   * Get all students (for counselor dashboard)
   */
  static getAllStudents(): Student[] {
    return Array.from(students.values());
  }

  /**
   * Register counselor (admin function)
   */
  static async registerCounselor(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    schoolId: string;
  }): Promise<{ success: boolean; user?: Counselor; error?: string }> {
    try {
      // Check if email already exists
      const existingUser = Array.from(users.values()).find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

      // Create user
      const userId = randomUUID();
      const user: User = {
        id: userId,
        email: data.email,
        role: 'counselor',
        schoolId: data.schoolId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create counselor profile
      const counselor: Counselor = {
        ...user,
        role: 'counselor',
        firstName: data.firstName,
        lastName: data.lastName,
        schoolId: data.schoolId
      };

      // Store user and counselor
      users.set(userId, user);
      counselors.set(userId, counselor);
      (user as any).passwordHash = passwordHash;

      return { success: true, user: counselor };
    } catch (error) {
      console.error('Counselor registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }
}
