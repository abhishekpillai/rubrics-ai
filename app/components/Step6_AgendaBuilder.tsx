'use client';

import { useEffect, useState } from 'react';
import { useWizard } from '@/lib/wizardContext';
import { AgendaItem } from '@/lib/types';

export default function Step6_AgendaBuilder() {
  const { state, setAgenda, nextStep, prevStep } = useWizard();
  const [error, setError] = useState('');

  // Auto-generate agenda from questions on mount
  useEffect(() => {
    if (state.agenda.length === 0 && state.questions.length > 0) {
      const items: AgendaItem[] = [];

      // 1. Introduction (5 min)
      items.push({
        timeAllocation: '5 minutes',
        activity: 'Introduction & Warm-up',
        purpose: 'Build rapport, explain interview structure, and set expectations',
      });

      // 2. Questions (from question list)
      state.questions.forEach((q, index) => {
        const competency = state.competencies.find((c) => c.id === q.competencyId);
        items.push({
          timeAllocation: `${q.timeAllocation} minutes`,
          activity: `Question ${index + 1}: ${competency?.name || 'Unknown Competency'}`,
          purpose: q.text,
          questionId: q.id,
        });
      });

      // 3. Candidate Questions (remaining time)
      const totalQuestionTime = state.questions.reduce(
        (sum, q) => sum + q.timeAllocation,
        0
      );
      const candidateTime = Math.max(state.duration - totalQuestionTime - 5, 5);
      items.push({
        timeAllocation: `${candidateTime} minutes`,
        activity: 'Candidate Questions',
        purpose: 'Answer candidate questions about role, team, and company',
      });

      setAgenda(items);
    }
  }, [state.questions, state.competencies, state.agenda.length, state.duration, setAgenda]);

  const totalTime = state.agenda.reduce((sum, item) => {
    const time = parseInt(item.timeAllocation);
    return sum + (isNaN(time) ? 0 : time);
  }, 0);

  const isExactMatch = totalTime === state.duration;

  const handleContinue = () => {
    // Simply move to next step - rubric already generated in Step 2
    nextStep();
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">STEP 6: INTERVIEW AGENDA</h2>
        <p className="text-sm opacity-70">
          Timeline view of your structured interview. Questions are sequenced with intro and
          candidate Q&A built in.
        </p>
      </div>

      {/* Time Summary */}
      <div className="mb-6 border-2 border-black p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold">TOTAL INTERVIEW TIME</div>
          <div className="text-sm">
            <span className={`font-bold ${!isExactMatch ? 'opacity-50' : ''}`}>
              {totalTime}
            </span>{' '}
            / {state.duration} MIN
            {isExactMatch && <span className="ml-2">✓</span>}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-2 border-black">
        {state.agenda.map((item, index) => {
          const isIntro = index === 0;
          const isOutro = index === state.agenda.length - 1;
          const isQuestion = !isIntro && !isOutro;

          return (
            <div
              key={index}
              className={`border-b border-black last:border-b-0 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Time Block */}
                  <div className="flex-shrink-0 w-24">
                    <div className="border border-black px-3 py-1 text-center text-xs font-bold bg-white">
                      {item.timeAllocation}
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1">
                      {item.activity}
                      {isIntro && ' 🔷'}
                      {isOutro && ' 🔶'}
                    </div>
                    <div className="text-xs opacity-70 leading-relaxed">
                      {item.purpose}
                    </div>
                    {isQuestion && (
                      <div className="mt-2 text-xs opacity-50">
                        {state.questions.find((q) => q.id === item.questionId)?.type ===
                        'behavioral'
                          ? '→ Behavioral question'
                          : '→ Situational question'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 border-2 border-black bg-white p-4">
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
          className="border-2 border-black px-8 py-4 text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-30"
        >
          ← BACK
        </button>
        <button
          onClick={handleContinue}
          className="border-2 border-black px-8 py-4 text-sm font-bold transition-colors bg-black text-white hover:bg-gray-900"
        >
          CONTINUE →
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3">STRUCTURED INTERVIEW FLOW</h3>
        <div className="text-xs opacity-70 leading-relaxed space-y-2">
          <p>
            <strong>Introduction (5 min):</strong> Build rapport before evaluation begins.
            Explain the structure: "I'll ask X questions, taking notes for consistency, and
            leave time for your questions at the end."
          </p>
          <p>
            <strong>Questions (sequenced):</strong> Start with easier behavioral questions to
            build candidate comfort, then move to more complex situational scenarios. Take
            objective notes on what the candidate says, not your interpretation.
          </p>
          <p>
            <strong>Candidate Questions (~10 min):</strong> Reserve meaningful time. Quality
            candidates use this to assess fit. Google's research shows this improves candidate
            satisfaction by 35% for rejected candidates.
          </p>
        </div>
      </div>
    </div>
  );
}
