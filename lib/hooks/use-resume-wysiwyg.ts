'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Resume } from '@/lib/models/resume';
import { resumeToBlocks, blocksToResume } from '@/lib/resume/editor/block-serialization';
import { useEditorState } from '@/lib/resume/editor/editor-state';
import type { Block, BlockType } from '@/lib/resume/editor/block-types';
import { useSharedChatContext } from '@/lib/ai/chat-context';

/**
 * Main hook for WYSIWYG resume editor
 * Manages blocks, resume sync, and AI integration
 */
export function useResumeWysiwyg(initialResume: Resume, onSave: (resume: Resume) => void) {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [template, setTemplate] = useState<string>(initialResume.template || 'default');
  const [isDirty, setIsDirty] = useState(false);
  
  // Convert resume to blocks
  const initialBlocks = resumeToBlocks(initialResume);
  const [editorState, editorActions] = useEditorState(initialBlocks);
  
  // AI integration
  const { setOnResumeUpdate } = useSharedChatContext();
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Track if we're updating from blocks to prevent circular updates
  const isUpdatingFromBlocksRef = useRef(false);
  const blocksRef = useRef(editorState.blocks);
  blocksRef.current = editorState.blocks;

  // Sync blocks to resume when blocks change (but not if we're updating from AI)
  useEffect(() => {
    if (editorState.blocks.length > 0 && !isUpdatingFromBlocksRef.current) {
      try {
        const updatedResume = blocksToResume(editorState.blocks, resume.id, template);
        // Only update if resume actually changed
        const resumeString = JSON.stringify(resume);
        const updatedResumeString = JSON.stringify(updatedResume);
        if (resumeString !== updatedResumeString) {
          setResume(updatedResume);
          setIsDirty(true);
        }
      } catch (error) {
        console.error('Error converting blocks to resume:', error);
      }
    }
  }, [editorState.blocks, template, resume.id]);

  // Store setBlocks in a ref to avoid dependency issues
  const setBlocksRef = useRef(editorActions.setBlocks);
  setBlocksRef.current = editorActions.setBlocks;

  // Handle AI updates
  useEffect(() => {
    const handleResumeUpdate = (updatedResume: Resume) => {
      if (updatedResume.id === resume.id) {
        isUpdatingFromBlocksRef.current = true;
        const newBlocks = resumeToBlocks(updatedResume);
        setBlocksRef.current(newBlocks);
        setResume(updatedResume);
        setTemplate(updatedResume.template || 'default');
        setIsDirty(false);
        // Reset flag after a tick
        setTimeout(() => {
          isUpdatingFromBlocksRef.current = false;
        }, 0);
      }
    };

    setOnResumeUpdate(handleResumeUpdate);
    return () => {
      setOnResumeUpdate(undefined);
    };
  }, [resume.id, setOnResumeUpdate]);

  // Save handler
  const handleSave = useCallback(() => {
    try {
      const resumeToSave = blocksToResume(editorState.blocks, resume.id, template);
      onSaveRef.current(resumeToSave);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  }, [editorState.blocks, resume.id, template]);

  // Update template
  const updateTemplate = useCallback((newTemplate: string) => {
    setTemplate(newTemplate);
    setIsDirty(true);
  }, []);

  // Add block with section context
  const addBlockWithContext = useCallback((type: BlockType, sectionType?: string) => {
    const newBlock = editorActions.addBlock(type);
    
    // If adding to a section, find or create the section
    if (sectionType && type !== 'section') {
      const sectionBlock = editorState.blocks.find(
        b => b.type === 'section' && (b.data as { sectionType?: string }).sectionType === sectionType
      );
      
      if (sectionBlock) {
        // Reorder to be after the section
        const blocksAfter = editorState.blocks.filter(b => b.order > sectionBlock.order);
        const newOrder = blocksAfter.length > 0
          ? Math.min(...blocksAfter.map(b => b.order)) - 1
          : sectionBlock.order + 1;
        
        editorActions.updateBlock(newBlock.id, { order: newOrder });
      }
    }
    
    return newBlock;
  }, [editorActions, editorState.blocks]);

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
    addBlock: addBlockWithContext,
    save: handleSave,
    updateTemplate,
  };
}

