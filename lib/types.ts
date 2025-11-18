// Model quality options
export type ModelQuality = 'standard' | 'enhanced';

// Interview duration options
export type InterviewDuration = 30 | 45 | 60;

// Model configuration
export const MODELS = {
  standard: 'openai/gpt-5-mini',
  enhanced: 'anthropic/claude-3.5-sonnet',
} as const;

// Interview input data removed - using wizard flow now

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

// Legacy rubric format removed - using BARS now

// Agenda item
export interface AgendaItem {
  timeAllocation: string; // e.g., "5 minutes"
  activity: string;
  purpose: string;
  questionId?: string; // Optional link to specific question
}

// Interview type options
export type InterviewType = 'technical' | 'behavioral' | 'system-design' | 'domain' | 'custom';

// Wizard step (7 sequential steps)
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Wizard state (complete interview design session)
export interface WizardState {
  step: WizardStep;

  // Role-level data
  jobDescription: string;
  competencies: Competency[]; // ALL role competencies (3-5)
  rubric: RubricCriterion[]; // Role-level rubrics for ALL competencies

  // Interview-level data
  interviewType?: InterviewType; // Type of this specific interview
  interviewFocus?: string; // Optional description of interview focus
  selectedCompetencyIds: string[]; // Which competencies THIS interview assesses
  duration: InterviewDuration;
  questions: Question[]; // Questions for selected competencies only
  agenda: AgendaItem[];

  // Metadata
  createdAt: string;
  lastModified: string;
}

// Legacy InterviewPreparation and GenerateResponse removed - using wizard flow now
