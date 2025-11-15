"use client";

import { ResumeViewer } from './viewer';
import { Loader } from '@/components/ai-elements/loader';
import { Artifact, ArtifactContent, ArtifactHeader, ArtifactTitle, ArtifactDescription } from '@/components/ai-elements/artifact';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { Resume } from '@/lib/models/resume';
import { getResume, saveResume } from '@/lib/storage/resume-store';
import { useSharedChatContext } from '@/lib/ai/chat-context';
import { useChat } from '@ai-sdk/react';

interface RealtimeResumeViewerProps {
  className?: string;
  onResumeUpdate?: (resume: Resume) => void;
}

/**
 * Real-time Resume Viewer Component
 * Displays resume updates as the agent works through tool calls
 * Properly reads tool parts from message.parts array
 */
export function RealtimeResumeViewer({ className, onResumeUpdate }: RealtimeResumeViewerProps) {
  const { chat, resumeId } = useSharedChatContext();
  const { messages, status } = useChat({ chat });
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | undefined>();

  // Load initial resume
  useEffect(() => {
    if (resumeId) {
      const resume = getResume(resumeId);
      if (resume) {
        setCurrentResume(resume);
        if (onResumeUpdate) {
          onResumeUpdate(resume);
        }
      }
    } else {
      setCurrentResume(null);
    }
  }, [resumeId, onResumeUpdate]);

  // Listen to tool results and update resume in real-time
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    let hasUpdate = false;
    let updateTimer: NodeJS.Timeout | null = null;

    // Check for tool parts with resume updates
    for (const part of lastMessage.parts) {
      if (part.type.startsWith('tool-') && 'output' in part && part.output) {
        const result = part.output as { 
          resume?: Resume; 
          resumeId?: string; 
          message?: string;
          success?: boolean;
        };
        
        // Only process successful tool results
        if (result.success !== false) {
          setIsUpdating(true);
          if (result.message) {
            setUpdateMessage(result.message);
          }

          // If tool returned a resume, update display
          if (result.resume) {
            saveResume(result.resume);
            setCurrentResume(result.resume);
            hasUpdate = true;
            if (onResumeUpdate) {
              onResumeUpdate(result.resume);
            }
          }

          // If tool returned a resumeId, load and display it
          if (result.resumeId && result.resumeId !== resumeId) {
            const newResume = getResume(result.resumeId);
            if (newResume) {
              setCurrentResume(newResume);
              hasUpdate = true;
              if (onResumeUpdate) {
                onResumeUpdate(newResume);
              }
            }
          }
        }
      }
    }

    // Reset updating state after a delay if we had an update
    if (hasUpdate) {
      updateTimer = setTimeout(() => {
        setIsUpdating(false);
        setUpdateMessage(undefined);
      }, 1500);
    } else if (status !== 'streaming' && status !== 'submitted') {
      // Reset if not streaming
      setIsUpdating(false);
    }

    return () => {
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
    };
  }, [messages, resumeId, onResumeUpdate, status]);

  // Don't show anything if no resume and no resumeId
  if (!currentResume && !resumeId) {
    return null;
  }

  // Show loading state if resumeId but no resume yet
  if (resumeId && !currentResume) {
    return (
      <div className={cn('w-full', className)}>
        <Artifact className="w-full">
          <ArtifactHeader>
            <ArtifactTitle>Loading Resume...</ArtifactTitle>
          </ArtifactHeader>
          <ArtifactContent>
            <div className="flex items-center justify-center py-8">
              <Loader />
              <span className="ml-2 text-sm text-muted-foreground">Loading resume...</span>
            </div>
          </ArtifactContent>
        </Artifact>
      </div>
    );
  }

  if (!currentResume) return null;

  return (
    <div className={cn('w-full', className)}>
      <Artifact className="w-full">
        <ArtifactHeader>
          <div className="flex-1 min-w-0">
            <ArtifactTitle className="truncate">{currentResume.title}</ArtifactTitle>
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
            <ResumeViewer resume={currentResume} className="shadow-none border-0" />
          </div>
        </ArtifactContent>
      </Artifact>
    </div>
  );
}
