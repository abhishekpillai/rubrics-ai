import { InterviewPreparation } from './types';

export function downloadAsMarkdown(results: InterviewPreparation): void {
  const markdown = generateMarkdown(results);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const filename = `interview-guide-${new Date().toISOString().split('T')[0]}.md`;
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function generateMarkdown(results: InterviewPreparation): string {
  const lines: string[] = [];

  // Title
  lines.push('# Interview Preparation Guide');
  lines.push('');
  lines.push(`*Generated on ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Interview Agenda
  lines.push('## Interview Agenda');
  lines.push('');
  results.agenda.forEach((item) => {
    lines.push(`### ${item.activity} • ${item.timeAllocation}`);
    lines.push('');
    lines.push(`**Purpose:** ${item.purpose}`);
    lines.push('');
  });

  lines.push('---');
  lines.push('');

  // Evaluation Rubric
  lines.push('## Evaluation Rubric');
  lines.push('');
  results.rubric.forEach((criterion, index) => {
    lines.push(`### ${index + 1}. ${criterion.criterion}`);
    lines.push('');
    lines.push(`**Weight:** ${'⭐'.repeat(criterion.weight)}${'☆'.repeat(5 - criterion.weight)} (${criterion.weight}/5)`);
    lines.push('');
    lines.push(`**Description:** ${criterion.description}`);
    lines.push('');
    lines.push('**Evaluation Guidelines:**');
    lines.push('');
    criterion.evaluationGuidelines.forEach((guideline) => {
      lines.push(`- ${guideline}`);
    });
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push('*Generated with Rubrics AI*');

  return lines.join('\n');
}
