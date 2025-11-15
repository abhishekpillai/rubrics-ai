'use client';

import { useState } from 'react';
import InterviewForm from './components/InterviewForm';
import ResultsDisplay from './components/ResultsDisplay';
import { InterviewPreparation } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<InterviewPreparation | null>(null);
  const [model, setModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    jobDescription: string,
    interviewSpecifics: string
  ) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          interviewSpecifics,
          modelQuality: 'standard', // Always use standard model
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate interview guide');
      }

      setResults(data.data);
      setModel(data.model);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating interview guide:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-50/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-slate-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-20 animate-fade-in-up">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50 mb-6">
                <span className="text-xs font-semibold tracking-wide uppercase text-amber-900">
                  AI-Powered Interview Preparation
                </span>
              </div>
              <h1 className="font-display text-6xl lg:text-7xl text-[#0F172A] mb-6 leading-[0.95]">
                Rubrics AI
              </h1>
              <p className="text-xl text-[#57534E] max-w-2xl leading-relaxed">
                Craft structured interview agendas and precise evaluation rubrics—tailored
                to your hiring needs with AI-driven insights.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {!results ? (
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Form Section */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-[#E7E5E4] rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-8 lg:p-12">
                    <InterviewForm onSubmit={handleSubmit} isLoading={isLoading} />
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1">Generation Error</h4>
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0F172A] text-white rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-2xl" />
                  <div className="relative">
                    <h3 className="font-display text-2xl mb-4">How It Works</h3>
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] text-[#0F172A] text-xs font-bold flex items-center justify-center">1</span>
                        <span className="text-sm text-gray-300">Provide your job description and interview focus areas</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] text-[#0F172A] text-xs font-bold flex items-center justify-center">2</span>
                        <span className="text-sm text-gray-300">Select your preferred AI model quality</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] text-[#0F172A] text-xs font-bold flex items-center justify-center">3</span>
                        <span className="text-sm text-gray-300">Receive a complete interview guide in seconds</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-8">
                  <h3 className="font-display text-xl text-[#0F172A] mb-3">What You Get</h3>
                  <ul className="space-y-2 text-sm text-[#57534E]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">→</span> Time-allocated interview agenda
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">→</span> Weighted evaluation rubric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">→</span> Key competencies checklist
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">→</span> Red flags to monitor
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ResultsDisplay results={results} model={model} />
          )}

          {isLoading && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-[#E7E5E4] max-w-md">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-[#E7E5E4] rounded-full" />
                    <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-[#0F172A] mb-1">
                      Generating Your Guide
                    </h4>
                    <p className="text-sm text-[#57534E]">
                      Analyzing requirements and crafting your interview structure...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-[#E7E5E4] animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center">
            <div className="font-display text-2xl text-[#0F172A] mb-2">Rubrics AI</div>
            <p className="text-sm text-[#57534E]">© 2025 Rubrics AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
