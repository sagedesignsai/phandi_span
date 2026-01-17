'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { useCoverLetterChatContext } from '@/lib/contexts/cover-letter-chat-context';

export function useCoverLetterEditor(
  initialCoverLetter: CoverLetter,
  onSave: (coverLetter: CoverLetter) => void
) {
  const [coverLetter, setCoverLetter] = useState<CoverLetter>(initialCoverLetter);
  const [isDirty, setIsDirty] = useState(false);
  const { setOnCoverLetterUpdate } = useCoverLetterChatContext();
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const prevCoverLetterIdRef = useRef(initialCoverLetter.id);

  useEffect(() => {
    if (prevCoverLetterIdRef.current !== initialCoverLetter.id) {
      prevCoverLetterIdRef.current = initialCoverLetter.id;
      setCoverLetter(initialCoverLetter);
      setIsDirty(false);
    }
  }, [initialCoverLetter.id]);

  const handleCoverLetterUpdate = useCallback(
    (updatedCoverLetter: CoverLetter) => {
      if (updatedCoverLetter.id === coverLetter.id) {
        requestAnimationFrame(() => {
          setCoverLetter(updatedCoverLetter);
          setIsDirty(false);
        });
      }
    },
    [coverLetter.id]
  );

  useEffect(() => {
    setOnCoverLetterUpdate(handleCoverLetterUpdate);
    return () => {
      setOnCoverLetterUpdate(undefined);
    };
  }, [handleCoverLetterUpdate, setOnCoverLetterUpdate]);

  const save = useCallback(() => {
    onSaveRef.current(coverLetter);
    setIsDirty(false);
  }, [coverLetter]);

  const updateContent = useCallback((content: string) => {
    setCoverLetter((prev) => ({ ...prev, content }));
    setIsDirty(true);
  }, []);

  const updateTemplate = useCallback((template: CoverLetter['template']) => {
    setCoverLetter((prev) => ({ ...prev, template }));
    setIsDirty(true);
  }, []);

  return {
    coverLetter,
    isDirty,
    save,
    updateContent,
    updateTemplate,
    setCoverLetter,
    setIsDirty,
  };
}
