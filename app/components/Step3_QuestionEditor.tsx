'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/wizardContext';
import { Question, QuestionType } from '@/lib/types';

export default function Step3_QuestionEditor() {
  const { state, setQuestions, updateQuestion, deleteQuestion, nextStep, prevStep } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencies: state.competencies,
          duration: state.duration,
          modelQuality: 'standard',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate questions');
      }

      setQuestions(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: 'Enter your question here...',
      type: 'behavioral',
      competencyId: state.competencies[0]?.id || '',
      timeAllocation: 5,
    };
    setQuestions([...state.questions, newQuestion]);
    setEditingId(newQuestion.id);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === state.questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...state.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  const handleContinue = () => {
    if (state.questions.length === 0) {
      setError('You need at least one question');
      return;
    }
    const totalTime = state.questions.reduce((sum, q) => sum + q.timeAllocation, 0);
    const maxTime = state.duration - 10; // Leave 10 min buffer
    if (totalTime > maxTime) {
      setError(`Questions total ${totalTime} min, exceeds budget of ${maxTime} min`);
      return;
    }
    nextStep();
  };

  const totalTime = state.questions.reduce((sum, q) => sum + q.timeAllocation, 0);
  const maxTime = state.duration - 10;
  const isOverBudget = totalTime > maxTime;
  const isValid = state.questions.length > 0 && !isOverBudget;

  // Group questions by competency for display
  const questionsByCompetency = state.competencies.map((comp) => ({
    competency: comp,
    questions: state.questions.filter((q) => q.competencyId === comp.id),
  }));

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">STEP 3: GENERATE QUESTIONS</h2>
        <p className="text-sm opacity-70">
          Create behavioral and situational questions that assess each competency. Mix "Tell
          me about a time..." (behavioral) with "What would you do if..." (situational).
        </p>
      </div>

      {/* Generate Button */}
      {state.questions.length === 0 && (
        <div className="mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="border-2 border-black px-8 py-4 text-sm font-bold bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'GENERATING QUESTIONS...' : 'GENERATE QUESTIONS →'}
          </button>
          <p className="text-xs opacity-50 mt-2">
            AI will create behavioral + situational questions for each competency
          </p>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="border-2 border-black p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-bold">GENERATING QUESTIONS...</p>
          <p className="text-xs opacity-50 mt-2">Creating evidence-based interview questions</p>
        </div>
      )}

      {/* Questions Table */}
      {state.questions.length > 0 && (
        <>
          {/* Time Budget Indicator */}
          <div className="mb-4 border-2 border-black p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold">TIME BUDGET</div>
              <div className="text-sm">
                <span className={isOverBudget ? 'font-bold' : ''}>{totalTime}</span> /{' '}
                {maxTime} MIN{' '}
                <span className="opacity-50">
                  ({state.duration} min total - 10 min buffer)
                </span>
              </div>
            </div>
            <div className="h-3 border border-black bg-white">
              <div
                className={`h-full transition-all ${
                  isOverBudget ? 'bg-red-600' : 'bg-black'
                }`}
                style={{ width: `${Math.min((totalTime / maxTime) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-bold">
              QUESTIONS ({state.questions.length})
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="border border-black px-4 py-2 text-xs hover:bg-gray-100 transition-colors"
              >
                REGENERATE
              </button>
              <button
                onClick={handleAddQuestion}
                className="border border-black px-4 py-2 text-xs hover:bg-gray-100 transition-colors"
              >
                + ADD CUSTOM
              </button>
            </div>
          </div>

          {/* Questions by Competency */}
          <div className="space-y-6">
            {questionsByCompetency.map((group, groupIndex) => (
              <div key={group.competency.id}>
                <div className="bg-black text-white px-4 py-2 text-sm font-bold mb-2">
                  {group.competency.name.toUpperCase()}
                  {group.competency.isRequired && ' (REQUIRED)'}
                </div>

                {group.questions.length === 0 ? (
                  <div className="border border-black p-6 text-center text-sm opacity-50">
                    No questions for this competency yet
                  </div>
                ) : (
                  <div className="border-2 border-black">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-black bg-white">
                          <th className="text-left p-3 font-bold w-[5%]">#</th>
                          <th className="text-left p-3 font-bold w-[50%] border-l border-black">
                            QUESTION
                          </th>
                          <th className="text-left p-3 font-bold w-[15%] border-l border-black">
                            TYPE
                          </th>
                          <th className="text-left p-3 font-bold w-[12%] border-l border-black">
                            TIME (MIN)
                          </th>
                          <th className="text-left p-3 font-bold w-[10%] border-l border-black">
                            ORDER
                          </th>
                          <th className="text-left p-3 font-bold w-[8%] border-l border-black"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.questions.map((question, qIndex) => {
                          const globalIndex = state.questions.findIndex(
                            (q) => q.id === question.id
                          );
                          return (
                            <tr
                              key={question.id}
                              className={`border-b border-black ${
                                qIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              {/* Number */}
                              <td className="p-3 font-bold">{globalIndex + 1}</td>

                              {/* Question Text */}
                              <td className="p-3 border-l border-black">
                                <textarea
                                  value={question.text}
                                  onChange={(e) =>
                                    updateQuestion(question.id, { text: e.target.value })
                                  }
                                  onFocus={() => setEditingId(question.id)}
                                  onBlur={() => setEditingId(null)}
                                  rows={3}
                                  className={`w-full bg-transparent border ${
                                    editingId === question.id
                                      ? 'border-black'
                                      : 'border-transparent'
                                  } p-1 focus:outline-none resize-none text-xs leading-relaxed`}
                                />
                              </td>

                              {/* Type */}
                              <td className="p-3 border-l border-black">
                                <select
                                  value={question.type}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      type: e.target.value as QuestionType,
                                    })
                                  }
                                  className="w-full border border-black px-2 py-1 text-xs focus:outline-none"
                                >
                                  <option value="behavioral">Behavioral</option>
                                  <option value="situational">Situational</option>
                                </select>
                              </td>

                              {/* Time Allocation */}
                              <td className="p-3 border-l border-black">
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={question.timeAllocation}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      timeAllocation: Number(e.target.value),
                                    })
                                  }
                                  className="w-full border border-black px-2 py-1 text-xs focus:outline-none"
                                />
                              </td>

                              {/* Order Controls */}
                              <td className="p-3 border-l border-black">
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => moveQuestion(globalIndex, 'up')}
                                    disabled={globalIndex === 0}
                                    className="border border-black px-2 py-1 text-xs hover:bg-gray-200 disabled:opacity-30"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    onClick={() => moveQuestion(globalIndex, 'down')}
                                    disabled={globalIndex === state.questions.length - 1}
                                    className="border border-black px-2 py-1 text-xs hover:bg-gray-200 disabled:opacity-30"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </td>

                              {/* Delete */}
                              <td className="p-3 border-l border-black text-center">
                                <button
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-xs hover:bg-black hover:text-white px-2 py-1 border border-black transition-colors"
                                >
                                  DEL
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
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
          disabled={!isValid}
          className={`
            border-2 border-black px-8 py-4 text-sm font-bold transition-colors
            ${
              isValid
                ? 'bg-black text-white hover:bg-gray-900'
                : 'opacity-30 cursor-not-allowed'
            }
          `}
        >
          CONTINUE →
        </button>
        <div className="text-xs opacity-50">
          {!isValid && state.questions.length > 0 && isOverBudget && 'Reduce time allocations'}
          {!isValid && state.questions.length === 0 && 'Add at least one question'}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3">EVIDENCE-BASED QUESTION TYPES</h3>
        <div className="grid md:grid-cols-2 gap-6 text-xs opacity-70 leading-relaxed">
          <div>
            <p className="font-bold mb-2">BEHAVIORAL QUESTIONS</p>
            <p className="mb-2">
              "Tell me about a time when..." → Assess past behavior, which predicts future
              performance. Research shows past behavior is the strongest predictor of future
              behavior.
            </p>
            <p className="text-xs opacity-50">
              Example: "Tell me about a time when you had to make a decision with incomplete
              information."
            </p>
          </div>
          <div>
            <p className="font-bold mb-2">SITUATIONAL QUESTIONS</p>
            <p className="mb-2">
              "What would you do if..." → Assess judgment and problem-solving in hypothetical
              scenarios. Useful when candidates lack direct experience.
            </p>
            <p className="text-xs opacity-50">
              Example: "What would you do if two team members fundamentally disagreed on an
              approach?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
