'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/wizardContext';

export default function Step6_Results() {
  const { state, reset, prevStep } = useWizard();
  const [showToast, setShowToast] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const text = generatePlainText();
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-guide-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePlainText = () => {
    const lines: string[] = [];
    lines.push('INTERVIEW GUIDE');
    lines.push('='.repeat(60));
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push(`Duration: ${state.duration} minutes`);

    // Interview Focus (if specified)
    if (state.interviewType || state.interviewFocus) {
      lines.push('');
      lines.push('INTERVIEW FOCUS');
      lines.push('-'.repeat(60));
      if (state.interviewType) {
        lines.push(`Type: ${state.interviewType}`);
      }
      if (state.interviewFocus) {
        lines.push(`Focus: ${state.interviewFocus}`);
      }
      const selectedCompetencies = state.competencies.filter((c) =>
        state.selectedCompetencyIds.includes(c.id)
      );
      lines.push(`Assessing: ${selectedCompetencies.map((c) => c.name).join(', ')}`);
    }
    lines.push('');

    // Competencies (ALL role competencies)
    lines.push('COMPETENCIES');
    lines.push('-'.repeat(60));
    state.competencies.forEach((c) => {
      lines.push(`\n${c.name} ${c.isRequired ? '(REQUIRED)' : ''}`);
      lines.push(`Weight: ${c.weight}/5`);
      lines.push(c.description);
    });

    // Questions
    lines.push('\n\nQUESTIONS');
    lines.push('-'.repeat(60));
    state.questions.forEach((q, i) => {
      const comp = state.competencies.find((c) => c.id === q.competencyId);
      lines.push(`\n${i + 1}. ${q.text}`);
      lines.push(`   Type: ${q.type} | Competency: ${comp?.name} | Time: ${q.timeAllocation} min`);
    });

    // Agenda
    lines.push('\n\nINTERVIEW AGENDA');
    lines.push('-'.repeat(60));
    state.agenda.forEach((a) => {
      lines.push(`\n${a.timeAllocation} - ${a.activity}`);
      lines.push(`   ${a.purpose}`);
    });

    // Rubric
    lines.push('\n\nEVALUATION RUBRIC');
    lines.push('-'.repeat(60));
    state.rubric.forEach((r) => {
      lines.push(`\n${r.competencyName} (Weight: ${r.weight}/5)`);
      r.levels.forEach((level) => {
        lines.push(`\n  ${level.level.toUpperCase()}: ${level.description}`);
        level.indicators.forEach((ind) => lines.push(`    - ${ind}`));
      });
      if (r.nonSignals && r.nonSignals.length > 0) {
        lines.push(`  Non-signals: ${r.nonSignals.join(', ')}`);
      }
    });

    return lines.join('\n');
  };

  const generateMarkdown = () => {
    const lines: string[] = [];
    lines.push('# Interview Guide\n');
    lines.push(`*Generated on ${new Date().toLocaleDateString()}*\n`);
    lines.push(`**Duration:** ${state.duration} minutes\n`);

    // Interview Focus (if specified)
    if (state.interviewType || state.interviewFocus) {
      lines.push('\n## Interview Focus\n');
      if (state.interviewType) {
        lines.push(`**Type:** ${state.interviewType}\n`);
      }
      if (state.interviewFocus) {
        lines.push(`**Focus:** ${state.interviewFocus}\n`);
      }
      const selectedCompetencies = state.competencies.filter((c) =>
        state.selectedCompetencyIds.includes(c.id)
      );
      lines.push(`**Assessing:** ${selectedCompetencies.map((c) => c.name).join(', ')}\n`);
    }

    lines.push('\n---\n');

    // Competencies (ALL role competencies)
    lines.push('## Competencies\n');
    state.competencies.forEach((c) => {
      lines.push(`### ${c.name} ${c.isRequired ? '(REQUIRED)' : ''}\n`);
      lines.push(`**Weight:** ${'⭐'.repeat(c.weight)}${'☆'.repeat(5 - c.weight)} (${c.weight}/5)\n`);
      lines.push(`${c.description}\n`);
    });

    // Questions
    lines.push('## Interview Questions\n');
    state.questions.forEach((q, i) => {
      const comp = state.competencies.find((c) => c.id === q.competencyId);
      lines.push(`### ${i + 1}. ${q.text}\n`);
      lines.push(`- **Type:** ${q.type}`);
      lines.push(`- **Competency:** ${comp?.name}`);
      lines.push(`- **Time:** ${q.timeAllocation} minutes\n`);
    });

    // Agenda
    lines.push('## Interview Agenda\n');
    state.agenda.forEach((a) => {
      lines.push(`### ${a.activity} • ${a.timeAllocation}\n`);
      lines.push(`${a.purpose}\n`);
    });

    // Rubric
    lines.push('## Evaluation Rubric\n');
    state.rubric.forEach((r) => {
      lines.push(`### ${r.competencyName}\n`);
      lines.push(`**Weight:** ${r.weight}/5\n`);
      r.levels.forEach((level) => {
        lines.push(`**${level.level.toUpperCase()}:** ${level.description}\n`);
        level.indicators.forEach((ind) => lines.push(`- ${ind}`));
        lines.push('');
      });
      if (r.nonSignals && r.nonSignals.length > 0) {
        lines.push(`*Non-signals: ${r.nonSignals.join(', ')}*\n`);
      }
    });

    lines.push('\n---\n*Generated with Rubrics AI*');
    return lines.join('\n');
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">INTERVIEW GUIDE COMPLETE</h2>
        <p className="text-sm opacity-70">
          Your evidence-based structured interview guide is ready. Export, print, or start
          over.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold">{state.competencies.length}</div>
          <div className="text-xs opacity-50 mt-1">COMPETENCIES</div>
        </div>
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold">{state.questions.length}</div>
          <div className="text-xs opacity-50 mt-1">QUESTIONS</div>
        </div>
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold">{state.duration}</div>
          <div className="text-xs opacity-50 mt-1">MINUTES</div>
        </div>
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold">{state.rubric.length}</div>
          <div className="text-xs opacity-50 mt-1">RUBRIC CRITERIA</div>
        </div>
      </div>

      {/* Preview */}
      <div className="border-2 border-black mb-8 max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="text-xs font-bold mb-4">PREVIEW</div>
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed opacity-70">
            {generatePlainText()}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button
          onClick={handleCopy}
          className="border-2 border-black px-6 py-4 text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          COPY TEXT
        </button>
        <button
          onClick={handleDownload}
          className="border-2 border-black px-6 py-4 text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          DOWNLOAD MD
        </button>
        <button
          onClick={handlePrint}
          className="border-2 border-black px-6 py-4 text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          PRINT
        </button>
        <button
          onClick={reset}
          className="border-2 border-black px-6 py-4 text-sm font-bold bg-black text-white hover:bg-gray-900 transition-colors"
        >
          START OVER
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevStep}
          className="border-2 border-black px-8 py-4 text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          ← BACK
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 border-2 border-black bg-white p-4 shadow-lg">
          <div className="text-sm font-bold">✓ COPIED TO CLIPBOARD</div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-16 border-t border-black pt-8">
        <h3 className="text-xs font-bold mb-3">USING YOUR INTERVIEW GUIDE</h3>
        <div className="text-xs opacity-70 leading-relaxed space-y-2">
          <p>
            <strong>Before the interview:</strong> Send the agenda to the candidate 24 hours
            in advance. Print the rubric for note-taking.
          </p>
          <p>
            <strong>During the interview:</strong> Follow the agenda strictly. Take objective
            notes on what the candidate says, not your reactions. Use the rubric to guide
            evidence collection.
          </p>
          <p>
            <strong>After the interview:</strong> Score each competency using the rubric
            levels. Compare notes with other interviewers. Make hiring decisions based on
            rubric scores, not gut feelings.
          </p>
        </div>
      </div>
    </div>
  );
}
