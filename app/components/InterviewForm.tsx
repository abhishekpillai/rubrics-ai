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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Job Description */}
      <div className="group">
        <label
          htmlFor="jobDescription"
          className="block font-display text-lg text-[#0F172A] mb-3"
        >
          Job Description
        </label>
        <div className="relative">
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description, including responsibilities, requirements, and qualifications..."
            className="w-full h-56 px-5 py-4 border-2 border-[#E7E5E4] rounded-xl focus:border-[#D4AF37] focus:outline-none resize-none transition-colors bg-white text-[#1C1917] placeholder:text-[#A8A29E]"
            required
            minLength={20}
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4 text-xs text-[#A8A29E]">
            {jobDescription.length} characters
          </div>
        </div>
      </div>

      {/* Interview Specifics */}
      <div className="group">
        <label
          htmlFor="interviewSpecifics"
          className="block font-display text-lg text-[#0F172A] mb-3"
        >
          Interview Focus Areas
        </label>
        <div className="relative">
          <textarea
            id="interviewSpecifics"
            value={interviewSpecifics}
            onChange={(e) => setInterviewSpecifics(e.target.value)}
            placeholder="What specific areas do you want to assess? (e.g., technical skills, leadership experience, cultural alignment, problem-solving ability)"
            className="w-full h-40 px-5 py-4 border-2 border-[#E7E5E4] rounded-xl focus:border-[#D4AF37] focus:outline-none resize-none transition-colors bg-white text-[#1C1917] placeholder:text-[#A8A29E]"
            required
            minLength={10}
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4 text-xs text-[#A8A29E]">
            {interviewSpecifics.length} characters
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block font-display text-lg text-[#0F172A] mb-4">
          AI Model Quality
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Standard Model */}
          <label className={`relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all ${
            modelQuality === 'standard'
              ? 'border-[#D4AF37] bg-gradient-to-br from-amber-50/50 to-orange-50/30'
              : 'border-[#E7E5E4] bg-white hover:border-[#D4AF37]/50'
          }`}>
            <input
              type="radio"
              name="modelQuality"
              value="standard"
              checked={modelQuality === 'standard'}
              onChange={(e) =>
                setModelQuality(e.target.value as ModelQuality)
              }
              className="sr-only"
              disabled={isLoading}
            />
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-[#0F172A] text-base mb-1">
                  {standardInfo.name}
                </div>
                <div className="text-xs font-medium text-[#D4AF37]">
                  {standardInfo.pricing}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                modelQuality === 'standard'
                  ? 'border-[#D4AF37] bg-[#D4AF37]'
                  : 'border-[#D4D4D8]'
              }`}>
                {modelQuality === 'standard' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            <p className="text-sm text-[#57534E] leading-relaxed">
              {standardInfo.description}
            </p>
          </label>

          {/* Enhanced Model */}
          <label className={`relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all ${
            modelQuality === 'enhanced'
              ? 'border-[#D4AF37] bg-gradient-to-br from-amber-50/50 to-orange-50/30'
              : 'border-[#E7E5E4] bg-white hover:border-[#D4AF37]/50'
          }`}>
            <input
              type="radio"
              name="modelQuality"
              value="enhanced"
              checked={modelQuality === 'enhanced'}
              onChange={(e) =>
                setModelQuality(e.target.value as ModelQuality)
              }
              className="sr-only"
              disabled={isLoading}
            />
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-[#0F172A] text-base mb-1">
                  {enhancedInfo.name}
                </div>
                <div className="text-xs font-medium text-[#D4AF37]">
                  {enhancedInfo.pricing}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                modelQuality === 'enhanced'
                  ? 'border-[#D4AF37] bg-[#D4AF37]'
                  : 'border-[#D4D4D8]'
              }`}>
                {modelQuality === 'enhanced' && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            <p className="text-sm text-[#57534E] leading-relaxed">
              {enhancedInfo.description}
            </p>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !jobDescription || !interviewSpecifics}
        className="w-full bg-[#0F172A] text-white py-5 px-8 rounded-xl font-semibold hover:bg-[#1E293B] disabled:bg-[#E7E5E4] disabled:text-[#A8A29E] disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Interview Guide'
        )}
      </button>
    </form>
  );
}
