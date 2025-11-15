'use client';

import { useState } from 'react';
import { InterviewPreparation } from '@/lib/types';
import { copyToClipboard } from '@/lib/exportToClipboard';
import { downloadAsMarkdown } from '@/lib/exportMarkdown';

interface ResultsDisplayProps {
  results: InterviewPreparation;
  model?: string;
}

export default function ResultsDisplay({ results, model }: ResultsDisplayProps) {
  const [showToast, setShowToast] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await copyToClipboard(results);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      downloadAsMarkdown(results);
    } catch (error) {
      console.error('Failed to download markdown:', error);
      alert('Failed to download markdown. Please try again.');
    }
  };
  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 mb-4">
            <span className="text-xs font-semibold tracking-wide uppercase text-[#D4AF37]">
              Generated Guide
            </span>
          </div>
          <h2 className="font-display text-4xl">
            Your Interview Preparation
          </h2>
        </div>
      </div>

      {/* Interview Agenda */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-10 py-6 border-b border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-2xl text-[#0F172A]">Interview Agenda</h3>
              <p className="text-sm text-[#57534E]">Structured timeline for your interview</p>
            </div>
          </div>
        </div>
        <div className="p-10">
          <div className="space-y-6">
            {results.agenda.map((item, index) => (
              <div
                key={index}
                className="relative pl-8 pb-6 border-l-2 border-[#E7E5E4] last:border-l-transparent last:pb-0"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#D4AF37] border-4 border-[#FAFAF9]" />
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-[#0F172A] text-lg">{item.activity}</h4>
                  <span className="flex-shrink-0 px-3 py-1 rounded-full bg-amber-100 text-[#D4AF37] text-sm font-medium">
                    {item.timeAllocation}
                  </span>
                </div>
                <p className="text-[#57534E] leading-relaxed">{item.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Rubric */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-stone-50 px-10 py-6 border-b border-[#E7E5E4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-2xl text-[#0F172A]">Evaluation Rubric</h3>
              <p className="text-sm text-[#57534E]">Criteria and guidelines for assessment</p>
            </div>
          </div>
        </div>
        <div className="p-10">
          {results.rubric.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-[#E7E5E4] rounded-full" />
                <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-[#57534E] text-lg">Generating evaluation criteria...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {results.rubric.map((criterion, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#FAFAF9] to-white border border-[#E7E5E4] rounded-xl p-8"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="font-display text-xl text-[#0F172A]">
                      {criterion.criterion}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#57534E] font-medium">Weight</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-8 rounded-sm transition-all ${
                              level <= criterion.weight
                                ? 'bg-[#D4AF37]'
                                : 'bg-[#E7E5E4]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#57534E] mb-6 leading-relaxed">
                    {criterion.description}
                  </p>
                  <div className="bg-white border border-[#E7E5E4] rounded-lg p-6">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-[#A8A29E] mb-3">
                      Evaluation Guidelines
                    </h5>
                    <ul className="space-y-2">
                      {criterion.evaluationGuidelines.map((guideline, gIndex) => (
                        <li
                          key={gIndex}
                          className="flex items-start gap-3 text-sm text-[#57534E]"
                        >
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2" />
                          <span className="leading-relaxed">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-[#E7E5E4]">
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy to Google Docs
        </button>
        <button
          onClick={handleDownloadMarkdown}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#E7E5E4] text-[#0F172A] rounded-xl font-semibold hover:border-[#D4AF37] hover:bg-amber-50/30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Markdown
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#E7E5E4] text-[#0F172A] rounded-xl font-semibold hover:border-[#D4AF37] hover:bg-amber-50/30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Guide
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0F172A] text-white rounded-xl font-semibold hover:bg-[#1E293B] transition-all shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Guide
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-xl shadow-2xl border border-emerald-400 flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Copied to clipboard!</p>
              <p className="text-sm text-emerald-50">Open Google Docs and paste (Cmd/Ctrl+V)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
