'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/wizardContext';
import { InterviewDuration } from '@/lib/types';

export default function Step1_JobInput() {
  const { state, setJobDescription, setDuration, setCompetencies, nextStep } = useWizard();
  const [localJD, setLocalJD] = useState(state.jobDescription);
  const [localDuration, setLocalDuration] = useState(state.duration);
  const [error, setError] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const handleContinue = async () => {
    // Validation
    if (localJD.trim().length < 100) {
      setError('Job description must be at least 100 characters');
      return;
    }

    setJobDescription(localJD);
    setDuration(localDuration);

    // Auto-extract competencies before moving to step 2
    setIsExtracting(true);
    setError('');

    try {
      const response = await fetch('/api/extract/competencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: localJD,
          modelQuality: 'standard',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to extract competencies');
      }

      setCompetencies(result.data);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract competencies');
    } finally {
      setIsExtracting(false);
    }
  };

  const charCount = localJD.length;
  const isValid = charCount >= 100;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">STEP 1: JOB DESCRIPTION</h2>
        <p className="text-sm opacity-70">
          Paste the full job description. We'll extract the critical competencies
          required for this role.
        </p>
      </div>

      {/* Job Description Input */}
      <div className="mb-8">
        <label className="block mb-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold">JOB DESCRIPTION</span>
            <span className={`text-xs ${isValid ? 'opacity-50' : 'font-bold'}`}>
              {charCount} / 100 MIN
            </span>
          </div>
          <textarea
            value={localJD}
            onChange={(e) => {
              setLocalJD(e.target.value);
              setError('');
            }}
            rows={16}
            className="w-full border-2 border-black p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Paste job description here...

Example:
Senior Product Designer
We're looking for a Senior Product Designer to join our team. You'll work closely with product managers and engineers to design user-centric experiences.

Key Responsibilities:
- Lead design for complex product features
- Collaborate with cross-functional teams
- Conduct user research and usability testing
..."
          />
        </label>
      </div>

      {/* Interview Duration */}
      <div className="mb-8">
        <label className="block mb-3">
          <span className="text-sm font-bold">INTERVIEW DURATION</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {([30, 45, 60] as InterviewDuration[]).map((duration) => (
            <button
              key={duration}
              onClick={() => setLocalDuration(duration)}
              className={`
                border-2 border-black p-4 text-sm font-bold transition-colors
                ${localDuration === duration ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}
              `}
            >
              {duration} MIN
            </button>
          ))}
        </div>
        <p className="text-xs opacity-50 mt-2">
          Selected duration will determine question count and time allocations
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 border-2 border-black bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠</span>
            <div>
              <div className="font-bold text-sm mb-1">VALIDATION ERROR</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleContinue}
          disabled={!isValid || isExtracting}
          className={`
            border-2 border-black px-8 py-4 text-sm font-bold transition-colors
            ${
              isValid && !isExtracting
                ? 'bg-black text-white hover:bg-gray-900'
                : 'opacity-30 cursor-not-allowed'
            }
          `}
        >
          {isExtracting ? 'EXTRACTING COMPETENCIES...' : 'CONTINUE →'}
        </button>
        <div className="text-xs opacity-50">
          {!isValid && 'Add more detail to continue'}
          {isExtracting && 'Analyzing job description...'}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3">WHY THIS MATTERS</h3>
        <div className="text-xs opacity-70 leading-relaxed space-y-2">
          <p>
            Research shows that competency-based interviews are more predictive of job
            performance than unstructured interviews (validity coefficient: 0.51 vs 0.38).
          </p>
          <p>
            By starting with the job description, we ensure every question and evaluation
            criterion is directly relevant to the role—not based on vague "culture fit"
            or irrelevant signals.
          </p>
        </div>
      </div>
    </div>
  );
}
