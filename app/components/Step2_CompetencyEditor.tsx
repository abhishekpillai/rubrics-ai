'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/wizardContext';
import { Competency } from '@/lib/types';

export default function Step2_CompetencyEditor() {
  const { state, setCompetencies, updateCompetency, deleteCompetency, setQuestions, nextStep, prevStep } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleExtract = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/extract/competencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: state.jobDescription,
          modelQuality: 'standard',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to extract competencies');
      }

      setCompetencies(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract competencies');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCompetency = () => {
    const newComp: Competency = {
      id: `comp-${Date.now()}`,
      name: 'New Competency',
      description: 'Describe what this competency looks like in behavioral terms...',
      weight: 3,
      isRequired: false,
    };
    setCompetencies([...state.competencies, newComp]);
    setEditingId(newComp.id);
  };

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const handleContinue = async () => {
    if (state.competencies.length < 3) {
      setError('You need at least 3 competencies');
      return;
    }
    if (state.competencies.length > 5) {
      setError('You should have maximum 5 competencies');
      return;
    }

    // Auto-generate questions before moving to step 3
    setIsGeneratingQuestions(true);
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
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const isValid = state.competencies.length >= 3 && state.competencies.length <= 5;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">STEP 2: DEFINE COMPETENCIES</h2>
        <p className="text-sm opacity-70">
          Extract 3-5 critical competencies from the job description. These will form the
          foundation of your interview questions and evaluation rubric.
        </p>
      </div>

      {/* Show message if no competencies yet */}
      {state.competencies.length === 0 && (
        <div className="border-2 border-black p-8 text-center mb-8">
          <p className="text-sm font-bold mb-2">NO COMPETENCIES YET</p>
          <p className="text-xs opacity-70">
            Competencies are auto-extracted when you continue from Step 1
          </p>
        </div>
      )}

      {/* Competencies Table */}
      {state.competencies.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-bold">
              COMPETENCIES ({state.competencies.length}/3-5)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExtract}
                disabled={isGenerating}
                className="border border-black px-4 py-2 text-xs hover:bg-gray-100 transition-colors"
              >
                REGENERATE
              </button>
              <button
                onClick={handleAddCompetency}
                className="border border-black px-4 py-2 text-xs hover:bg-gray-100 transition-colors"
              >
                + ADD CUSTOM
              </button>
            </div>
          </div>

          <div className="border-2 border-black overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black bg-white">
                  <th className="text-left p-3 font-bold w-[25%]">COMPETENCY</th>
                  <th className="text-left p-3 font-bold w-[45%] border-l border-black">
                    BEHAVIORAL DESCRIPTION
                  </th>
                  <th className="text-left p-3 font-bold w-[12%] border-l border-black">WEIGHT</th>
                  <th className="text-left p-3 font-bold w-[10%] border-l border-black">REQ'D</th>
                  <th className="text-left p-3 font-bold w-[8%] border-l border-black"></th>
                </tr>
              </thead>
              <tbody>
                {state.competencies.map((comp, index) => (
                  <tr
                    key={comp.id}
                    className={`border-b border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    {/* Name */}
                    <td className="p-3">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) =>
                          updateCompetency(comp.id, { name: e.target.value })
                        }
                        onFocus={() => setEditingId(comp.id)}
                        onBlur={() => setEditingId(null)}
                        className={`w-full bg-transparent border-b ${
                          editingId === comp.id ? 'border-black' : 'border-transparent'
                        } px-1 py-0.5 focus:outline-none font-bold`}
                      />
                    </td>

                    {/* Description */}
                    <td className="p-3 border-l border-black">
                      <textarea
                        value={comp.description}
                        onChange={(e) =>
                          updateCompetency(comp.id, { description: e.target.value })
                        }
                        onFocus={() => setEditingId(comp.id)}
                        onBlur={() => setEditingId(null)}
                        rows={2}
                        className={`w-full bg-transparent border ${
                          editingId === comp.id ? 'border-black' : 'border-transparent'
                        } p-1 focus:outline-none resize-none text-xs leading-relaxed`}
                      />
                    </td>

                    {/* Weight */}
                    <td className="p-3 border-l border-black">
                      <select
                        value={comp.weight}
                        onChange={(e) =>
                          updateCompetency(comp.id, { weight: Number(e.target.value) })
                        }
                        className="w-full border border-black px-2 py-1 text-xs focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((w) => (
                          <option key={w} value={w}>
                            {w}/5 {w >= 4 ? '●' : '○'}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Required */}
                    <td className="p-3 border-l border-black text-center">
                      <input
                        type="checkbox"
                        checked={comp.isRequired || false}
                        onChange={(e) =>
                          updateCompetency(comp.id, { isRequired: e.target.checked })
                        }
                        className="w-4 h-4 border-2 border-black"
                      />
                    </td>

                    {/* Delete */}
                    <td className="p-3 border-l border-black text-center">
                      <button
                        onClick={() => deleteCompetency(comp.id)}
                        className="text-xs hover:bg-black hover:text-white px-2 py-1 border border-black transition-colors"
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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
      <div className="flex items-center gap-4">
        <button
          onClick={prevStep}
          disabled={isGeneratingQuestions}
          className="border-2 border-black px-8 py-4 text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-30"
        >
          ← BACK
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid || isGeneratingQuestions}
          className={`
            border-2 border-black px-8 py-4 text-sm font-bold transition-colors
            ${
              isValid && !isGeneratingQuestions
                ? 'bg-black text-white hover:bg-gray-900'
                : 'opacity-30 cursor-not-allowed'
            }
          `}
        >
          {isGeneratingQuestions ? 'GENERATING QUESTIONS...' : 'CONTINUE →'}
        </button>
        <div className="text-xs opacity-50">
          {!isValid &&
            state.competencies.length > 0 &&
            `Need ${3 - state.competencies.length} more competencies`}
          {isGeneratingQuestions && 'Creating interview questions...'}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3">COMPETENCY-FIRST DESIGN</h3>
        <div className="text-xs opacity-70 leading-relaxed space-y-2">
          <p>
            <strong>What is a competency?</strong> A competency is a measurable, job-relevant
            ability that predicts success in a specific role. Unlike vague "culture fit,"
            competencies are observable and behavioral.
          </p>
          <p>
            <strong>Weight:</strong> Indicates importance (1=nice to have, 5=critical). Use
            weights to prioritize evaluation time.
          </p>
          <p>
            <strong>Required:</strong> Mark 1-2 competencies as "must-have" threshold criteria.
            Candidates who don't meet these should not proceed.
          </p>
          <p className="pt-2 border-t border-gray-300">
            <strong>Evidence base:</strong> Google's research shows that competency-based
            structured interviews have 2x higher predictive validity than unstructured
            interviews, and reduce adverse impact by up to 50%.
          </p>
        </div>
      </div>
    </div>
  );
}
