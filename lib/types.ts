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

// Rubric criterion
export interface RubricCriterion {
  criterion: string;
  description: string;
  weight: number; // 1-5 scale
  evaluationGuidelines: string[];
}

// Agenda item
export interface AgendaItem {
  timeAllocation: string; // e.g., "5 minutes"
  activity: string;
  purpose: string;
}

// Generated interview preparation
export interface InterviewPreparation {
  agenda: AgendaItem[];
  rubric: RubricCriterion[];
  keyCompetencies: string[];
  redFlags: string[];
  recommendedQuestions?: string[]; // For post-MVP
}

// API response
export interface GenerateResponse {
  success: boolean;
  data?: InterviewPreparation;
  error?: string;
  model?: string;
}
