"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Resume } from '@/lib/models/resume';

interface EditorState {
  resume: Resume;
  zoom: number;
  selectedRegionId?: string;
  editingItem?: {
    type: 'experience' | 'education' | 'project' | 'skill';
    item: unknown;
    sectionId: string;
    itemIndex: number;
  };
  undoStack: Resume[];
  redoStack: Resume[];
}

const MAX_UNDO_STACK = 50;

/**
 * Main PDF Editor Hook
 * Manages editor state, undo/redo, and resume updates
 */
export function usePDFEditor(initialResume: Resume) {
  const [state, setState] = useState<EditorState>({
    resume: initialResume,
    zoom: 1.0,
    undoStack: [],
    redoStack: [],
  });

  const prevResumeRef = useRef<Resume>(initialResume);

  // Save state to undo stack when resume changes
  useEffect(() => {
    if (prevResumeRef.current.id !== state.resume.id) {
      // Resume ID changed, reset undo/redo
      setState((prev) => ({
        ...prev,
        undoStack: [],
        redoStack: [],
      }));
      prevResumeRef.current = state.resume;
      return;
    }

    // Only save to undo stack if resume actually changed
    const resumeChanged = JSON.stringify(prevResumeRef.current) !== JSON.stringify(state.resume);
    if (resumeChanged && prevResumeRef.current.id === state.resume.id) {
      setState((prev) => {
        const newUndoStack = [prevResumeRef.current, ...prev.undoStack].slice(0, MAX_UNDO_STACK);
        return {
          ...prev,
          undoStack: newUndoStack,
          redoStack: [], // Clear redo stack when new change is made
        };
      });
      prevResumeRef.current = state.resume;
    }
  }, [state.resume]);

  const updateResume = useCallback((updates: Partial<Resume> | ((prev: Resume) => Resume)) => {
    setState((prev) => {
      const newResume = typeof updates === 'function' ? updates(prev.resume) : { ...prev.resume, ...updates };
      return {
        ...prev,
        resume: newResume,
      };
    });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2.0, zoom)), // Clamp between 50% and 200%
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: Math.min(2.0, prev.zoom + 0.1),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: Math.max(0.5, prev.zoom - 0.1),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: 1.0,
    }));
  }, []);

  const setSelectedRegion = useCallback((regionId?: string) => {
    setState((prev) => ({
      ...prev,
      selectedRegionId: regionId,
    }));
  }, []);

  const setEditingItem = useCallback((
    item?: {
      type: 'experience' | 'education' | 'project' | 'skill';
      item: unknown;
      sectionId: string;
      itemIndex: number;
    }
  ) => {
    setState((prev) => ({
      ...prev,
      editingItem: item,
    }));
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.undoStack.length === 0) return prev;

      const previousResume = prev.undoStack[0];
      const newUndoStack = prev.undoStack.slice(1);
      const newRedoStack = [prev.resume, ...prev.redoStack].slice(0, MAX_UNDO_STACK);

      return {
        ...prev,
        resume: previousResume,
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.redoStack.length === 0) return prev;

      const nextResume = prev.redoStack[0];
      const newRedoStack = prev.redoStack.slice(1);
      const newUndoStack = [prev.resume, ...prev.undoStack].slice(0, MAX_UNDO_STACK);

      return {
        ...prev,
        resume: nextResume,
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    });
  }, []);

  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;

  return {
    resume: state.resume,
    zoom: state.zoom,
    selectedRegionId: state.selectedRegionId,
    editingItem: state.editingItem,
    updateResume,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setSelectedRegion,
    setEditingItem,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

