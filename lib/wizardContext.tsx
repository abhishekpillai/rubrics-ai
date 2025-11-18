'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WizardState, WizardStep, Competency, Question, AgendaItem, RubricCriterion, InterviewDuration, InterviewType } from './types';

const STORAGE_KEY = 'rubrics-ai-wizard-state';

// Initial wizard state
const getInitialState = (): WizardState => ({
  step: 1,
  jobDescription: '',
  duration: 30,
  competencies: [],
  selectedCompetencyIds: [],
  questions: [],
  agenda: [],
  rubric: [],
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
});

// Context type
interface WizardContextType {
  state: WizardState;
  // Navigation
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  // Job description & duration
  setJobDescription: (jd: string) => void;
  setDuration: (duration: InterviewDuration) => void;
  // Interview focus
  setInterviewType: (type: InterviewType) => void;
  setInterviewFocus: (focus: string) => void;
  setSelectedCompetencies: (ids: string[]) => void;
  // Competencies
  setCompetencies: (competencies: Competency[]) => void;
  addCompetency: (competency: Competency) => void;
  updateCompetency: (id: string, updates: Partial<Competency>) => void;
  deleteCompetency: (id: string) => void;
  // Questions
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  // Agenda
  setAgenda: (agenda: AgendaItem[]) => void;
  // Rubric
  setRubric: (rubric: RubricCriterion[]) => void;
  updateRubricCriterion: (id: string, updates: Partial<RubricCriterion>) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Provider component
export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(getInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WizardState;
        setState(parsed);
      } catch (error) {
        console.error('Failed to parse stored wizard state:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // Update lastModified timestamp helper
  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      lastModified: new Date().toISOString(),
    }));
  };

  // Navigation
  const goToStep = (step: WizardStep) => updateState({ step });

  const nextStep = () => {
    const stepOrder = [1, 2, 2.5, 3, 4, 5, 6] as const;
    const currentIndex = stepOrder.indexOf(state.step as typeof stepOrder[number]);
    if (currentIndex < stepOrder.length - 1) {
      updateState({ step: stepOrder[currentIndex + 1] });
    }
  };

  const prevStep = () => {
    const stepOrder = [1, 2, 2.5, 3, 4, 5, 6] as const;
    const currentIndex = stepOrder.indexOf(state.step as typeof stepOrder[number]);
    if (currentIndex > 0) {
      updateState({ step: stepOrder[currentIndex - 1] });
    }
  };

  const reset = () => {
    const freshState = getInitialState();
    setState(freshState);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Job description & duration
  const setJobDescription = (jobDescription: string) => {
    updateState({ jobDescription });
  };

  const setDuration = (duration: InterviewDuration) => {
    updateState({ duration });
  };

  // Interview focus
  const setInterviewType = (interviewType: InterviewType) => {
    updateState({ interviewType });
  };

  const setInterviewFocus = (interviewFocus: string) => {
    updateState({ interviewFocus });
  };

  const setSelectedCompetencies = (selectedCompetencyIds: string[]) => {
    updateState({ selectedCompetencyIds });
  };

  // Competencies
  const setCompetencies = (competencies: Competency[]) => {
    updateState({ competencies });
  };

  const addCompetency = (competency: Competency) => {
    updateState({ competencies: [...state.competencies, competency] });
  };

  const updateCompetency = (id: string, updates: Partial<Competency>) => {
    updateState({
      competencies: state.competencies.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const deleteCompetency = (id: string) => {
    updateState({
      competencies: state.competencies.filter((c) => c.id !== id),
      // Also remove from selectedCompetencyIds
      selectedCompetencyIds: state.selectedCompetencyIds.filter((cid) => cid !== id),
      // Also remove related questions
      questions: state.questions.filter((q) => q.competencyId !== id),
    });
  };

  // Questions
  const setQuestions = (questions: Question[]) => {
    updateState({ questions });
  };

  const addQuestion = (question: Question) => {
    updateState({ questions: [...state.questions, question] });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    updateState({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (id: string) => {
    updateState({
      questions: state.questions.filter((q) => q.id !== id),
    });
  };

  // Agenda
  const setAgenda = (agenda: AgendaItem[]) => {
    updateState({ agenda });
  };

  // Rubric
  const setRubric = (rubric: RubricCriterion[]) => {
    updateState({ rubric });
  };

  const updateRubricCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    updateState({
      rubric: state.rubric.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  };

  const value: WizardContextType = {
    state,
    goToStep,
    nextStep,
    prevStep,
    reset,
    setJobDescription,
    setDuration,
    setInterviewType,
    setInterviewFocus,
    setSelectedCompetencies,
    setCompetencies,
    addCompetency,
    updateCompetency,
    deleteCompetency,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setAgenda,
    setRubric,
    updateRubricCriterion,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

// Hook to use wizard context
export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}

// Convenience hooks for specific operations
export function useCompetencies() {
  const { state, setCompetencies, addCompetency, updateCompetency, deleteCompetency } = useWizard();
  return {
    competencies: state.competencies,
    setCompetencies,
    addCompetency,
    updateCompetency,
    deleteCompetency,
  };
}

export function useQuestions() {
  const { state, setQuestions, addQuestion, updateQuestion, deleteQuestion } = useWizard();
  return {
    questions: state.questions,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
