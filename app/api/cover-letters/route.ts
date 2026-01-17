import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCoverLetter, getCoverLetter } from '@/lib/supabase/jobs-client';
import { createCoverLetterAgent } from '@/lib/ai/cover-letter-agent';
import { getJob } from '@/lib/supabase/jobs-client';
import { getResume } from '@/lib/storage/resume-store';

export const maxDuration = 30;

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

    const { jobId, resumeId, template = 'professional' } = await req.json();

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

    // For MVP, we'll use a simplified approach
    // In production, you'd use the AI agent with proper streaming
    // For now, we'll generate a basic cover letter
    const coverLetterContent = await generateCoverLetterContent(job, resume, template);

    // Save cover letter
    const coverLetter = await createCoverLetter({
      user_id: user.id,
      job_id: jobId,
      resume_id: resumeId,
      content: coverLetterContent,
      template,
    });

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate cover letter',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate cover letter content (simplified for MVP)
 * In production, this would use the AI agent
 */
async function generateCoverLetterContent(
  job: any,
  resume: any,
  template: string
): Promise<string> {
  const name = resume.personalInfo.name || 'Candidate';
  const email = resume.personalInfo.email || '';
  const phone = resume.personalInfo.phone || '';

  // Extract key information
  const skillsSection = resume.sections.find((s: any) => s.type === 'skills');
  const skills = skillsSection?.items
    .map((item: any) => (typeof item === 'object' ? item.name : item))
    .slice(0, 5)
    .join(', ') || 'various technical and professional skills';

  const experienceSection = resume.sections.find((s: any) => s.type === 'experience');
  const latestExp = experienceSection?.items[0];
  const position = latestExp?.position || 'professional';
  const companyName = latestExp?.company || 'various companies';

  // Generate based on template
  if (template === 'concise') {
    return `Dear Hiring Manager,

I am writing to apply for the ${job.title} position at ${job.company || 'your company'}. With my experience in ${position} and expertise in ${skills}, I am confident I can contribute to your team.

I would welcome the opportunity to discuss how my background aligns with your needs.

Sincerely,
${name}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}`;
  }

  // Professional template (default)
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company || 'your company'}. With my background in ${position} and experience at ${companyName}, I am confident that I would be a valuable addition to your team.

My expertise includes ${skills}, which align well with the requirements for this role. I am particularly drawn to this opportunity because it allows me to leverage my experience while contributing to ${job.company || 'your company'}'s continued success.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team. Thank you for considering my application.

Sincerely,
${name}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}`;
}

