import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CareerProfile, Resume, CareerProfileContext } from '@/lib/models/career-profile';

// Career Profiles Hook
export function useCareerProfiles() {
  const [profiles, setProfiles] = useState<CareerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career-profiles');
      if (!response.ok) throw new Error('Failed to fetch profiles');
      
      const data = await response.json();
      setProfiles(data.profiles);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (profileData: { name: string; description?: string }) => {
    try {
      const response = await fetch('/api/career-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to create profile');
      
      const data = await response.json();
      setProfiles(prev => [data.profile, ...prev]);
      return data.profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    isLoading,
    error,
    fetchProfiles,
    createProfile,
    refetch: fetchProfiles,
  };
}

// Resumes Hook
export function useResumes(profileId: string) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResumes = async () => {
    if (!profileId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/career-profiles/${profileId}/resumes`);
      if (!response.ok) throw new Error('Failed to fetch resumes');
      
      const data = await response.json();
      setResumes(data.resumes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async (resumeData: { title: string; content: any; template?: string }) => {
    try {
      const response = await fetch(`/api/career-profiles/${profileId}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) throw new Error('Failed to create resume');
      
      const data = await response.json();
      setResumes(prev => [data.resume, ...prev]);
      return data.resume;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [profileId]);

  return {
    resumes,
    isLoading,
    error,
    fetchResumes,
    createResume,
    refetch: fetchResumes,
  };
}

// Career Profile Context Hook
export function useCareerProfileContext(profileId: string) {
  const [context, setContext] = useState<CareerProfileContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContext = async () => {
    if (!profileId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/career-profiles/${profileId}/context`);
      if (!response.ok) {
        if (response.status === 404) {
          setContext(null);
          return;
        }
        throw new Error('Failed to fetch context');
      }
      
      const data = await response.json();
      setContext(data.context);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateContext = async (contextData: any) => {
    try {
      const response = await fetch(`/api/career-profiles/${profileId}/context`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextData),
      });

      if (!response.ok) throw new Error('Failed to update context');
      
      const data = await response.json();
      setContext(data.context);
      return data.context;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  useEffect(() => {
    fetchContext();
  }, [profileId]);

  return {
    context,
    isLoading,
    error,
    fetchContext,
    updateContext,
    refetch: fetchContext,
  };
}
