-- Fix RLS policy for career_profiles table
DROP POLICY IF EXISTS "Users can manage their own career profiles" ON career_profiles;

CREATE POLICY "Users can manage their own career profiles"
  ON career_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
