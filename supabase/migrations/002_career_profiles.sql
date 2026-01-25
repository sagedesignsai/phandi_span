-- Career Profiles Table (Main Entity)
CREATE TABLE career_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes Table (Belongs to Career Profile)
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Resume data structure
  template TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Profile Context (AI personalization data)
CREATE TABLE career_profile_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_profile_id UUID NOT NULL REFERENCES career_profiles(id) ON DELETE CASCADE,
  context_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_profile_id)
);

-- Indexes
CREATE INDEX idx_career_profiles_user ON career_profiles(user_id);
CREATE INDEX idx_resumes_profile ON resumes(career_profile_id);
CREATE INDEX idx_career_contexts_profile ON career_profile_contexts(career_profile_id);

-- RLS Policies
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profile_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own career profiles"
  ON career_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage resumes in their career profiles"
  ON resumes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM career_profiles 
      WHERE career_profiles.id = resumes.career_profile_id 
      AND career_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage contexts for their career profiles"
  ON career_profile_contexts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM career_profiles 
      WHERE career_profiles.id = career_profile_contexts.career_profile_id 
      AND career_profiles.user_id = auth.uid()
    )
  );
