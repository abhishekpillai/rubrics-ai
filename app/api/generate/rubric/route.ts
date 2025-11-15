import { NextRequest, NextResponse } from 'next/server';
import { generateRubric } from '@/lib/llm';
import { InterviewInput, ModelQuality } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: InterviewInput = await request.json();

    // Validate input
    if (!body.jobDescription || !body.interviewSpecifics) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description and interview specifics are required',
        },
        { status: 400 }
      );
    }

    if (body.jobDescription.length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description must be at least 20 characters',
        },
        { status: 400 }
      );
    }

    if (body.interviewSpecifics.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Interview specifics must be at least 10 characters',
        },
        { status: 400 }
      );
    }

    const quality: ModelQuality = body.modelQuality || 'standard';

    // Generate rubric using LLM
    const { data, model } = await generateRubric(
      body.jobDescription,
      body.interviewSpecifics,
      quality
    );

    return NextResponse.json({
      success: true,
      data,
      model,
    });
  } catch (error) {
    console.error('Error generating interview rubric:', error);

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
