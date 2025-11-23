"use client";

import { useEffect, useRef } from 'react';
import { useSharedChatContext } from '@/lib/ai/chat-context';
import type { Resume } from '@/lib/models/resume';

interface UseAIUpdatesOptions {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
  enabled?: boolean;
}

/**
 * Hook for handling AI updates with visual feedback
 * Integrates with chat context to receive AI-generated resume updates
 */
export function useAIUpdates({ resume, onUpdate, enabled = true }: UseAIUpdatesOptions) {
  const { setOnResumeUpdate } = useSharedChatContext();
  const updateCountRef = useRef(0);
  const lastUpdateRef = useRef<Resume | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleAIUpdate = (updatedResume: Resume) => {
      // Only process updates for the current resume
      if (updatedResume.id !== resume.id) return;

      // Prevent duplicate updates
      if (lastUpdateRef.current && JSON.stringify(lastUpdateRef.current) === JSON.stringify(updatedResume)) {
        return;
      }

      updateCountRef.current += 1;
      lastUpdateRef.current = updatedResume;

      // Call the update handler
      onUpdate(updatedResume);
    };

    // Register the update handler
    setOnResumeUpdate(handleAIUpdate);

    return () => {
      setOnResumeUpdate(undefined);
    };
  }, [resume.id, onUpdate, setOnResumeUpdate, enabled]);

  return {
    updateCount: updateCountRef.current,
  };
}

