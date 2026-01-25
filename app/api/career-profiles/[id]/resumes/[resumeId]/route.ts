import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResume, updateResume, deleteResume } from '@/lib/supabase/career-profiles-client';
import { resumeSchema } from '@/lib/models/career-profile';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; resumeId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: profileId, resumeId } = await params;

    const resume = await getResume(profileId, resumeId, supabase);

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; resumeId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: profileId, resumeId } = await params;
    const body = await req.json();

    // Only allow updating specific fields
    const updates = resumeSchema.pick({
      title: true,
      content: true,
      template: true
    }).partial().parse(body);

    const resume = await updateResume(profileId, resumeId, updates, supabase);
    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; resumeId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: profileId, resumeId } = await params;

    await deleteResume(profileId, resumeId, supabase);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
