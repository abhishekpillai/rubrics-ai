import { NextRequest, NextResponse } from 'next/server';
import { extractCompetencies } from '@/lib/llm';
import { ModelQuality } from '@/lib/types';

interface ExtractRequest {
  jobDescription: string;
  modelQuality?: ModelQuality;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtractRequest = await request.json();

    // Validate input
    if (!body.jobDescription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description is required',
        },
        { status: 400 }
      );
    }

    if (body.jobDescription.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description must be at least 100 characters',
        },
        { status: 400 }
      );
    }

    const quality: ModelQuality = body.modelQuality || 'standard';

    // Extract competencies using LLM
    const { data, model } = await extractCompetencies(
      body.jobDescription,
      quality
    );

    // Validate we got 3-5 competencies
    if (data.length < 3 || data.length > 5) {
      console.warn(`LLM returned ${data.length} competencies, expected 3-5`);
    }

    return NextResponse.json({
      success: true,
      data,
      model,
    });
  } catch (error) {
    console.error('Error extracting competencies:', error);

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
