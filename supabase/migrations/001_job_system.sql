-- Job Preferences Table
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

-- Jobs Table
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

-- Job Matches (user-specific job matches with scores)
CREATE TABLE job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  resume_id TEXT,
  match_score DECIMAL(5,2) NOT NULL,
  matched_skills TEXT[],
  missing_skills TEXT[],
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'applied', 'rejected', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_match_id UUID REFERENCES job_matches(id),
  resume_id TEXT NOT NULL,
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

-- Cover Letters
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  resume_id TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'professional',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_source ON jobs(source);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX idx_job_matches_user ON job_matches(user_id);
CREATE INDEX idx_job_matches_score ON job_matches(match_score DESC);
CREATE INDEX idx_job_applications_user ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- RLS Policies
ALTER TABLE user_job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON user_job_preferences FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own matches"
  ON job_matches FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own applications"
  ON job_applications FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cover letters"
  ON cover_letters FOR ALL
  USING (auth.uid() = user_id);

