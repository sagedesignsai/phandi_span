import { listResumes, createResume } from '@/lib/storage/resume-store';
import { resumeSchema } from '@/lib/models/resume';
import type { Resume } from '@/lib/models/resume';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Note: This is a client-side storage, so we need to handle this differently
    // For MVP, we'll return a message indicating resumes are stored client-side
    // In a real app, this would query a database
    
    // Since localStorage is client-side only, we can't access it from the server
    // We'll need to handle this on the client side
    return NextResponse.json({
      message: 'Resumes are stored client-side. Use the client-side functions directly.',
      resumes: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the resume data
    const validatedData = resumeSchema.parse(body);
    
    // Since we're using localStorage, we can't create from server
    // Return the validated data for client to save
    return NextResponse.json({
      success: true,
      resume: validatedData,
      message: 'Resume validated. Please save using client-side storage.',
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to create resume',
        details: error instanceof Error ? error.message : 'Validation error',
      },
      { status: 400 }
    );
  }
}

