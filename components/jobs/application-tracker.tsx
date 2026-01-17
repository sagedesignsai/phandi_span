"use client";

import { ApplicationCard } from './application-card';
import { Empty, EmptyDescription, EmptyTitle, EmptyHeader } from '@/components/ui/empty';
import { useJobApplications } from '@/lib/hooks/use-job-applications';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ApplicationTrackerProps {
  resumeId: string;
}

export function ApplicationTracker({ resumeId }: ApplicationTrackerProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string | null>(null);
  const [coverLetterContent, setCoverLetterContent] = useState<string | null>(null);

  const { applications, isLoading, error } = useJobApplications({
    status: statusFilter === 'all' ? undefined : statusFilter,
    resumeId,
    autoFetch: true,
  });

  const handleViewCoverLetter = async (coverLetterId: string) => {
    try {
      const response = await fetch(
        `/api/resumes/cover-letters/${coverLetterId}`
      );
      
      if (!response.ok) {
        toast.error('Cover letter not found');
        return;
      }
      
      const { data: coverLetter } = await response.json();
      if (coverLetter) {
        setSelectedCoverLetter(coverLetterId);
        setCoverLetterContent(coverLetter.content);
      } else {
        toast.error('Cover letter not found');
      }
    } catch (error) {
      toast.error('Failed to load cover letter');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading applications: {error.message}</p>
      </div>
    );
  }

  const filteredApplications = applications;

  // Calculate stats
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offer: applications.filter((a) => a.status === 'offer').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-2xl font-bold">{stats.applied}</p>
          <p className="text-sm text-muted-foreground">Applied</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-2xl font-bold">{stats.interview}</p>
          <p className="text-sm text-muted-foreground">Interviews</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-2xl font-bold">{stats.offer}</p>
          <p className="text-sm text-muted-foreground">Offers</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-2xl font-bold">{stats.rejected}</p>
          <p className="text-sm text-muted-foreground">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No applications found</EmptyTitle>
            <EmptyDescription>
              You haven't applied to any jobs yet. Start by browsing job matches.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewCoverLetter={handleViewCoverLetter}
            />
          ))}
        </div>
      )}

      {/* Cover Letter Dialog */}
      <Dialog open={!!selectedCoverLetter} onOpenChange={(open) => !open && setSelectedCoverLetter(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cover Letter</DialogTitle>
            <DialogDescription>View your cover letter content</DialogDescription>
          </DialogHeader>
          {coverLetterContent && (
            <div className="whitespace-pre-wrap text-sm">{coverLetterContent}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
