"use client";

import React, { useState, useEffect } from 'react';
import { CoverLetterViewer } from './viewer';
import { Loader } from '@/components/ai-elements/loader';
import { Artifact, ArtifactContent, ArtifactHeader, ArtifactTitle, ArtifactDescription } from '@/components/ai-elements/artifact';
import { cn } from '@/lib/utils';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { getCoverLetter, saveCoverLetter } from '@/lib/storage/cover-letter-store';
import { useCoverLetterChatContext } from '@/lib/contexts/cover-letter-chat-context';
import { useChat } from '@ai-sdk/react';

interface RealtimeCoverLetterViewerProps {
  className?: string;
  onCoverLetterUpdate?: (coverLetter: CoverLetter) => void;
}

export function RealtimeCoverLetterViewer({
  className,
  onCoverLetterUpdate,
}: RealtimeCoverLetterViewerProps) {
  const { chat, coverLetterId } = useCoverLetterChatContext();
  const { messages, status } = useChat({ chat });
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetter | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | undefined>();

  const onCoverLetterUpdateRef = React.useRef(onCoverLetterUpdate);
  onCoverLetterUpdateRef.current = onCoverLetterUpdate;

  useEffect(() => {
    if (coverLetterId) {
      const coverLetter = getCoverLetter(coverLetterId);
      if (coverLetter) {
        setCurrentCoverLetter(coverLetter);
        if (onCoverLetterUpdateRef.current) {
          onCoverLetterUpdateRef.current(coverLetter);
        }
      }
    } else {
      setCurrentCoverLetter(null);
    }
  }, [coverLetterId]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    let hasUpdate = false;
    let updateTimer: NodeJS.Timeout | null = null;

    for (const part of lastMessage.parts) {
      if (part.type.startsWith('tool-') && 'output' in part && part.output) {
        const result = part.output as {
          coverLetter?: CoverLetter;
          success?: boolean;
          message?: string;
        };

        if (result.success !== false) {
          setIsUpdating(true);
          if (result.message) {
            setUpdateMessage(result.message);
          }

          if (result.coverLetter) {
            saveCoverLetter(result.coverLetter);
            setCurrentCoverLetter(result.coverLetter);
            hasUpdate = true;
            if (onCoverLetterUpdateRef.current) {
              onCoverLetterUpdateRef.current(result.coverLetter);
            }
          }
        }
      }
    }

    if (hasUpdate) {
      updateTimer = setTimeout(() => {
        setIsUpdating(false);
        setUpdateMessage(undefined);
      }, 1500);
    } else if (status !== 'streaming' && status !== 'submitted') {
      setIsUpdating(false);
    }

    return () => {
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
    };
  }, [messages, status]);

  if (!currentCoverLetter && !coverLetterId) {
    return null;
  }

  if (coverLetterId && !currentCoverLetter) {
    return (
      <div className={cn('w-full', className)}>
        <Artifact className="w-full">
          <ArtifactHeader>
            <ArtifactTitle>Loading Cover Letter...</ArtifactTitle>
          </ArtifactHeader>
          <ArtifactContent>
            <div className="flex items-center justify-center py-8">
              <Loader />
              <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
          </ArtifactContent>
        </Artifact>
      </div>
    );
  }

  if (!currentCoverLetter) return null;

  return (
    <div className={cn('w-full', className)}>
      <Artifact className="w-full">
        <ArtifactHeader>
          <div className="flex-1 min-w-0">
            <ArtifactTitle className="truncate">
              {currentCoverLetter.jobTitle || 'Cover Letter'}
            </ArtifactTitle>
            {updateMessage && (
              <ArtifactDescription className="mt-1">{updateMessage}</ArtifactDescription>
            )}
          </div>
          {(isUpdating || status === 'streaming' || status === 'submitted') && (
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <Loader className="size-4" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">Updating...</span>
            </div>
          )}
        </ArtifactHeader>
        <ArtifactContent>
          <div className="max-h-96 overflow-auto">
            <CoverLetterViewer coverLetter={currentCoverLetter} className="shadow-none border-0" />
          </div>
        </ArtifactContent>
      </Artifact>
    </div>
  );
}
