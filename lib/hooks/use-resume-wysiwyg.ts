'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BlockResume } from '@/lib/models/resume';
import { useEditorState } from '@/lib/resume/editor/editor-state';
import type { Block, BlockType } from '@/lib/resume/editor/block-types';
import { useSharedChatContext } from '@/lib/ai/resume/chat-context';

/**
 * Main hook for WYSIWYG resume editor (block-based only)
 */
export function useResumeWysiwyg(initialResume: BlockResume, onSave: (resume: BlockResume) => void) {
  const [resume, setResume] = useState<BlockResume>(initialResume);
  const [template, setTemplate] = useState<string>(initialResume.template || 'default');
  const [isDirty, setIsDirty] = useState(false);
  
  // Initialize editor state with blocks from resume
  const [editorState, editorActions] = useEditorState(initialResume.blocks as Block[]);
  
  // AI integration
  const { setOnResumeUpdate } = useSharedChatContext();
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Save handler - creates block-based resume
  const handleSave = useCallback(() => {
    try {
      const resumeToSave: BlockResume = {
        ...resume,
        blocks: editorState.blocks,
        template,
        metadata: {
          ...resume.metadata,
          updatedAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          version: resume.metadata.version + 1,
        },
      };
      
      onSaveRef.current(resumeToSave);
      setResume(resumeToSave);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  }, [editorState.blocks, resume, template]);

  // Update template
  const updateTemplate = useCallback((newTemplate: string) => {
    setTemplate(newTemplate);
    setIsDirty(true);
  }, []);

  // Track changes
  const blocksRef = useRef(editorState.blocks);
  if (blocksRef.current !== editorState.blocks) {
    blocksRef.current = editorState.blocks;
    setIsDirty(true);
  }

  // Handle AI updates
  const handleResumeUpdate = useCallback((updatedResume: BlockResume) => {
    if (updatedResume.id === resume.id) {
      setResume(updatedResume);
      editorActions.setBlocks(updatedResume.blocks as Block[]);
      setTemplate(updatedResume.template || 'default');
      setIsDirty(false);
    }
  }, [resume.id, editorActions]);

  // Set AI update handler
  useEffect(() => {
    setOnResumeUpdate(handleResumeUpdate);
    return () => setOnResumeUpdate(undefined);
  }, [handleResumeUpdate, setOnResumeUpdate]);

  return {
    // State
    blocks: editorState.blocks,
    resume,
    template,
    isDirty,
    selectedBlockId: editorState.selectedBlockId,
    editingBlockId: editorState.editingBlockId,
    
    // Actions
    ...editorActions,
    save: handleSave,
    updateTemplate,
  };
}

