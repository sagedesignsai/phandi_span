-- Migration: Update to Career Profile Architecture
-- This migration updates the schema to make Career Profiles the main entity

-- Drop existing career_profiles table if it exists (old structure)
DROP TABLE IF EXISTS career_profiles CASCADE;

-- Create new Career Profiles table (Main Entity)
CREATE TABLE career_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop and recreate resumes table with new structure
DROP TABLE IF EXISTS resumes CASCADE;
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  template TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop and recreate career_profile_contexts table
DROP TABLE IF EXISTS career_profile_contexts CASCADE;
CREATE TABLE career_profile_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  context_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_profile_id)
);

-- Update existing tables to reference new architecture
-- Add career_profile_id to job_matches (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_matches' AND column_name='career_profile_id') THEN
    ALTER TABLE job_matches ADD COLUMN career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add resume_uuid to job_matches (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_matches' AND column_name='resume_uuid') THEN
    ALTER TABLE job_matches ADD COLUMN resume_uuid UUID REFERENCES resumes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add career_profile_id to job_applications (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='career_profile_id') THEN
    ALTER TABLE job_applications ADD COLUMN career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add resume_uuid to job_applications (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='resume_uuid') THEN
    ALTER TABLE job_applications ADD COLUMN resume_uuid UUID REFERENCES resumes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add career_profile_id to cover_letters (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cover_letters' AND column_name='career_profile_id') THEN
    ALTER TABLE cover_letters ADD COLUMN career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add resume_uuid to cover_letters (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cover_letters' AND column_name='resume_uuid') THEN
    ALTER TABLE cover_letters ADD COLUMN resume_uuid UUID REFERENCES resumes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_career_profiles_user ON career_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_profile ON resumes(career_profile_id);
CREATE INDEX IF NOT EXISTS idx_career_contexts_profile ON career_profile_contexts(career_profile_id);

-- Enable RLS
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profile_contexts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can manage their own career profiles" ON career_profiles;
CREATE POLICY "Users can manage their own career profiles"
  ON career_profiles FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage resumes in their career profiles" ON resumes;
CREATE POLICY "Users can manage resumes in their career profiles"
  ON resumes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM career_profiles 
      WHERE career_profiles.id = resumes.career_profile_id 
      AND career_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage contexts for their career profiles" ON career_profile_contexts;
CREATE POLICY "Users can manage contexts for their career profiles"
  ON career_profile_contexts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM career_profiles 
      WHERE career_profiles.id = career_profile_contexts.career_profile_id 
      AND career_profiles.user_id = auth.uid()
    )
  );
