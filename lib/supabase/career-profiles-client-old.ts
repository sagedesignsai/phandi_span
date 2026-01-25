import { createClient } from './client';
import type { CareerProfileContext } from '@/lib/models/career-profile';
import { careerProfileContextSchema } from '@/lib/models/career-profile';

export async function getCareerProfile(
  userId: string,
  resumeId: string
): Promise<CareerProfileContext | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('career_profiles')
    .select('profile_data')
    .eq('user_id', userId)
    .eq('resume_id', resumeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No profile found
    }
    throw error;
  }

  return careerProfileContextSchema.parse(data.profile_data);
}

export async function saveCareerProfile(
  userId: string,
  resumeId: string,
  profileData: CareerProfileContext
): Promise<CareerProfileContext> {
  const supabase = createClient();

  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('career_profiles')
    .upsert({
      user_id: userId,
      resume_id: resumeId,
      profile_data: profileData,
      updated_at: now,
    })
    .select('profile_data')
    .single();

  if (error) {
    throw error;
  }

  return careerProfileContextSchema.parse(data.profile_data);
}

export async function deleteCareerProfile(
  userId: string,
  resumeId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('career_profiles')
    .delete()
    .eq('user_id', userId)
    .eq('resume_id', resumeId);

  if (error) {
    throw error;
  }
}
