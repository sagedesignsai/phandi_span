"use client";

import { useCallback } from 'react';
import type { Resume, ResumeSection } from '@/lib/models/resume';

/**
 * Drag & Drop Hook
 * Handles reordering of sections and items
 */
export function useDragDrop(updateResume: (updates: Partial<Resume> | ((prev: Resume) => Resume)) => void) {
  const reorderSections = useCallback(
    (activeId: string, overId: string) => {
      updateResume((prev) => {
        const sections = [...prev.sections];
        const activeIndex = sections.findIndex((s) => s.id === activeId);
        const overIndex = sections.findIndex((s) => s.id === overId);

        if (activeIndex === -1 || overIndex === -1) return prev;

        const [removed] = sections.splice(activeIndex, 1);
        sections.splice(overIndex, 0, removed);

        // Update order values
        const updatedSections = sections.map((section, index) => ({
          ...section,
          order: index,
        }));

        return {
          ...prev,
          sections: updatedSections,
        };
      });
    },
    [updateResume]
  );

  const reorderItems = useCallback(
    (sectionId: string, activeId: string, overId: string) => {
      updateResume((prev) => {
        const sections = [...prev.sections];
        const sectionIndex = sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) return prev;

        const section = sections[sectionIndex];
        const items = [...section.items];
        
        // Find indices
        const activeIndex = items.findIndex(
          (item) => (typeof item === 'object' && 'id' in item ? item.id : null) === activeId
        );
        const overIndex = items.findIndex(
          (item) => (typeof item === 'object' && 'id' in item ? item.id : null) === overId
        );

        if (activeIndex === -1 || overIndex === -1) return prev;

        const [removed] = items.splice(activeIndex, 1);
        items.splice(overIndex, 0, removed);

        sections[sectionIndex] = {
          ...section,
          items,
        };

        return {
          ...prev,
          sections,
        };
      });
    },
    [updateResume]
  );

  return {
    reorderSections,
    reorderItems,
  };
}

