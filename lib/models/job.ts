import { z } from 'zod';

// Job Preferences Schema
export const jobPreferencesSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  job_types: z.array(z.string()).default(['full-time', 'part-time']),
  industries: z.array(z.string()).optional(),
  locations: z.array(z.string()).default([]),
  salary_min: z.number().int().positive().optional(),
  salary_max: z.number().int().positive().optional(),
  experience_level: z.string().optional(),
  skills: z.array(z.string()).optional(),
  preferred_sources: z.array(z.string()).default(['indeed', 'linkedin']),
  auto_apply_enabled: z.boolean().default(false),
  auto_apply_threshold: z.number().int().min(0).max(100).default(80),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type JobPreferences = z.infer<typeof jobPreferencesSchema>;

// Job Schema
export const jobSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  company: z.string().optional(),
  location: z.string().optional(),
  job_type: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  salary_range: z.string().optional(),
  source: z.string().min(1),
  source_url: z.string().url(),
  source_id: z.string().optional(),
  posted_date: z.string().optional(),
  expires_at: z.string().optional(),
  raw_data: z.record(z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Job = z.infer<typeof jobSchema>;

// Job Match Schema
export const jobMatchSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  job_id: z.string().uuid(),
  career_profile_id: z.string().uuid().optional(),
  resume_id: z.string().uuid().optional(),
  match_score: z.number().min(0).max(100),
  matched_skills: z.array(z.string()).optional(),
  missing_skills: z.array(z.string()).optional(),
  status: z.enum(['new', 'viewed', 'applied', 'rejected', 'archived']).default('new'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type JobMatch = z.infer<typeof jobMatchSchema>;

// Job Application Schema
export const jobApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  job_id: z.string().uuid(),
  job_match_id: z.string().uuid().optional(),
  career_profile_id: z.string().uuid(),
  resume_id: z.string().uuid(),
  cover_letter_id: z.string().uuid().optional(),
  status: z.enum(['applied', 'viewed', 'interview', 'rejected', 'offer', 'withdrawn']).default('applied'),
  applied_at: z.string().optional(),
  response_received_at: z.string().optional(),
  notes: z.string().optional(),
  email_sent: z.boolean().default(false),
  email_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

// Cover Letter Schema
export const coverLetterSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  job_id: z.string().uuid(),
  career_profile_id: z.string().uuid(),
  resume_id: z.string().uuid(),
  content: z.string().min(1),
  template: z.string().default('professional'),
  created_at: z.string().optional(),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

// Job Search Query Schema
export const jobSearchQuerySchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  experienceLevel: z.string().optional(),
  skills: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});

export type JobSearchQuery = z.infer<typeof jobSearchQuerySchema>;

