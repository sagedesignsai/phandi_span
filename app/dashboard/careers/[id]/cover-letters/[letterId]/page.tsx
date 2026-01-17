"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoverLetterViewer } from '@/components/cover-letter/viewer';
import { ExportButton } from '@/components/cover-letter/export-button';
import { getCoverLetter, deleteCoverLetter } from '@/lib/storage/cover-letter-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  AlertCircleIcon,
  Loader2Icon,
  BriefcaseIcon,
  FileTextIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CoverLetterViewPage({
  params,
}: {
  params: Promise<{ letterId: string }>;
}) {
  const resolvedParams = use(params);
  const letterId = resolvedParams.letterId;
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loaded = getCoverLetter(letterId);
    if (loaded) {
      setCoverLetter(loaded);
    }
    setIsLoading(false);
  }, [letterId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = deleteCoverLetter(letterId);
      if (success) {
        toast.success('Cover letter deleted');
        router.push(`/dashboard/careers/${coverLetter?.resumeId}`);
      } else {
        toast.error('Failed to delete cover letter');
      }
    } catch (error) {
      toast.error('Failed to delete cover letter');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading cover letter...</p>
        </div>
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
            <AlertCircleIcon className="size-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Cover letter not found</h2>
            <p className="text-muted-foreground mb-4">
              The cover letter you're looking for doesn't exist or has been deleted.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              {coverLetter.jobTitle || 'Cover Letter'}
            </h1>
            {coverLetter.companyName && (
              <p className="text-sm text-muted-foreground">{coverLetter.companyName}</p>
            )}
          </div>
          <Badge variant="outline">{coverLetter.template}</Badge>
          <Badge variant="secondary">{coverLetter.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton coverLetter={coverLetter} />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/careers/${coverLetter.resumeId}/cover-letters/${coverLetter.id}/edit`}>
              <EditIcon className="size-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isDeleting}>
                <TrashIcon className="size-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete cover letter?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your cover letter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {(coverLetter.jobId || coverLetter.resumeId) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coverLetter.jobId && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BriefcaseIcon className="size-4" />
                      Linked Job
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/jobs/${coverLetter.jobId}`}>
                        View Job Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              {coverLetter.resumeId && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileTextIcon className="size-4" />
                      Linked Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/careers/${coverLetter.resumeId}`}>
                        View Career Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <CoverLetterViewer coverLetter={coverLetter} />
        </div>
      </div>
    </div>
  );
}
