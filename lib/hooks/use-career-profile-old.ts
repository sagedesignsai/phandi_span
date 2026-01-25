import { useState, useEffect } from 'react';
import { getCareerProfile, saveCareerProfile } from '@/lib/supabase/career-profiles-client';
import { createClient } from '@/lib/supabase/client';
import type { CareerProfileContext } from '@/lib/models/career-profile';

interface UseCareerProfileOptions {
  resumeId: string;
  autoFetch?: boolean;
}

export function useCareerProfile({ resumeId, autoFetch = true }: UseCareerProfileOptions) {
  const [profile, setProfile] = useState<CareerProfileContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!resumeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const profileData = await getCareerProfile(user.id, resumeId);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: CareerProfileContext) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const savedProfile = await saveCareerProfile(user.id, resumeId, profileData);
      setProfile(savedProfile);
      return savedProfile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save profile'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && resumeId) {
      fetchProfile();
    }
  }, [resumeId, autoFetch]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    refetch: fetchProfile,
  };
}
