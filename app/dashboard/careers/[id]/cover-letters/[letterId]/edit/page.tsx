"use client";

import React, { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CoverLetterEditor } from '@/components/cover-letter/editor';
import { CoverLetterChat } from '@/components/chat/cover-letter-chat';
import { getCoverLetter, saveCoverLetter } from '@/lib/storage/cover-letter-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, AlertCircleIcon, Loader2Icon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CoverLetterChatProvider } from '@/lib/contexts/cover-letter-chat-context';

function EditPageContent({ params }: { params: { letterId: string } }) {
  const router = useRouter();
  const letterId = params.letterId;
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatPanel, setShowChatPanel] = useState(true);

  useEffect(() => {
    const loaded = getCoverLetter(letterId);
    if (loaded) {
      setCoverLetter(loaded);
    }
    setIsLoading(false);
  }, [letterId]);

  const handleSave = useCallback((updated: CoverLetter) => {
    setCoverLetter(updated);
    saveCoverLetter(updated);
    toast.success('Cover letter saved');
  }, []);

  const handleCoverLetterUpdate = useCallback((updated: CoverLetter) => {
    setCoverLetter(updated);
    saveCoverLetter(updated);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (coverLetter) {
          saveCoverLetter(coverLetter);
          toast.success('Saved');
        }
      }
      if (e.key === 'Escape' && e.target === document.body) {
        router.push(`/dashboard/careers/${coverLetter?.resumeId}/cover-letters/${letterId}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [coverLetter, letterId, router]);

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
            <Link href={`/dashboard/careers/${coverLetter.resumeId}/cover-letters/${letterId}`}>
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Edit Cover Letter</h1>
            <p className="text-sm text-muted-foreground">
              {coverLetter.jobTitle || 'Untitled'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChatPanel(!showChatPanel)}
          className="gap-2"
        >
          <SparklesIcon className="size-4" />
          {showChatPanel ? 'Hide' : 'Show'} AI Assistant
        </Button>
      </div>

      {showChatPanel ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
          <ResizablePanel defaultSize={35} minSize={30} maxSize={50} className="min-h-0">
            <div className="h-full p-0 flex flex-col min-h-0">
              <div className="h-full rounded-lg border-none bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
                  <SparklesIcon className="size-4 text-primary" />
                  <span className="text-sm font-medium">AI Assistant</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Ask for help
                  </Badge>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <CoverLetterChat
                    coverLetterId={coverLetter.id}
                    onCoverLetterUpdate={handleCoverLetterUpdate}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border" />

          <ResizablePanel defaultSize={65} minSize={50} maxSize={70} className="min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <CoverLetterEditor
                coverLetter={coverLetter}
                onSave={handleSave}
                onCancel={() => router.push(`/dashboard/careers/${coverLetter.resumeId}/cover-letters/${letterId}`)}
                className="h-full"
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="h-full flex flex-col min-h-0">
          <CoverLetterEditor
            coverLetter={coverLetter}
            onSave={handleSave}
            onCancel={() => router.push(`/dashboard/careers/${coverLetter.resumeId}/cover-letters/${letterId}`)}
            className="h-full"
          />
        </div>
      )}
    </div>
  );
}

export default function CoverLetterEditPage({
  params,
}: {
  params: Promise<{ letterId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <CoverLetterChatProvider>
      <EditPageContent params={resolvedParams} />
    </CoverLetterChatProvider>
  );
}
