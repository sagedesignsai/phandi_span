import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCareerProfileContext, saveCareerProfileContext } from '@/lib/supabase/career-profiles-client';

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

    const { id: profileId } = await params;
    const context = await getCareerProfileContext(profileId, supabase);

    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    return NextResponse.json({ context });
  } catch (error) {
    console.error('Error fetching context:', error);
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 });
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

    const { id: profileId } = await params;
    const body = await req.json();

    const context = await saveCareerProfileContext(profileId, body, supabase);
    return NextResponse.json({ context });
  } catch (error) {
    console.error('Error saving context:', error);
    return NextResponse.json({ error: 'Failed to save context' }, { status: 500 });
  }
}
