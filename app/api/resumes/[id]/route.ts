import { NextResponse } from 'next/server';
import { resumeSchema } from '@/lib/models/resume';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Since localStorage is client-side, we can't access it from server
    return NextResponse.json({
      message: 'Resume storage is client-side. Use getResume() from resume-store.',
      id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const validatedData = resumeSchema.parse({
      ...body,
      id, // Ensure ID matches
    });
    
    return NextResponse.json({
      success: true,
      resume: validatedData,
      message: 'Resume validated. Please save using client-side storage.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to update resume',
        details: error instanceof Error ? error.message : 'Validation error',
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    return NextResponse.json({
      success: true,
      id,
      message: 'Please delete using client-side storage (deleteResume function).',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

