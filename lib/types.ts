// Model quality options
export type ModelQuality = 'standard' | 'enhanced';

// Interview duration options
export type InterviewDuration = 30 | 45 | 60;

// Model configuration
export const MODELS = {
  standard: 'openai/gpt-5-mini',
  enhanced: 'anthropic/claude-3.5-sonnet',
} as const;

// Interview input data
export interface InterviewInput {
  jobDescription: string;
  interviewSpecifics: string;
  duration: InterviewDuration;
  modelQuality?: ModelQuality;
}

// Competency - core evaluation dimension
export interface Competency {
  id: string;
  name: string;
  description: string; // Behavioral description of what this competency means
  weight: number; // 1-5 scale, importance for role
  isRequired?: boolean; // Must-have competency
}

// Question types
export type QuestionType = 'behavioral' | 'situational';

// Interview question
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  competencyId: string; // Maps to a specific competency
  timeAllocation: number; // Minutes allocated
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Rubric level (behaviorally anchored scale)
export type RubricLevelType = 'poor' | 'mixed' | 'good' | 'excellent';

export interface RubricLevel {
  level: RubricLevelType;
  description: string; // Observable behaviors at this level
  indicators: string[]; // Specific examples/evidence
}

// Rubric criterion (evidence-based version)
export interface RubricCriterion {
  id: string;
  competencyId: string;
  competencyName: string;
  weight: number; // 1-5 scale
  levels: RubricLevel[]; // 4-level behaviorally anchored scale
  nonSignals?: string[]; // Things that should NOT be evaluated (equity focus)
}

// Legacy rubric format (for backwards compatibility)
export interface LegacyRubricCriterion {
  criterion: string;
  description: string;
  weight: number;
  evaluationGuidelines: string[];
}

// Agenda item
export interface AgendaItem {
  timeAllocation: string; // e.g., "5 minutes"
  activity: string;
  purpose: string;
  questionId?: string; // Optional link to specific question
}

// Wizard step
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

// Wizard state (complete interview design session)
export interface WizardState {
  step: WizardStep;
  jobDescription: string;
  duration: InterviewDuration;
  competencies: Competency[];
  questions: Question[];
  agenda: AgendaItem[];
  rubric: RubricCriterion[];
  createdAt: string;
  lastModified: string;
}

// Generated interview preparation (legacy format)
export interface InterviewPreparation {
  agenda: AgendaItem[];
  rubric: LegacyRubricCriterion[];
  recommendedQuestions?: string[];
}

// New interview preparation format (wizard-based)
export interface InterviewGuide {
  jobDescription: string;
  duration: InterviewDuration;
  competencies: Competency[];
  questions: Question[];
  agenda: AgendaItem[];
  rubric: RubricCriterion[];
  createdAt: string;
}

// API response
export interface GenerateResponse {
  success: boolean;
  data?: InterviewPreparation;
  error?: string;
  model?: string;
}
