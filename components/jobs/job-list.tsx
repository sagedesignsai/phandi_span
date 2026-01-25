"use client";

import { JobMatchCard } from './job-match-card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { useJobMatches } from '@/lib/hooks/use-job-matches';
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Resume } from '@/lib/models/resume';
import { listResumes } from '@/lib/storage/resume-store';

interface JobListProps {
  resumeId: string;
  filters?: {
    status?: string;
    minScore?: number;
  };
}

export function JobList({ resumeId, filters }: JobListProps) {
  const { matches, isLoading, error, refetch } = useJobMatches({
    ...filters,
    resumeId,
    autoFetch: true,
  });

  const handleRefresh = async () => {
    try {
      // Trigger job scraping and matching
      const response = await fetch('/api/jobs/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(`Jobs refreshed successfully. Found ${result.matches?.length || 0} matches.`);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to refresh jobs: ${errorMessage}`);
      console.error('Job refresh error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading job matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading jobs: {error.message}</p>
        <Button onClick={refetch} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No job matches found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your preferences or refresh to search for new jobs
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={handleRefresh}>
            <RefreshCw className="size-4 mr-2" />
            Refresh Jobs
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  // Fetch job details for each match (in production, this would be done via join)
  const matchesWithJobs = matches.map((match) => ({
    ...match,
    job: {
      title: 'Job Title', // Would be fetched from job_id
      company: 'Company Name',
      location: 'Location',
      source: 'indeed',
    },
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Matches ({matches.length})</h2>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="size-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchesWithJobs.map((match) => (
          <JobMatchCard
            key={match.id}
            match={match}
            resumeId={resumeId}
            onStatusChange={refetch}
          />
        ))}
      </div>
    </div>
  );
}
