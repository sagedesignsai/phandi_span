-- Recreate all tables based on the codebase models

-- 1. Career Profiles (Main Entity)
CREATE TABLE career_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Resumes (Belongs to Career Profile)
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  template TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Career Profile Contexts (AI personalization)
CREATE TABLE career_profile_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  context_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_profile_id)
);

-- 4. User Job Preferences
CREATE TABLE user_job_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_types TEXT[] DEFAULT ARRAY['full-time', 'part-time']::TEXT[],
  industries TEXT[],
  locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  salary_min INTEGER,
  salary_max INTEGER,
  experience_level TEXT,
  skills TEXT[],
  preferred_sources TEXT[] DEFAULT ARRAY['indeed', 'linkedin']::TEXT[],
  auto_apply_enabled BOOLEAN DEFAULT false,
  auto_apply_threshold INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 5. Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  job_type TEXT,
  description TEXT,
  requirements TEXT,
  salary_range TEXT,
  source TEXT NOT NULL,
  source_url TEXT UNIQUE NOT NULL,
  source_id TEXT,
  posted_date TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Job Matches
CREATE TABLE job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  career_profile_id UUID REFERENCES career_profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL,
  matched_skills TEXT[],
  missing_skills TEXT[],
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'applied', 'rejected', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id, resume_id)
);

-- 7. Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_match_id UUID REFERENCES job_matches(id),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  cover_letter_id UUID,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'interview', 'rejected', 'offer', 'withdrawn')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_received_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  email_sent BOOLEAN DEFAULT false,
  email_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Cover Letters
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'professional',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_career_profiles_user ON career_profiles(user_id);
CREATE INDEX idx_resumes_profile ON resumes(career_profile_id);
CREATE INDEX idx_career_contexts_profile ON career_profile_contexts(career_profile_id);
CREATE INDEX idx_jobs_source ON jobs(source);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX idx_job_matches_user ON job_matches(user_id);
CREATE INDEX idx_job_matches_profile ON job_matches(career_profile_id);
CREATE INDEX idx_job_matches_score ON job_matches(match_score DESC);
CREATE INDEX idx_job_applications_user ON job_applications(user_id);
CREATE INDEX idx_job_applications_profile ON job_applications(career_profile_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_cover_letters_profile ON cover_letters(career_profile_id);

-- Enable Row Level Security
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profile_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Permissive for authenticated users)
CREATE POLICY "authenticated_users_career_profiles" 
  ON career_profiles FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_resumes" 
  ON resumes FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_contexts" 
  ON career_profile_contexts FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_job_preferences" 
  ON user_job_preferences FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_job_matches" 
  ON job_matches FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_job_applications" 
  ON job_applications FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_cover_letters" 
  ON cover_letters FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);
