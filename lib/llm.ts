import { MODELS, ModelQuality, InterviewPreparation } from './types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  model: string;
}

export async function generateInterviewPreparation(
  jobDescription: string,
  interviewSpecifics: string,
  quality: ModelQuality = 'standard'
): Promise<{ data: InterviewPreparation; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = MODELS[quality];

  const systemPrompt = `You are an expert interview preparation assistant. Your task is to help interviewers prepare for conducting interviews by generating:
1. A structured interview agenda with time allocations
2. A detailed evaluation rubric with specific criteria
3. Key competencies to assess
4. Red flags to watch for

Provide your response as a valid JSON object with this exact structure:
{
  "agenda": [
    {
      "timeAllocation": "5 minutes",
      "activity": "Activity name",
      "purpose": "Why this activity matters"
    }
  ],
  "rubric": [
    {
      "criterion": "Criterion name",
      "description": "What to evaluate",
      "weight": 3,
      "evaluationGuidelines": ["Guideline 1", "Guideline 2"]
    }
  ],
  "keyCompetencies": ["Competency 1", "Competency 2"],
  "redFlags": ["Red flag 1", "Red flag 2"]
}

Ensure weights are on a 1-5 scale where 5 is most important.`;

  const userPrompt = `Generate an interview preparation guide for the following position:

JOB DESCRIPTION:
${jobDescription}

INTERVIEW SPECIFICS:
${interviewSpecifics}

Please provide a comprehensive interview agenda and evaluation rubric tailored to this specific role and interview focus.`;

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Rubrics AI - Interview Prep',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      );
    }

    const data: OpenRouterResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenRouter');
    }

    const parsedData: InterviewPreparation = JSON.parse(content);

    return {
      data: parsedData,
      model: data.model,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON');
    }
    throw error;
  }
}

export function getModelInfo(quality: ModelQuality) {
  const modelMap = {
    standard: {
      name: 'Standard Quality',
      description: 'Fast generation with reliable results for most interviews',
      pricing: '$0.25 per generation',
    },
    enhanced: {
      name: 'Premium Quality',
      description: 'Advanced reasoning for complex roles and nuanced evaluations',
      pricing: '$3 per generation',
    },
  };

  return modelMap[quality];
}
