import { InterviewPreparation } from './types';

export async function copyToClipboard(results: InterviewPreparation): Promise<void> {
  const html = generateRichHTML(results);
  const plainText = generatePlainText(results);

  try {
    // Modern Clipboard API with rich HTML
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
      }),
    ]);
  } catch (error) {
    // Fallback to plain text only if rich HTML fails
    await navigator.clipboard.writeText(plainText);
  }
}

function generateRichHTML(results: InterviewPreparation): string {
  const parts: string[] = [];

  // Document header with styling
  parts.push(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1C1917; max-width: 800px; margin: 0 auto; }
    h1 { font-family: Georgia, serif; font-size: 32px; color: #0F172A; margin-bottom: 8px; }
    h2 { font-family: Georgia, serif; font-size: 24px; color: #0F172A; margin-top: 32px; margin-bottom: 16px; border-bottom: 2px solid #E7E5E4; padding-bottom: 8px; }
    h3 { font-size: 18px; color: #0F172A; margin-top: 24px; margin-bottom: 8px; }
    p { margin: 8px 0; color: #57534E; }
    ul { margin: 8px 0; padding-left: 24px; }
    li { margin: 4px 0; color: #57534E; }
    .meta { color: #A8A29E; font-size: 14px; margin-bottom: 24px; }
    .time-badge { display: inline-block; background: #FEF3C7; color: #D4AF37; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 600; margin-left: 8px; }
    .weight { color: #D4AF37; font-size: 18px; }
    .purpose-label { font-weight: 600; color: #0F172A; }
    .guidelines-header { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #A8A29E; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
  </style>
</head>
<body>
`);

  // Title
  parts.push(`<h1>Interview Preparation Guide</h1>`);
  parts.push(`<p class="meta">Generated on ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}</p>`);

  // Interview Agenda
  parts.push(`<h2>Interview Agenda</h2>`);
  results.agenda.forEach((item) => {
    parts.push(`<h3>${item.activity}<span class="time-badge">${item.timeAllocation}</span></h3>`);
    parts.push(`<p><span class="purpose-label">Purpose:</span> ${item.purpose}</p>`);
  });

  // Evaluation Rubric
  parts.push(`<h2>Evaluation Rubric</h2>`);
  results.rubric.forEach((criterion, index) => {
    parts.push(`<h3>${index + 1}. ${criterion.criterion}</h3>`);
    parts.push(`<p><span class="weight">${'★'.repeat(criterion.weight)}${'☆'.repeat(5 - criterion.weight)}</span> <span class="meta">(Weight: ${criterion.weight}/5)</span></p>`);
    parts.push(`<p>${criterion.description}</p>`);
    parts.push(`<p class="guidelines-header">Evaluation Guidelines</p>`);
    parts.push(`<ul>`);
    criterion.evaluationGuidelines.forEach((guideline) => {
      parts.push(`<li>${guideline}</li>`);
    });
    parts.push(`</ul>`);
  });

  parts.push(`</body></html>`);

  return parts.join('\n');
}

function generatePlainText(results: InterviewPreparation): string {
  const lines: string[] = [];

  // Title
  lines.push('INTERVIEW PREPARATION GUIDE');
  lines.push('='.repeat(50));
  lines.push(`Generated on ${new Date().toLocaleDateString()}`);
  lines.push('');

  // Interview Agenda
  lines.push('INTERVIEW AGENDA');
  lines.push('-'.repeat(50));
  results.agenda.forEach((item) => {
    lines.push(`\n${item.activity} (${item.timeAllocation})`);
    lines.push(`Purpose: ${item.purpose}`);
  });

  lines.push('');
  lines.push('');

  // Evaluation Rubric
  lines.push('EVALUATION RUBRIC');
  lines.push('-'.repeat(50));
  results.rubric.forEach((criterion, index) => {
    lines.push(`\n${index + 1}. ${criterion.criterion}`);
    lines.push(`Weight: ${'★'.repeat(criterion.weight)}${'☆'.repeat(5 - criterion.weight)} (${criterion.weight}/5)`);
    lines.push(`Description: ${criterion.description}`);
    lines.push(`\nEvaluation Guidelines:`);
    criterion.evaluationGuidelines.forEach((guideline) => {
      lines.push(`  • ${guideline}`);
    });
  });

  return lines.join('\n');
}
