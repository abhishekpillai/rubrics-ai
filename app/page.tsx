'use client';

import { useState } from 'react';
import InterviewForm from './components/InterviewForm';
import ResultsDisplay from './components/ResultsDisplay';
import { InterviewPreparation, ModelQuality } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<InterviewPreparation | null>(null);
  const [model, setModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    jobDescription: string,
    interviewSpecifics: string,
    modelQuality: ModelQuality
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
          modelQuality,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Rubrics AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive interview agendas and evaluation rubrics
            tailored to your specific hiring needs
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!results ? (
            <>
              <InterviewForm onSubmit={handleSubmit} isLoading={isLoading} />

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <span className="font-semibold">Error:</span> {error}
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-blue-800 font-medium">
                      Generating your interview guide...
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ResultsDisplay results={results} model={model} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Powered by OpenRouter •{' '}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Learn more
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
