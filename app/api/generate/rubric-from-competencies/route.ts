import { NextRequest, NextResponse } from 'next/server';
import { generateRubricFromCompetencies } from '@/lib/llm';
import { Competency, ModelQuality } from '@/lib/types';

interface GenerateRubricRequest {
  competencies: Competency[];
  modelQuality?: ModelQuality;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRubricRequest = await request.json();

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

    const quality: ModelQuality = body.modelQuality || 'standard';

    // Generate rubric using LLM
    const { data, model } = await generateRubricFromCompetencies(
      body.competencies,
      quality
    );

    return NextResponse.json({
      success: true,
      data,
      model,
    });
  } catch (error) {
    console.error('Error generating rubric:', error);

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
