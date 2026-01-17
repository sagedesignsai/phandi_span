import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getJobApplications, createJobApplication } from '@/lib/supabase/jobs-client';
import { applyToJob } from '@/lib/services/jobs/application-service';
import { generateCoverLetterSimple } from '@/lib/services/jobs/application-service';
import { getJob } from '@/lib/supabase/jobs-client';
import { getResume } from '@/lib/storage/resume-store';
import { createCoverLetter } from '@/lib/supabase/jobs-client';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('resumeId') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const applications = await getJobApplications(user.id, {
      resumeId,
      status,
      limit,
      offset,
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch job applications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId, resumeId, autoApply = false } = await req.json();

    if (!jobId || !resumeId) {
      return NextResponse.json(
        { error: 'jobId and resumeId are required' },
        { status: 400 }
      );
    }

    // Get job and resume
    const job = await getJob(jobId);
    const resume = getResume(resumeId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Generate cover letter
    const coverLetterContent = await generateCoverLetterSimple(
      job.title,
      job.company || 'the company',
      resume
    );

    // Save cover letter
    const coverLetter = await createCoverLetter({
      user_id: user.id,
      job_id: jobId,
      resume_id: resumeId,
      content: coverLetterContent,
      template: 'professional',
    });

    // Create application (without sending email for MVP - email sending can be added later)
    const application = await createJobApplication({
      user_id: user.id,
      job_id: jobId,
      resume_id: resumeId,
      cover_letter_id: coverLetter.id,
      status: 'applied',
      email_sent: false, // Set to true when email service is fully configured
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      {
        error: 'Failed to create job application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
