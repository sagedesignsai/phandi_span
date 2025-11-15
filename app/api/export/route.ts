import { NextResponse } from 'next/server';
import { resumeSchema } from '@/lib/models/resume';
import type { Resume } from '@/lib/models/resume';

export async function POST(req: Request) {
  try {
    const { resume, format }: { resume: Resume; format: 'pdf' | 'html' } =
      await req.json();

    // Validate resume
    const validatedResume = resumeSchema.parse(resume);

    if (format === 'pdf') {
      // For server-side PDF generation, you would use react-pdf here
      // However, since we're using client-side generation in the MVP,
      // we'll return a message indicating client-side export should be used
      return NextResponse.json({
        message:
          'PDF export is handled client-side. Use generatePDF() from lib/utils/export.tsx',
        resume: validatedResume,
      });
    }

    if (format === 'html') {
      // HTML export can be done server-side, but for MVP we'll use client-side
      return NextResponse.json({
        message:
          'HTML export is handled client-side. Use generateHTML() from lib/utils/export.tsx',
        resume: validatedResume,
      });
    }

    return NextResponse.json(
      { error: 'Invalid format. Use "pdf" or "html"' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to export resume',
        details: error instanceof Error ? error.message : 'Validation error',
      },
      { status: 400 }
    );
  }
}

