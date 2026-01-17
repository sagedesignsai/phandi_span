import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateJobApplication } from '@/lib/supabase/jobs-client';
import { jobApplicationSchema } from '@/lib/models/job';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get application from database
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(jobApplicationSchema.parse(data));
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = jobApplicationSchema.partial().parse(body);

    const application = await updateJobApplication(id, validatedData);

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      {
        error: 'Failed to update application',
        details: error instanceof Error ? error.message : 'Unknown error',
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
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Update status to 'withdrawn' instead of deleting
    const application = await updateJobApplication(id, {
      status: 'withdrawn',
    });

    return NextResponse.json({
      message: 'Application withdrawn successfully',
      application,
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      {
        error: 'Failed to withdraw application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

