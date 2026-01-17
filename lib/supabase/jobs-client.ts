import { createClient } from './server';
import type {
  JobPreferences,
  Job,
  JobMatch,
  JobApplication,
  CoverLetter,
} from '@/lib/models/job';
import {
  jobPreferencesSchema,
  jobSchema,
  jobMatchSchema,
  jobApplicationSchema,
  coverLetterSchema,
} from '@/lib/models/job';

/**
 * Get user job preferences
 */
export async function getUserJobPreferences(
  userId: string
): Promise<JobPreferences | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_job_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching job preferences:', error);
    throw error;
  }

  return jobPreferencesSchema.parse(data);
}

/**
 * Save or update user job preferences
 */
export async function saveUserJobPreferences(
  userId: string,
  preferences: Partial<JobPreferences>
): Promise<JobPreferences> {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const preferencesData = {
    ...preferences,
    user_id: userId,
    updated_at: now,
  };

  // Check if preferences exist
  const existing = await getUserJobPreferences(userId);

  let data;
  if (existing) {
    // Update existing
    const { data: updated, error } = await supabase
      .from('user_job_preferences')
      .update(preferencesData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating job preferences:', error);
      throw error;
    }
    data = updated;
  } else {
    // Create new
    const { data: created, error } = await supabase
      .from('user_job_preferences')
      .insert({
        ...preferencesData,
        created_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job preferences:', error);
      throw error;
    }
    data = created;
  }

  return jobPreferencesSchema.parse(data);
}

/**
 * Get jobs with optional filters
 */
export async function getJobs(filters?: {
  source?: string;
  location?: string;
  limit?: number;
  offset?: number;
}): Promise<Job[]> {
  const supabase = await createClient();

  let query = supabase.from('jobs').select('*');

  if (filters?.source) {
    query = query.eq('source', filters.source);
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  }

  query = query.order('posted_date', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }

  return (data || []).map((job) => jobSchema.parse(job));
}

/**
 * Get a single job by ID
 */
export async function getJob(jobId: string): Promise<Job | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching job:', error);
    throw error;
  }

  return jobSchema.parse(data);
}

/**
 * Save a job (create or update)
 */
export async function saveJob(job: Partial<Job>): Promise<Job> {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const jobData = {
    ...job,
    updated_at: now,
  };

  // Check if job exists by source_url
  if (job.source_url) {
    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('source_url', job.source_url)
      .single();

    if (existing) {
      // Update existing
      const { data: updated, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        throw error;
      }
      return jobSchema.parse(updated);
    }
  }

  // Create new
  const { data: created, error } = await supabase
    .from('jobs')
    .insert({
      ...jobData,
      created_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return jobSchema.parse(created);
}

/**
 * Get job matches for a user
 */
export async function getJobMatches(
  userId: string,
  filters?: {
    status?: string;
    minScore?: number;
    limit?: number;
    offset?: number;
    resumeId?: string;
  }
): Promise<JobMatch[]> {
  const supabase = await createClient();

  let query = supabase
    .from('job_matches')
    .select('*')
    .eq('user_id', userId);

  if (filters?.resumeId) {
    query = query.eq('resume_id', filters.resumeId);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.minScore !== undefined) {
    query = query.gte('match_score', filters.minScore);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 50) - 1
    );
  }

  query = query.order('match_score', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching job matches:', error);
    throw error;
  }

  return (data || []).map((match) => jobMatchSchema.parse(match));
}

/**
 * Save a job match
 */
export async function saveJobMatch(match: Partial<JobMatch>): Promise<JobMatch> {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const matchData = {
    ...match,
    updated_at: now,
  };

  // Check if match exists
  if (match.user_id && match.job_id) {
    const { data: existing } = await supabase
      .from('job_matches')
      .select('id')
      .eq('user_id', match.user_id)
      .eq('job_id', match.job_id)
      .single();

    if (existing) {
      // Update existing
      const { data: updated, error } = await supabase
        .from('job_matches')
        .update(matchData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job match:', error);
        throw error;
      }
      return jobMatchSchema.parse(updated);
    }
  }

  // Create new
  const { data: created, error } = await supabase
    .from('job_matches')
    .insert({
      ...matchData,
      created_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating job match:', error);
    throw error;
  }

  return jobMatchSchema.parse(created);
}

/**
 * Get job applications for a user
 */
export async function getJobApplications(
  userId: string,
  filters?: {
    status?: string;
    limit?: number;
    offset?: number;
    resumeId?: string;
  }
): Promise<JobApplication[]> {
  const supabase = await createClient();

  let query = supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId);

  if (filters?.resumeId) {
    query = query.eq('resume_id', filters.resumeId);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 50) - 1
    );
  }

  query = query.order('applied_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  return (data || []).map((app) => jobApplicationSchema.parse(app));
}

/**
 * Create a job application
 */
export async function createJobApplication(
  application: Partial<JobApplication>
): Promise<JobApplication> {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const applicationData = {
    ...application,
    applied_at: application.applied_at || now,
    created_at: now,
    updated_at: now,
  };

  const { data: created, error } = await supabase
    .from('job_applications')
    .insert(applicationData)
    .select()
    .single();

  if (error) {
    console.error('Error creating job application:', error);
    throw error;
  }

  return jobApplicationSchema.parse(created);
}

/**
 * Update a job application
 */
export async function updateJobApplication(
  id: string,
  updates: Partial<JobApplication>
): Promise<JobApplication> {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from('job_applications')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating job application:', error);
    throw error;
  }

  return jobApplicationSchema.parse(updated);
}

/**
 * Create a cover letter
 */
export async function createCoverLetter(
  coverLetter: Partial<CoverLetter>
): Promise<CoverLetter> {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const coverLetterData = {
    ...coverLetter,
    created_at: now,
  };

  const { data: created, error } = await supabase
    .from('cover_letters')
    .insert(coverLetterData)
    .select()
    .single();

  if (error) {
    console.error('Error creating cover letter:', error);
    throw error;
  }

  return coverLetterSchema.parse(created);
}

/**
 * Get a cover letter by ID
 */
export async function getCoverLetter(id: string): Promise<CoverLetter | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cover_letters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching cover letter:', error);
    throw error;
  }

  return coverLetterSchema.parse(data);
}

/**
 * Update a cover letter
 */
export async function updateCoverLetter(
  id: string,
  updates: Partial<CoverLetter>
): Promise<CoverLetter> {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from('cover_letters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating cover letter:', error);
    throw error;
  }

  return coverLetterSchema.parse(updated);
}

/**
 * Delete a cover letter
 */
export async function deleteCoverLetter(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting cover letter:', error);
    throw error;
  }
}
