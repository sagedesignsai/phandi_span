import { createClient } from './client';
import type { CareerProfile, Resume, CareerProfileContext } from '@/lib/models/career-profile';
import { careerProfileSchema, resumeSchema, careerProfileContextSchema } from '@/lib/models/career-profile';
import { SupabaseClient } from '@supabase/supabase-js';

// Career Profile CRUD
export async function getCareerProfiles(userId: string, client?: SupabaseClient): Promise<CareerProfile[]> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('career_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data.map(item => careerProfileSchema.parse(item));
}

export async function getCareerProfile(userId: string, profileId: string, client?: SupabaseClient): Promise<CareerProfile | null> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('career_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('id', profileId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return careerProfileSchema.parse(data);
}

export async function createCareerProfile(userId: string, profileData: Omit<CareerProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>, client?: SupabaseClient): Promise<CareerProfile> {
  const supabase = client || createClient();

  // Debug: Check current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('Current user in createCareerProfile:', user?.id, 'Expected:', userId);

  const { data, error } = await supabase
    .from('career_profiles')
    .insert({
      user_id: userId,
      ...profileData,
    })
    .select()
    .single();

  if (error) {
    console.error('Insert error:', error);
    throw error;
  }

  return careerProfileSchema.parse(data);
}

export async function updateCareerProfile(userId: string, profileId: string, updates: Partial<CareerProfile>, client?: SupabaseClient): Promise<CareerProfile> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('career_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('id', profileId)
    .select()
    .single();

  if (error) throw error;
  return careerProfileSchema.parse(data);
}

export async function deleteCareerProfile(userId: string, profileId: string, client?: SupabaseClient): Promise<void> {
  const supabase = client || createClient();

  const { error } = await supabase
    .from('career_profiles')
    .delete()
    .eq('user_id', userId)
    .eq('id', profileId);

  if (error) throw error;
}

// Resume CRUD
export async function getResumes(profileId: string, client?: SupabaseClient): Promise<Resume[]> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('career_profile_id', profileId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data.map(item => resumeSchema.parse(item));
}

export async function getResume(profileId: string, resumeId: string, client?: SupabaseClient): Promise<Resume | null> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('career_profile_id', profileId)
    .eq('id', resumeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return resumeSchema.parse(data);
}

export async function createResume(profileId: string, resumeData: Omit<Resume, 'id' | 'career_profile_id' | 'created_at' | 'updated_at'>, client?: SupabaseClient): Promise<Resume> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      career_profile_id: profileId,
      ...resumeData,
    })
    .select()
    .single();

  if (error) throw error;
  return resumeSchema.parse(data);
}

export async function updateResume(profileId: string, resumeId: string, updates: Partial<Resume>, client?: SupabaseClient): Promise<Resume> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('resumes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('career_profile_id', profileId)
    .eq('id', resumeId)
    .select()
    .single();

  if (error) throw error;
  return resumeSchema.parse(data);
}

export async function deleteResume(profileId: string, resumeId: string, client?: SupabaseClient): Promise<void> {
  const supabase = client || createClient();

  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('career_profile_id', profileId)
    .eq('id', resumeId);

  if (error) throw error;
}

// Career Profile Context CRUD
export async function getCareerProfileContext(profileId: string, client?: SupabaseClient): Promise<CareerProfileContext | null> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('career_profile_contexts')
    .select('*')
    .eq('career_profile_id', profileId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return careerProfileContextSchema.parse(data);
}

export async function saveCareerProfileContext(profileId: string, contextData: any, client?: SupabaseClient): Promise<CareerProfileContext> {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from('career_profile_contexts')
    .upsert({
      career_profile_id: profileId,
      context_data: contextData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return careerProfileContextSchema.parse(data);
}
