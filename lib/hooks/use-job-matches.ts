"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { JobMatch } from '@/lib/models/job';

interface UseJobMatchesOptions {
  status?: string;
  minScore?: number;
  limit?: number;
  autoFetch?: boolean;
  resumeId?: string;
}

export function useJobMatches(options: UseJobMatchesOptions = {}) {
  const { user } = useAuth();
  const { status, minScore, limit = 50, autoFetch = true, resumeId } = options;
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatches = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (resumeId) params.append('resumeId', resumeId);
      if (status) params.append('status', status);
      if (minScore !== undefined) params.append('minScore', minScore.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/jobs/matches?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job matches');
      }
      const data = await response.json();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && user?.id) {
      fetchMatches();
    }
  }, [user?.id, status, minScore, limit, autoFetch, resumeId]);

  return {
    matches,
    isLoading,
    error,
    refetch: fetchMatches,
  };
}
