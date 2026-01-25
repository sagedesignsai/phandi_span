import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCareerProfile, updateCareerProfile, deleteCareerProfile } from '@/lib/supabase/career-profiles-client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log('Fetching profile:', id, 'for user:', user.id);
    
    const { data, error } = await supabase
      .from('career_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', id)
      .single();

    console.log('Query result:', { data, error });

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Profile not found - checking if it exists at all');
        // Check if profile exists for any user
        const { data: anyProfile } = await supabase
          .from('career_profiles')
          .select('*')
          .eq('id', id)
          .single();
        console.log('Profile exists for any user:', anyProfile);
        
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Error fetching career profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career profile' },
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

    const profile = await updateCareerProfile(user.id, id, body);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating career profile:', error);
    return NextResponse.json(
      { error: 'Failed to update career profile' },
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
    await deleteCareerProfile(user.id, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting career profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete career profile' },
      { status: 500 }
    );
  }
}
