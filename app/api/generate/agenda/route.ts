import { NextRequest, NextResponse } from 'next/server';
import { generateAgenda } from '@/lib/llm';
import { InterviewInput, ModelQuality } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: InterviewInput = await request.json();

    // Validate input
    if (!body.jobDescription || !body.interviewSpecifics || !body.duration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description, interview specifics, and duration are required',
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

    if (![30, 45, 60].includes(body.duration)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Interview duration must be 30, 45, or 60 minutes',
        },
        { status: 400 }
      );
    }

    const quality: ModelQuality = body.modelQuality || 'standard';

    // Generate agenda using LLM
    const { data, model } = await generateAgenda(
      body.jobDescription,
      body.interviewSpecifics,
      body.duration,
      quality
    );

    return NextResponse.json({
      success: true,
      data,
      model,
    });
  } catch (error) {
    console.error('Error generating interview agenda:', error);

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
