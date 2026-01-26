-- Migration: Merge Job Preferences into Career Profile Context
-- This consolidates job search preferences into the career profile context

-- Update existing career_profile_contexts to include jobSearch structure
UPDATE career_profile_contexts
SET context_data = jsonb_set(
  COALESCE(context_data, '{}'::jsonb),
  '{jobSearch}',
  jsonb_build_object(
    'jobTypes', '["full-time"]'::jsonb,
    'industries', '[]'::jsonb,
    'locations', '[]'::jsonb,
    'technicalSkills', '[]'::jsonb,
    'preferredSources', '["indeed", "linkedin"]'::jsonb
  ),
  true
)
WHERE context_data IS NULL OR NOT (context_data ? 'jobSearch');

-- Note: job_preferences table will be deprecated but kept for now
-- Manual migration of existing job_preferences data should be done via application code
