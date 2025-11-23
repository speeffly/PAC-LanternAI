import { AssessmentAnswer, StudentProfile } from '../types';
import questions from '../data/questions.json';

export class AssessmentService {
  /**
   * Get all assessment questions
   */
  static getQuestions() {
    return questions;
  }

  /**
   * Generate student profile from assessment answers
   */
  static generateProfile(answers: AssessmentAnswer[], zipCode: string): Partial<StudentProfile> {
    const interests: string[] = [];
    const skills: string[] = [];
    let workEnvironment: 'indoor' | 'outdoor' | 'mixed' = 'mixed';
    let teamPreference: 'team' | 'solo' | 'both' = 'both';
    let educationGoal: 'high-school' | 'certificate' | 'associate' | 'bachelor' = 'certificate';

    // Process each answer
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      const answerValue = answer.answer;

      // Extract interests
      if (question.category === 'interests') {
        if (typeof answerValue === 'string' && (answerValue.includes('Agree') || answerValue === 'Strongly Agree')) {
          if (question.text.includes('helping people')) {
            interests.push('Helping Others');
          }
          if (question.text.includes('hands') || question.text.includes('building')) {
            interests.push('Hands-on Work');
          }
          if (question.text.includes('body') || question.text.includes('health')) {
            interests.push('Healthcare');
          }
          if (question.text.includes('buildings') || question.text.includes('infrastructure') || question.text.includes('constructed')) {
            interests.push('Infrastructure');
          }
          if (question.text.includes('community') || question.text.includes('difference')) {
            interests.push('Community Impact');
          }
        }
      }

      // Extract skills
      if (question.category === 'skills') {
        if (typeof answerValue === 'string' && (answerValue.includes('Agree') || answerValue === 'Strongly Agree')) {
          if (question.text.includes('technology') || question.text.includes('software')) {
            skills.push('Technology');
          }
          if (question.text.includes('details') || question.text.includes('attention')) {
            skills.push('Attention to Detail');
          }
          if (question.text.includes('talking') || question.text.includes('communication')) {
            skills.push('Communication');
          }
        }
      }

      // Determine preferences
      if (question.category === 'preferences') {
        if (question.id === 'q4') {
          // Work environment question
          if (typeof answerValue === 'string') {
            if (answerValue.includes('indoors')) workEnvironment = 'indoor';
            else if (answerValue.includes('outdoors')) workEnvironment = 'outdoor';
            else workEnvironment = 'mixed';
          }
        }
        if (question.id === 'q5') {
          // Team preference question
          if (typeof answerValue === 'string') {
            if (answerValue.includes('team')) teamPreference = 'team';
            else if (answerValue.includes('independently')) teamPreference = 'solo';
            else teamPreference = 'both';
          }
        }
      }

      // Determine education goal
      if (question.category === 'education' && question.id === 'q9') {
        if (typeof answerValue === 'string') {
          if (answerValue.includes('right away')) educationGoal = 'high-school';
          else if (answerValue.includes('certificate') || answerValue.includes('short training')) educationGoal = 'certificate';
          else if (answerValue.includes('community college')) educationGoal = 'associate';
          else if (answerValue.includes('4-year')) educationGoal = 'bachelor';
        }
      }
    });

    // Remove duplicates and ensure we have at least some interests/skills
    const uniqueInterests = [...new Set(interests)];
    const uniqueSkills = [...new Set(skills)];

    // Add default interests if none detected
    if (uniqueInterests.length === 0) {
      uniqueInterests.push('Exploring Options');
    }

    // Add default skills if none detected
    if (uniqueSkills.length === 0) {
      uniqueSkills.push('Willingness to Learn');
    }

    return {
      interests: uniqueInterests,
      skills: uniqueSkills,
      workEnvironment,
      teamPreference,
      educationGoal,
      zipCode,
      completedAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Validate assessment answers
   */
  static validateAnswers(answers: AssessmentAnswer[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!answers || answers.length === 0) {
      errors.push('No answers provided');
      return { valid: false, errors };
    }

    if (answers.length < questions.length) {
      errors.push(`Incomplete assessment: ${answers.length}/${questions.length} questions answered`);
    }

    // Validate each answer
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        errors.push(`Invalid question ID: ${answer.questionId}`);
        return;
      }

      // Validate answer format based on question type
      if (question.type === 'scale') {
        if (typeof answer.answer !== 'string' || !question.options?.includes(answer.answer)) {
          errors.push(`Invalid answer for question ${question.id}`);
        }
      } else if (question.type === 'multiple-choice') {
        if (typeof answer.answer !== 'string' || !question.options?.includes(answer.answer)) {
          errors.push(`Invalid answer for question ${question.id}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
