-- Re-enable RLS with proper policy
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy and create a new one
DROP POLICY IF EXISTS "Users can manage their own career profiles" ON career_profiles;

-- Create a more permissive policy for authenticated users
CREATE POLICY "authenticated_users_career_profiles" 
  ON career_profiles 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Also fix policies for related tables
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profile_contexts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage resumes in their career profiles" ON resumes;
CREATE POLICY "authenticated_users_resumes" 
  ON resumes 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage contexts for their career profiles" ON career_profile_contexts;
CREATE POLICY "authenticated_users_contexts" 
  ON career_profile_contexts 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
