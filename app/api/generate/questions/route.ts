import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/llm';
import { Competency, InterviewDuration, ModelQuality } from '@/lib/types';

interface GenerateQuestionsRequest {
  competencies: Competency[];
  duration: InterviewDuration;
  modelQuality?: ModelQuality;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await request.json();

    // Validate input
    if (!body.competencies || body.competencies.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one competency is required',
        },
        { status: 400 }
      );
    }

    if (body.competencies.length < 3 || body.competencies.length > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must have 3-5 competencies',
        },
        { status: 400 }
      );
    }

    if (!body.duration || ![30, 45, 60].includes(body.duration)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid duration (30, 45, or 60 minutes) is required',
        },
        { status: 400 }
      );
    }

    const quality: ModelQuality = body.modelQuality || 'standard';

    // Generate questions using LLM
    const { data, model } = await generateQuestions(
      body.competencies,
      body.duration,
      quality
    );

    // Validate time allocation fits within duration
    const totalQuestionTime = data.reduce((sum, q) => sum + q.timeAllocation, 0);
    const maxAllowedTime = body.duration - 10; // Leave 10 min for intro/outro

    if (totalQuestionTime > maxAllowedTime) {
      console.warn(
        `Generated questions total ${totalQuestionTime} min, exceeds budget of ${maxAllowedTime} min`
      );
    }

    return NextResponse.json({
      success: true,
      data,
      model,
    });
  } catch (error) {
    console.error('Error generating questions:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
