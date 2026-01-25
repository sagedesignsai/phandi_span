import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getJobMatches, saveJobMatch } from '@/lib/supabase/jobs-client';
import { calculateMatchScore } from '@/lib/services/jobs/job-matcher';
import { getJobs } from '@/lib/supabase/jobs-client';
import { getUserJobPreferences } from '@/lib/supabase/jobs-client';
import { getResume } from '@/lib/storage/resume-store';
import { jobMatchSchema } from '@/lib/models/job';

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
    const minScore = searchParams.get('minScore')
      ? parseFloat(searchParams.get('minScore')!)
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const matches = await getJobMatches(user.id, {
      resumeId,
      status,
      minScore,
      limit,
      offset,
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching job matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch job matches',
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

    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: 'resumeId is required' },
        { status: 400 }
      );
    }

    // Get user preferences and resume
    const preferences = await getUserJobPreferences(user.id);
    const resume = getResume(resumeId);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Get all jobs (or filter by preferences)
    const sources = preferences?.preferred_sources || ['indeed', 'linkedin'];
    const jobs = await getJobs({
      limit: 100, // Match up to 100 jobs
    });

    console.log(`Found ${jobs.length} jobs to match against`);

    if (jobs.length === 0) {
      return NextResponse.json({
        message: 'No jobs available to match against. Try scraping jobs first.',
        matches: [],
        suggestion: 'Use the scrape endpoint to fetch jobs from job boards',
      });
    }

    // Calculate matches for each job
    const matches = [];
    let processedJobs = 0;
    let skippedJobs = 0;
    
    for (const job of jobs) {
      try {
        if (sources.length > 0 && !sources.includes(job.source)) {
          skippedJobs++;
          continue; // Skip jobs from non-preferred sources
        }

        const matchResult = calculateMatchScore(job, resume, preferences);

        if (matchResult.score > 0) {
          // Save or update match
          const match = await saveJobMatch({
            user_id: user.id,
            job_id: job.id!,
            resume_id: resumeId,
            match_score: matchResult.score,
            matched_skills: matchResult.matchedSkills,
            missing_skills: matchResult.missingSkills,
            status: 'new',
          });

          matches.push(match);
        }
        processedJobs++;
      } catch (jobError) {
        console.error(`Error processing job ${job.id}:`, jobError);
        // Continue with other jobs
      }
    }

    console.log(`Processed ${processedJobs} jobs, skipped ${skippedJobs}, found ${matches.length} matches`);

    return NextResponse.json({
      message: `Matched ${matches.length} jobs`,
      matches,
    });
  } catch (error) {
    console.error('Error creating job matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to create job matches',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
