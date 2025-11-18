'use client';

import { useWizard } from '@/lib/wizardContext';
import { WizardStep } from '@/lib/types';

const STEP_LABELS = [
  { number: 1, label: 'Job Description' },
  { number: 2, label: 'Define Competencies' },
  { number: 2.5, label: 'Interview Focus' },
  { number: 3, label: 'Generate Questions' },
  { number: 4, label: 'Build Agenda' },
  { number: 5, label: 'Review Rubric' },
  { number: 6, label: 'Results' },
];

interface WizardLayoutProps {
  children: React.ReactNode;
}

export default function WizardLayout({ children }: WizardLayoutProps) {
  const { state, goToStep, reset } = useWizard();

  const handleStepClick = (stepNumber: WizardStep) => {
    // Only allow going back to completed steps
    if (stepNumber < state.step) {
      goToStep(stepNumber);
    }
  };

  // Calculate progress accounting for step 2.5
  const stepOrder = [1, 2, 2.5, 3, 4, 5, 6];
  const currentStepIndex = stepOrder.indexOf(state.step);
  const progressPercent = (currentStepIndex / (stepOrder.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="border-b-2 border-black py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RUBRICS AI</h1>
            <p className="text-xs mt-1 uppercase tracking-wide">Evidence-Based Interview Builder</p>
          </div>
          <button
            onClick={reset}
            className="border-2 border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors"
          >
            RESET
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              STEP {state.step} OF 7
            </div>
            <div className="text-sm">
              {progressPercent.toFixed(0)}% COMPLETE
            </div>
          </div>
          <div className="h-2 border border-black bg-white">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <nav className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <ol className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {STEP_LABELS.map((step) => {
              const isActive = state.step === step.number;
              const isCompleted = state.step > step.number;
              const isClickable = step.number < state.step;

              return (
                <li key={step.number}>
                  <button
                    onClick={() => handleStepClick(step.number as WizardStep)}
                    disabled={!isClickable && !isActive}
                    className={`
                      w-full text-left p-3 border border-black text-xs
                      ${isActive ? 'bg-black text-white' : ''}
                      ${isCompleted ? 'border-black' : 'border-gray-300'}
                      ${isClickable ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'}
                      ${!isClickable && !isActive ? 'opacity-40' : ''}
                      transition-colors
                    `}
                  >
                    <div className="font-bold mb-1">{step.number}</div>
                    <div className="leading-tight">{step.label}</div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-black mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8 text-xs">
            <div>
              <h3 className="font-bold mb-2">ABOUT THIS TOOL</h3>
              <p className="leading-relaxed opacity-70">
                This interview builder implements research-backed structured interview
                principles. Structured interviews with behaviorally anchored rubrics are
                more predictive, reduce bias, and improve candidate experience.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">EVIDENCE BASE</h3>
              <ul className="space-y-1 opacity-70">
                <li>→ Competency-first design (3-5 critical dimensions)</li>
                <li>→ Behaviorally anchored rating scales (BARS)</li>
                <li>→ Standardized questions across candidates</li>
                <li>→ Equity-focused (non-signal identification)</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-black text-xs opacity-50">
            © 2025 RUBRICS AI · AUTO-SAVES TO BROWSER
          </div>
        </div>
      </footer>
    </div>
  );
}
