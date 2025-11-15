import {
  MODELS,
  ModelQuality,
  AgendaItem,
  RubricCriterion,
  LegacyRubricCriterion,
  InterviewDuration,
  Competency,
  Question,
  RubricLevel
} from './types';

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

// New competency-first workflow functions

export async function extractCompetencies(
  jobDescription: string,
  quality: ModelQuality = 'standard'
): Promise<{ data: Competency[]; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = MODELS[quality];

  const systemPrompt = `You are an expert in evidence-based hiring practices. Your task is to extract 3-5 critical competencies from a job description.

IMPORTANT GUIDELINES:
- Focus on JOB-RELEVANT competencies only, not vague "culture fit"
- Use behavioral language that describes observable skills/abilities
- Each competency should map to specific work outcomes
- Avoid bias-prone attributes like "communication style" or "executive presence"
- Prioritize competencies that predict job performance

Provide your response as a valid JSON object with this exact structure:
{
  "competencies": [
    {
      "id": "comp-1",
      "name": "Competency name (2-4 words)",
      "description": "Behavioral description of what this competency looks like in practice (1-2 sentences)",
      "weight": 4,
      "isRequired": true
    }
  ]
}

Use weights 1-5 where 5 is most critical. Mark 1-2 competencies as isRequired:true (must-haves).`;

  const userPrompt = `Extract the 3-5 most critical competencies from this job description:

JOB DESCRIPTION:
${jobDescription}

Focus on competencies that are:
1. Directly tied to the role's core responsibilities
2. Observable and measurable through interview questions
3. Predictive of success in this specific position`;

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
        'X-Title': 'Rubrics AI - Competency Extraction',
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

    const parsedData: { competencies: Competency[] } = JSON.parse(content);

    return {
      data: parsedData.competencies,
      model: data.model,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON');
    }
    throw error;
  }
}

export async function generateQuestions(
  competencies: Competency[],
  duration: InterviewDuration,
  quality: ModelQuality = 'standard'
): Promise<{ data: Question[]; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = MODELS[quality];

  const systemPrompt = `You are an expert in evidence-based structured interviewing. Your task is to generate behavioral and situational interview questions for specific competencies.

IMPORTANT GUIDELINES (Research-Backed):
- Generate 2-3 questions per competency (mix of behavioral and situational)
- Behavioral questions: "Tell me about a time when..." (past behavior)
- Situational questions: "What would you do if..." (hypothetical scenarios)
- NO brainteasers, puzzles, or trivia questions
- Each question must directly assess the competency it's mapped to
- Questions should elicit observable, measurable responses
- Allocate time based on competency weight and interview duration

Provide your response as a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": "q-1",
      "text": "Tell me about a time when you...",
      "type": "behavioral",
      "competencyId": "comp-1",
      "timeAllocation": 8
    }
  ]
}

Time allocation guidelines:
- 30 min interview: ~3-4 questions total (5-8 min each)
- 45 min interview: ~5-6 questions total (6-9 min each)
- 60 min interview: ~7-9 questions total (6-10 min each)
- Always leave 5 min for intro and 5-10 min for candidate questions
- Allocate more time to questions for high-weight/required competencies`;

  const competenciesJson = JSON.stringify(
    competencies.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      weight: c.weight,
      isRequired: c.isRequired,
    }))
  );

  const userPrompt = `Generate interview questions for these competencies:

COMPETENCIES:
${competenciesJson}

INTERVIEW DURATION: ${duration} minutes

Create a balanced set of behavioral and situational questions that:
1. Cover all competencies proportionally to their weights
2. Fit within the time budget (leaving 10-15 min for intro/outro)
3. Start with 1-2 easier questions to build rapport
4. Include follow-up prompts where appropriate`;

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
        'X-Title': 'Rubrics AI - Question Generation',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8, // Slightly higher for creative question generation
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

    const parsedData: { questions: Question[] } = JSON.parse(content);

    return {
      data: parsedData.questions,
      model: data.model,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON');
    }
    throw error;
  }
}

export async function generateRubricFromCompetencies(
  competencies: Competency[],
  quality: ModelQuality = 'standard'
): Promise<{ data: RubricCriterion[]; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = MODELS[quality];

  const systemPrompt = `You are an expert in evidence-based hiring and behaviorally anchored rating scales (BARS). Your task is to create evaluation rubrics with 4-level scales for each competency.

CRITICAL REQUIREMENTS (Research-Based):
- Create 4 levels for each competency: poor, mixed, good, excellent
- Each level must have BEHAVIORAL descriptors (observable actions, not adjectives)
- Focus on WHAT the candidate does/says, not how you feel about it
- Include "non-signals" - things that should NOT influence scoring (equity focus)

Provide your response as a valid JSON object with this exact structure:
{
  "rubric": [
    {
      "id": "rubric-1",
      "competencyId": "comp-1",
      "competencyName": "Competency Name",
      "weight": 4,
      "levels": [
        {
          "level": "poor",
          "description": "Brief level summary",
          "indicators": [
            "Observable behavior 1",
            "Observable behavior 2"
          ]
        },
        {
          "level": "mixed",
          "description": "Brief level summary",
          "indicators": ["Observable behavior 1", "Observable behavior 2"]
        },
        {
          "level": "good",
          "description": "Brief level summary",
          "indicators": ["Observable behavior 1", "Observable behavior 2"]
        },
        {
          "level": "excellent",
          "description": "Brief level summary",
          "indicators": ["Observable behavior 1", "Observable behavior 2"]
        }
      ],
      "nonSignals": [
        "Accent or speech patterns",
        "Use of filler words (um, uh)",
        "Nervousness or shyness"
      ]
    }
  ]
}

NON-SIGNALS (things NOT to evaluate):
- Communication style, accent, filler words, upspeak
- Nervousness, introversion, social anxiety
- Educational pedigree (unless job-relevant)
- Years of experience (unless explicitly required)
- Any attribute not directly tied to job performance`;

  const competenciesJson = JSON.stringify(
    competencies.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      weight: c.weight,
      isRequired: c.isRequired,
    }))
  );

  const userPrompt = `Create a behaviorally anchored rubric for these competencies:

COMPETENCIES:
${competenciesJson}

For each competency:
1. Define 4 levels with OBSERVABLE behavioral indicators
2. "Poor" = does not demonstrate competency
3. "Mixed" = demonstrates some aspects but inconsistent/incomplete
4. "Good" = consistently demonstrates competency
5. "Excellent" = demonstrates mastery, goes beyond expectations
6. List 2-3 "non-signals" that should NOT influence evaluation`;

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
        'X-Title': 'Rubrics AI - Rubric Generation',
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
