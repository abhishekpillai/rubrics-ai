'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/wizardContext';
import { InterviewType } from '@/lib/types';

export default function Step4_InterviewFocus() {
  const {
    state,
    setInterviewType,
    setInterviewFocus,
    setSelectedCompetencies,
    setQuestions,
    nextStep,
  } = useWizard();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>(
    state.selectedCompetencyIds.length > 0
      ? state.selectedCompetencyIds
      : []
  );
  const [interviewTypeValue, setInterviewTypeValue] = useState<InterviewType | ''>(
    state.interviewType || ''
  );
  const [focusDescription, setFocusDescription] = useState(
    state.interviewFocus || ''
  );

  // Calculate time estimates
  const questionsPerCompetency = 2.5; // Average 2-3 questions
  const minutesPerQuestion = state.duration / (selectedIds.length * questionsPerCompetency + 2); // +2 for intro/outro buffer
  const estimatedQuestions = Math.round(selectedIds.length * questionsPerCompetency);

  // Handle checkbox toggle
  const toggleCompetency = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Smart recommendation: suggest 2-3 competencies based on duration
  const getRecommendedCount = () => {
    if (state.duration === 30) return 2;
    if (state.duration === 45) return 2;
    if (state.duration === 60) return 3;
    return 2;
  };

  const applySmartRecommendation = () => {
    const recommendedCount = getRecommendedCount();
    // Sort by weight (descending) and take top N
    const sorted = [...state.competencies].sort((a, b) => b.weight - a.weight);
    const recommended = sorted.slice(0, recommendedCount).map((c) => c.id);
    setSelectedIds(recommended);
  };

  const handleContinue = async () => {
    // Validation
    if (selectedIds.length === 0) {
      setError('Please select at least 1 competency to assess in this interview.');
      return;
    }
    if (selectedIds.length > 3) {
      setError('Please select at most 3 competencies for quality depth. For more, consider multiple interviews.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Save selections to context
      setSelectedCompetencies(selectedIds);
      if (interviewTypeValue) {
        setInterviewType(interviewTypeValue);
      }
      if (focusDescription.trim()) {
        setInterviewFocus(focusDescription.trim());
      }

      // Generate questions for selected competencies only
      const selectedCompetencies = state.competencies.filter((c) =>
        selectedIds.includes(c.id)
      );

      const response = await fetch('/api/generate/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencies: selectedCompetencies,
          duration: state.duration,
          modelQuality: 'standard',
        }),
      });

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setQuestions(data.data);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-mono mb-2">STEP 4: INTERVIEW FOCUS</h2>
        <p className="text-sm opacity-70">
          Select which competencies THIS interview will assess (1-3 recommended)
        </p>
      </div>

      {/* Interview Type Selector */}
      <div className="mb-8 border-2 border-black p-6 bg-white">
        <label className="block text-xs font-bold mb-3 font-mono">
          INTERVIEW TYPE (OPTIONAL)
        </label>
        <select
          value={interviewTypeValue}
          onChange={(e) => setInterviewTypeValue(e.target.value as InterviewType)}
          className="w-full border-2 border-black px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-black"
          disabled={isLoading}
        >
          <option value="">Select type...</option>
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="system-design">System Design</option>
          <option value="domain">Domain Expertise</option>
          <option value="custom">Custom</option>
        </select>

        <label className="block text-xs font-bold mb-3 font-mono mt-6">
          INTERVIEW FOCUS (OPTIONAL)
        </label>
        <input
          type="text"
          value={focusDescription}
          onChange={(e) => setFocusDescription(e.target.value)}
          placeholder="e.g., Backend engineering technical screen"
          className="w-full border-2 border-black px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-black"
          disabled={isLoading}
        />
      </div>

      {/* Competency Selection */}
      <div className="mb-8 border-2 border-black bg-white">
        <div className="border-b-2 border-black p-4 bg-gray-50 flex justify-between items-center">
          <h3 className="text-xs font-bold font-mono">
            SELECT COMPETENCIES FOR THIS INTERVIEW
          </h3>
          <button
            onClick={applySmartRecommendation}
            className="text-xs font-mono border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
            disabled={isLoading}
          >
            SMART RECOMMEND ({getRecommendedCount()})
          </button>
        </div>

        <div className="p-6 space-y-4">
          {state.competencies.map((competency) => (
            <label
              key={competency.id}
              className="flex items-start gap-4 cursor-pointer hover:bg-gray-50 p-3 border-2 border-transparent hover:border-black transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(competency.id)}
                onChange={() => toggleCompetency(competency.id)}
                className="mt-1 w-5 h-5 border-2 border-black"
                disabled={isLoading}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">
                    {competency.name}
                  </span>
                  <span className="text-xs opacity-50 font-mono">
                    Weight: {competency.weight}/5
                  </span>
                  {competency.isRequired && (
                    <span className="text-xs font-mono bg-black text-white px-2 py-0.5">
                      REQUIRED
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-70 mt-1">
                  {competency.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Time Budget Preview */}
      {selectedIds.length > 0 && (
        <div className="mb-8 border-2 border-black p-6 bg-gray-50">
          <h3 className="text-xs font-bold font-mono mb-4">TIME BUDGET PREVIEW</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-mono font-bold">{state.duration}</div>
              <div className="text-xs opacity-70">Minutes Total</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold">{selectedIds.length}</div>
              <div className="text-xs opacity-70">Competencies</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold">~{estimatedQuestions}</div>
              <div className="text-xs opacity-70">Questions</div>
            </div>
          </div>
          <div className="mt-4 text-xs opacity-70 text-center">
            Approximately {Math.round(minutesPerQuestion)} minutes per question (including intro/outro buffer)
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-8 border-2 border-red-600 bg-red-50 p-6">
          <p className="text-sm text-red-600 font-mono">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleContinue}
          disabled={isLoading || selectedIds.length === 0}
          className="flex-1 border-2 border-black bg-black text-white px-8 py-4 font-mono font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'GENERATING QUESTIONS...' : 'CONTINUE'}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3 font-mono">EVIDENCE-BASED GUIDANCE</h3>
        <div className="text-xs opacity-70 leading-relaxed space-y-2">
          <p>
            <strong>Why limit to 3 competencies?</strong> Research shows that assessing 2-3 competencies
            per interview allows for deeper, more valid evaluation through multiple questions per dimension.
          </p>
          <p>
            <strong>Multi-interview loops:</strong> For roles requiring 4-5 competencies, design multiple
            interviews with different focuses (e.g., technical screen + behavioral interview).
          </p>
          <p>
            <strong>Quality over coverage:</strong> It's better to deeply assess fewer competencies than
            to superficially cover many in limited time.
          </p>
        </div>
      </div>
    </div>
  );
}
