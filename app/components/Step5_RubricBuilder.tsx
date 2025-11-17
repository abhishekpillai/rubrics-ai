'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/wizardContext';
import { RubricLevel, RubricLevelType } from '@/lib/types';

export default function Step5_RubricBuilder() {
  const { state, setRubric, updateRubricCriterion, nextStep, prevStep } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate/rubric-from-competencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencies: state.competencies,
          modelQuality: 'standard',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate rubric');
      }

      setRubric(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate rubric');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    if (state.rubric.length === 0) {
      setError('Generate a rubric before continuing');
      return;
    }
    nextStep();
  };

  const updateLevel = (
    criterionId: string,
    levelType: RubricLevelType,
    field: 'description' | 'indicators',
    value: string | string[]
  ) => {
    const criterion = state.rubric.find((r) => r.id === criterionId);
    if (!criterion) return;

    const newLevels = criterion.levels.map((level) => {
      if (level.level === levelType) {
        return { ...level, [field]: value };
      }
      return level;
    });

    updateRubricCriterion(criterionId, { levels: newLevels });
  };

  const getLevelLabel = (level: RubricLevelType): string => {
    const labels = {
      poor: 'POOR',
      mixed: 'MIXED',
      good: 'GOOD',
      excellent: 'EXCELLENT',
    };
    return labels[level];
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">STEP 5: EVALUATION RUBRIC</h2>
        <p className="text-sm opacity-70">
          Behaviorally anchored rating scales (BARS) for each competency. Defines what
          poor/mixed/good/excellent looks like in observable terms.
        </p>
      </div>

      {/* Show message if no rubric yet */}
      {state.rubric.length === 0 && (
        <div className="border-2 border-black p-8 text-center mb-8">
          <p className="text-sm font-bold mb-2">NO RUBRIC YET</p>
          <p className="text-xs opacity-70">
            Rubric is auto-generated when you continue from Step 4
          </p>
        </div>
      )}

      {/* Rubric Criteria */}
      {state.rubric.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-bold">
              RUBRIC CRITERIA ({state.rubric.length})
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="border border-black px-4 py-2 text-xs hover:bg-gray-100 transition-colors"
            >
              REGENERATE
            </button>
          </div>

          <div className="space-y-8">
            {state.rubric.map((criterion) => {
              const competency = state.competencies.find(
                (c) => c.id === criterion.competencyId
              );

              return (
                <div key={criterion.id} className="border-2 border-black">
                  {/* Header */}
                  <div className="bg-black text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">{criterion.competencyName}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {competency?.description}
                        </div>
                      </div>
                      <div className="text-xs">
                        WEIGHT: {criterion.weight}/5
                        {'●'.repeat(criterion.weight)}{'○'.repeat(5 - criterion.weight)}
                      </div>
                    </div>
                  </div>

                  {/* 4-Level Matrix */}
                  <div className="grid grid-cols-4">
                    {(['poor', 'mixed', 'good', 'excellent'] as RubricLevelType[]).map(
                      (levelType) => {
                        const level = criterion.levels.find((l) => l.level === levelType);
                        if (!level) return null;

                        return (
                          <div
                            key={levelType}
                            className="border-r border-black last:border-r-0"
                          >
                            {/* Level Header */}
                            <div className="bg-gray-100 border-b border-black px-4 py-2 text-center">
                              <div className="text-xs font-bold">
                                {getLevelLabel(levelType)}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="border-b border-black p-4">
                              <textarea
                                value={level.description}
                                onChange={(e) =>
                                  updateLevel(
                                    criterion.id,
                                    levelType,
                                    'description',
                                    e.target.value
                                  )
                                }
                                rows={3}
                                className="w-full text-xs bg-transparent border border-transparent hover:border-black focus:border-black p-1 focus:outline-none resize-none"
                                placeholder="Level description..."
                              />
                            </div>

                            {/* Indicators */}
                            <div className="p-4">
                              <div className="text-xs font-bold mb-2 opacity-50">
                                OBSERVABLE INDICATORS
                              </div>
                              {level.indicators.map((indicator, idx) => (
                                <div key={idx} className="mb-2">
                                  <input
                                    type="text"
                                    value={indicator}
                                    onChange={(e) => {
                                      const newIndicators = [...level.indicators];
                                      newIndicators[idx] = e.target.value;
                                      updateLevel(
                                        criterion.id,
                                        levelType,
                                        'indicators',
                                        newIndicators
                                      );
                                    }}
                                    className="w-full text-xs bg-transparent border-b border-transparent hover:border-black focus:border-black p-1 focus:outline-none"
                                    placeholder={`Indicator ${idx + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Non-Signals (Equity Focus) */}
                  <div className="border-t-2 border-black bg-amber-50 p-4">
                    <div className="text-xs font-bold mb-2">
                      ⚠ NON-SIGNALS (Do NOT evaluate these)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {criterion.nonSignals?.map((signal, idx) => (
                        <div
                          key={idx}
                          className="border border-black px-3 py-1 text-xs bg-white"
                        >
                          {signal}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-8 mb-8 border-2 border-black bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠</span>
            <div>
              <div className="font-bold text-sm mb-1">ERROR</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={prevStep}
          className="border-2 border-black px-8 py-4 text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          ← BACK
        </button>
        <button
          onClick={handleContinue}
          disabled={state.rubric.length === 0}
          className={`
            border-2 border-black px-8 py-4 text-sm font-bold transition-colors
            ${
              state.rubric.length > 0
                ? 'bg-black text-white hover:bg-gray-900'
                : 'opacity-30 cursor-not-allowed'
            }
          `}
        >
          CONTINUE →
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3">BEHAVIORALLY ANCHORED RATING SCALES (BARS)</h3>
        <div className="text-xs opacity-70 leading-relaxed space-y-2">
          <p>
            <strong>Why BARS?</strong> Research shows behaviorally anchored scales reduce
            bias, increase inter-rater reliability, and improve predictive validity compared
            to simple numeric or adjective scales.
          </p>
          <p>
            <strong>How to use:</strong> During the interview, take objective notes on what
            the candidate says and does. After, match their responses to the behavioral
            indicators in each level. Choose the level that best matches the evidence you
            observed.
          </p>
          <p>
            <strong>Non-signals:</strong> These are attributes that research shows do NOT
            predict job performance and often disadvantage underrepresented groups. Ignore
            these completely when scoring.
          </p>
        </div>
      </div>
    </div>
  );
}
