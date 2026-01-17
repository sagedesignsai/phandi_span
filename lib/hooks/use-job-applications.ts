"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { JobApplication } from '@/lib/models/job';

interface UseJobApplicationsOptions {
  status?: string;
  limit?: number;
  autoFetch?: boolean;
  resumeId?: string;
}

export function useJobApplications(options: UseJobApplicationsOptions = {}) {
  const { user } = useAuth();
  const { status, limit = 50, autoFetch = true, resumeId } = options;
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (resumeId) params.append('resumeId', resumeId);
      if (status) params.append('status', status);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/jobs/applications?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && user?.id) {
      fetchApplications();
    }
  }, [user?.id, status, limit, autoFetch, resumeId]);

  const createApplication = async (jobId: string, resumeId: string, autoApply = false) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, resumeId, autoApply }),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const data = await response.json();
      setApplications((prev) => [data, ...prev]);
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      const data = await response.json();
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? data : app))
      );
      setError(null);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
  };
}
