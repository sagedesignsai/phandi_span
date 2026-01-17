import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserJobPreferences, saveUserJobPreferences } from '@/lib/supabase/jobs-client';
import { jobPreferencesSchema } from '@/lib/models/job';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await getUserJobPreferences(user.id);

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching job preferences:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch job preferences',
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

    const body = await req.json();
    const validatedData = jobPreferencesSchema.partial().parse(body);

    const preferences = await saveUserJobPreferences(user.id, validatedData);

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error saving job preferences:', error);
    return NextResponse.json(
      {
        error: 'Failed to save job preferences',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

