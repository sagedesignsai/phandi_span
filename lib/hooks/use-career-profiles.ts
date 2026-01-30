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

  const updateResume = async (resumeId: string, updates: { title?: string; content?: any; template?: string }) => {
    try {
      const response = await fetch(`/api/career-profiles/${profileId}/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update resume');

      const data = await response.json();
      setResumes(prev => prev.map(r => r.id === resumeId ? data.resume : r));
      return data.resume;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const deleteResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/career-profiles/${profileId}/resumes/${resumeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete resume');

      setResumes(prev => prev.filter(r => r.id !== resumeId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  return {
    resumes,
    isLoading,
    error,
    fetchResumes,
    createResume,
    updateResume,
    deleteResume,
    refetch: fetchResumes,
  };
}

// Career Profile Context Hook
export function useCareerProfileContext(profileId: string) {
  const [context, setContext] = useState<CareerProfileContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContext = async () => {
    if (!profileId) {
      setIsLoading(false);
      return;
    }

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

// Single Resume Hook
export function useResume(profileId: string, resumeId: string | null) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResume = async () => {
    if (!profileId || !resumeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/career-profiles/${profileId}/resumes/${resumeId}`);
      if (!response.ok) throw new Error('Failed to fetch resume');

      const data = await response.json();
      setResume(data.resume);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateResume = async (updates: { title?: string; content?: any; template?: string }) => {
    if (!profileId || !resumeId) throw new Error('Missing profile or resume ID');

    try {
      const response = await fetch(`/api/career-profiles/${profileId}/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update resume');

      const data = await response.json();
      setResume(data.resume);
      return data.resume;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  useEffect(() => {
    fetchResume();
  }, [profileId, resumeId]);

  return {
    resume,
    isLoading,
    error,
    fetchResume,
    updateResume,
    refetch: fetchResume,
  };
}
