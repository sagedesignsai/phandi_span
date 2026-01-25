import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResumes, createResume } from '@/lib/supabase/career-profiles-client';
import { resumeSchema } from '@/lib/models/career-profile';

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
    
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('career_profile_id', profileId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ resumes: data });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const resumeData = resumeSchema.omit({ 
      id: true, 
      career_profile_id: true, 
      created_at: true, 
      updated_at: true 
    }).parse(body);

    const resume = await createResume(profileId, resumeData);
    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
