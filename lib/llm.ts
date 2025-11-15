import { MODELS, ModelQuality, AgendaItem, RubricCriterion, InterviewDuration } from './types';

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

export async function generateAgenda(
  jobDescription: string,
  interviewSpecifics: string,
  duration: InterviewDuration,
  quality: ModelQuality = 'standard'
): Promise<{ data: AgendaItem[]; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = MODELS[quality];

  const systemPrompt = `You are an expert interview preparation assistant. Your task is to generate a structured interview agenda with time allocations.

Provide your response as a valid JSON object with this exact structure:
{
  "agenda": [
    {
      "timeAllocation": "5 minutes",
      "activity": "Activity name",
      "purpose": "Why this activity matters"
    }
  ]
}`;

  const userPrompt = `Generate an interview agenda for the following position:

JOB DESCRIPTION:
${jobDescription}

INTERVIEW SPECIFICS:
${interviewSpecifics}

INTERVIEW DURATION:
${duration} minutes

IMPORTANT: The agenda must fit within the ${duration}-minute time limit. Ensure all time allocations add up to approximately ${duration} minutes total.

Please provide a structured interview agenda tailored to this specific role, interview focus, and time constraint.`;

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

    const parsedData: { agenda: AgendaItem[] } = JSON.parse(content);

    return {
      data: parsedData.agenda,
      model: data.model,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON');
    }
    throw error;
  }
}

export async function generateRubric(
  jobDescription: string,
  interviewSpecifics: string,
  quality: ModelQuality = 'standard'
): Promise<{ data: RubricCriterion[]; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = MODELS[quality];

  const systemPrompt = `You are an expert interview preparation assistant. Your task is to generate a detailed evaluation rubric with specific criteria.

Provide your response as a valid JSON object with this exact structure:
{
  "rubric": [
    {
      "criterion": "Criterion name",
      "description": "What to evaluate",
      "weight": 3,
      "evaluationGuidelines": ["Guideline 1", "Guideline 2"]
    }
  ]
}

IMPORTANT: Limit the rubric to a MAXIMUM of 5 criteria. Focus on the most important evaluation areas.
Ensure weights are on a 1-5 scale where 5 is most important.`;

  const userPrompt = `Generate an evaluation rubric for the following position:

JOB DESCRIPTION:
${jobDescription}

INTERVIEW SPECIFICS:
${interviewSpecifics}

Please provide a focused evaluation rubric (max 5 criteria) tailored to this specific role and interview focus.`;

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

    const parsedData: { rubric: RubricCriterion[] } = JSON.parse(content);

    return {
      data: parsedData.rubric,
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
