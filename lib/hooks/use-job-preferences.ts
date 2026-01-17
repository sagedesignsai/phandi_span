"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { JobPreferences } from '@/lib/models/job';

export function useJobPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<JobPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    async function fetchPreferences() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/jobs/preferences');
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        const data = await response.json();
        setPreferences(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setPreferences(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreferences();
  }, [user?.id]);

  const updatePreferences = async (updates: Partial<JobPreferences>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const data = await response.json();
      setPreferences(data);
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
    preferences,
    isLoading,
    error,
    updatePreferences,
  };
}

