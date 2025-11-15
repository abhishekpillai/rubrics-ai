'use client';

import { useState } from 'react';
import { ModelQuality } from '@/lib/types';
import { getModelInfo } from '@/lib/llm';

interface InterviewFormProps {
  onSubmit: (
    jobDescription: string,
    interviewSpecifics: string,
    modelQuality: ModelQuality
  ) => void;
  isLoading: boolean;
}

export default function InterviewForm({
  onSubmit,
  isLoading,
}: InterviewFormProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [interviewSpecifics, setInterviewSpecifics] = useState('');
  const [modelQuality, setModelQuality] = useState<ModelQuality>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jobDescription, interviewSpecifics, modelQuality);
  };

  const standardInfo = getModelInfo('standard');
  const enhancedInfo = getModelInfo('enhanced');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="jobDescription"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Job Description
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
          minLength={20}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Include responsibilities, requirements, and qualifications
        </p>
      </div>

      <div>
        <label
          htmlFor="interviewSpecifics"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Interview Specifics
        </label>
        <textarea
          id="interviewSpecifics"
          value={interviewSpecifics}
          onChange={(e) => setInterviewSpecifics(e.target.value)}
          placeholder="What are you specifically looking to assess in this interview? (e.g., technical skills, cultural fit, leadership experience, problem-solving ability)"
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
          minLength={10}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe the focus areas and what you want to evaluate
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Model Quality
        </label>
        <div className="space-y-3">
          <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="modelQuality"
              value="standard"
              checked={modelQuality === 'standard'}
              onChange={(e) =>
                setModelQuality(e.target.value as ModelQuality)
              }
              className="mt-1 mr-3"
              disabled={isLoading}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {standardInfo.name}
                </span>
                <span className="text-xs text-gray-500">
                  {standardInfo.pricing}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {standardInfo.description}
              </p>
            </div>
          </label>

          <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="modelQuality"
              value="enhanced"
              checked={modelQuality === 'enhanced'}
              onChange={(e) =>
                setModelQuality(e.target.value as ModelQuality)
              }
              className="mt-1 mr-3"
              disabled={isLoading}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {enhancedInfo.name}
                </span>
                <span className="text-xs text-gray-500">
                  {enhancedInfo.pricing}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {enhancedInfo.description}
              </p>
            </div>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !jobDescription || !interviewSpecifics}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Interview Guide'}
      </button>
    </form>
  );
}
