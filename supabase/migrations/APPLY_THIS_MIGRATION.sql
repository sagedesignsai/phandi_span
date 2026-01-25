-- Career Profile Architecture Migration
-- Execute this in Supabase SQL Editor

-- 1. Create Career Profiles table (Main Entity)
CREATE TABLE IF NOT EXISTS career_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Resumes table (Belongs to Career Profile)
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  template TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Career Profile Context table
CREATE TABLE IF NOT EXISTS career_profile_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  context_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_profile_id)
);

-- 4. Update job_matches table
ALTER TABLE job_matches 
ADD COLUMN IF NOT EXISTS career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS resume_uuid UUID REFERENCES resumes(id) ON DELETE CASCADE;

-- 5. Update job_applications table
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS resume_uuid UUID REFERENCES resumes(id) ON DELETE CASCADE;

-- 6. Update cover_letters table
ALTER TABLE cover_letters 
ADD COLUMN IF NOT EXISTS career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS resume_uuid UUID REFERENCES resumes(id) ON DELETE CASCADE;

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS idx_career_profiles_user ON career_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_profile ON resumes(career_profile_id);
CREATE INDEX IF NOT EXISTS idx_career_contexts_profile ON career_profile_contexts(career_profile_id);

-- 8. Enable RLS
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profile_contexts ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
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
