import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCareerProfiles, createCareerProfile } from '@/lib/supabase/career-profiles-client';
import { careerProfileSchema } from '@/lib/models/career-profile';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = await getCareerProfiles(user.id, supabase);
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Error fetching career profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career profiles' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const profileData = careerProfileSchema.omit({
      id: true,
      user_id: true,
      created_at: true,
      updated_at: true
    }).parse(body);

    const profile = await createCareerProfile(user.id, profileData, supabase);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error creating career profile:', error);
    return NextResponse.json(
      {
        error: 'Failed to create career profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
