import { NextRequest, NextResponse } from 'next/server';
import { getCoverLetter as getServerCoverLetter } from '@/lib/supabase/jobs-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { coverLetterId: string } }
) {
  try {
    const { coverLetterId } = params;
    
    const coverLetter = await getServerCoverLetter(coverLetterId);
    
    if (!coverLetter) {
      return NextResponse.json(
        { error: 'Cover letter not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: coverLetter });
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover letter' },
      { status: 500 }
    );
  }
}
