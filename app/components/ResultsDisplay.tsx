'use client';

import { InterviewPreparation } from '@/lib/types';

interface ResultsDisplayProps {
  results: InterviewPreparation;
  model?: string;
}

export default function ResultsDisplay({ results, model }: ResultsDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interview Preparation Guide
        </h2>
        {model && (
          <p className="text-sm text-gray-600">
            Generated using {model}
          </p>
        )}
      </div>

      {/* Interview Agenda */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
            1
          </span>
          Interview Agenda
        </h3>
        <div className="space-y-3">
          {results.agenda.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{item.activity}</h4>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {item.timeAllocation}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evaluation Rubric */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
            2
          </span>
          Evaluation Rubric
        </h3>
        <div className="space-y-4">
          {results.rubric.map((criterion, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {criterion.criterion}
                </h4>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Weight:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-6 h-6 rounded ${
                          level <= criterion.weight
                            ? 'bg-yellow-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {criterion.description}
              </p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Evaluation Guidelines:
                </p>
                <ul className="space-y-1">
                  {criterion.evaluationGuidelines.map((guideline, gIndex) => (
                    <li
                      key={gIndex}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Competencies */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
            ✓
          </span>
          Key Competencies to Assess
        </h3>
        <div className="flex flex-wrap gap-2">
          {results.keyCompetencies.map((competency, index) => (
            <span
              key={index}
              className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
            >
              {competency}
            </span>
          ))}
        </div>
      </section>

      {/* Red Flags */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
            !
          </span>
          Red Flags to Watch For
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <ul className="space-y-2">
            {results.redFlags.map((flag, index) => (
              <li key={index} className="text-sm text-red-800 flex items-start">
                <span className="text-red-500 mr-3 font-bold">⚠</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Print Guide
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create New Guide
        </button>
      </div>
    </div>
  );
}
