import { NextResponse } from 'next/server';
import { getJobs, saveJob } from '@/lib/supabase/jobs-client';
import { jobSchema } from '@/lib/models/job';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source') || undefined;
    const location = searchParams.get('location') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const jobs = await getJobs({
      source,
      location,
      limit,
      offset,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch jobs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = jobSchema.parse(body);

    const job = await saveJob(validatedData);

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      {
        error: 'Failed to create job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

