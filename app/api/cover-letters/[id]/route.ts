import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCoverLetter, updateCoverLetter, deleteCoverLetter as deleteCoverLetterDb } from '@/lib/supabase/jobs-client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const coverLetter = await getCoverLetter(id);

    if (!coverLetter) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    if (coverLetter.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover letter' },
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await getCoverLetter(id);
    if (!existing) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await updateCoverLetter(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to update cover letter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await getCoverLetter(id);
    if (!existing) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteCoverLetterDb(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to delete cover letter' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await getCoverLetter(id);
    if (!existing) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await updateCoverLetter(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error patching cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to patch cover letter' },
      { status: 500 }
    );
  }
}
