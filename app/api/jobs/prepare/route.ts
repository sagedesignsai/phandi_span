import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  generateInterviewPrep, 
  analyzeSkillGap, 
  suggestCareerPath,
  researchCompany,
  getSalaryInsights 
} from '@/lib/ai/job-preparation-agent';

export const maxDuration = 60;

/**
 * POST /api/jobs/prepare
 * Generate AI-powered job preparation materials
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, resumeId, type } = body;

    if (!jobId || !resumeId) {
      return NextResponse.json(
        { error: 'jobId and resumeId are required' },
        { status: 400 }
      );
    }

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Fetch resume (from your resume storage)
    const resumeResponse = await fetch(`${req.headers.get('origin')}/api/resumes/${resumeId}`);
    if (!resumeResponse.ok) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    const resume = await resumeResponse.json();

    // Generate preparation materials based on type
    let result;
    switch (type) {
      case 'interview':
        result = await generateInterviewPrep(job, resume);
        break;
      
      case 'skill-gap':
        result = await analyzeSkillGap(job, resume);
        break;
      
      case 'career-path':
        const { data: preferences } = await supabase
          .from('user_job_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        result = await suggestCareerPath(resume, {
          industries: preferences?.industries,
          targetRoles: [],
        });
        break;
      
      case 'company-research':
        result = await researchCompany(job.company || '', job.title);
        break;
      
      case 'salary-insights':
        result = await getSalaryInsights(job, resume, job.location || 'South Africa');
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Job preparation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preparation materials' },
      { status: 500 }
    );
  }
}
