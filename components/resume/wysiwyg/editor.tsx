"use client";

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resume } from '@/lib/models/resume';
import { resumeSchema } from '@/lib/models/resume';
import { useSharedChatContext } from '@/lib/ai/chat-context';
import { PDFCanvas } from './pdf-preview/pdf-canvas';
import { PDFOverlay } from './pdf-preview/pdf-overlay';
import { EditorToolbar } from './toolbar/editor-toolbar';
import { PropertyPanel } from './panels/property-panel';
import { usePDFEditor } from './hooks/use-pdf-editor';
import { useEditableRegions } from './hooks/use-editable-regions';
import { useAIUpdates } from './hooks/use-ai-updates';
import { AIUpdateIndicator } from './components/ai-update-indicator';
import { getPDFTemplate } from './templates';
import { cn } from '@/lib/utils';
import { createAutoSave } from '@/lib/utils/pdf-editor-utils';
import type { EditableRegion } from './hooks/use-editable-regions';
import type { SectionType } from '@/lib/models/resume';

export interface ResumeEditorProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * WYSIWYG Resume Editor
 * Main editor component with PDF preview and inline editing
 */
export function WYSIWYGEditor({ resume, onSave, onCancel, className }: ResumeEditorProps) {
  const {
    resume: editorResume,
    zoom,
    selectedRegionId,
    editingItem,
    updateResume,
    zoomIn,
    zoomOut,
    resetZoom,
    setSelectedRegion,
    setEditingItem,
    undo,
    redo,
    canUndo,
    canRedo,
  } = usePDFEditor(resume);

  const form = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: editorResume,
    mode: 'onChange',
  });

  // Sync form with editor resume
  useEffect(() => {
    form.reset(editorResume);
  }, [editorResume, form]);

  // Get editable regions
  const editableRegions = useEditableRegions(editorResume);

  // Get PDF template
  const PDFTemplate = useMemo(() => getPDFTemplate(editorResume.template || 'default'), [editorResume.template]);

  // Track AI updates for visual feedback
  const [showAIUpdate, setShowAIUpdate] = useState(false);
  const [aiUpdateMessage, setAIUpdateMessage] = useState<string>();

  // Handle AI updates with visual feedback
  const handleResumeUpdate = useCallback(
    (updatedResume: Resume) => {
      if (updatedResume.id === editorResume.id) {
        // Show visual feedback that AI made changes
        setSelectedRegion(undefined);
        setEditingItem(undefined);
        
        // Update resume
        updateResume(updatedResume);
        form.reset(updatedResume);
        
        // Show update indicator
        setShowAIUpdate(true);
        setAIUpdateMessage('Resume updated! Changes are visible in the editor.');
        setTimeout(() => setShowAIUpdate(false), 5000);
        
        // Scroll to top to show changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [editorResume.id, updateResume, form, setSelectedRegion, setEditingItem]
  );

  // Use AI updates hook for better integration
  const { updateCount } = useAIUpdates({
    resume: editorResume,
    onUpdate: handleResumeUpdate,
    enabled: true,
  });

  // Handle region click
  const handleRegionClick = useCallback(
    (region: EditableRegion) => {
      setSelectedRegion(region.id);

      // If it's an item region, open property panel
      if (region.itemId && region.sectionId) {
        const section = editorResume.sections.find((s) => s.id === region.sectionId);
        if (section) {
          const itemIndex = section.items.findIndex(
            (item) => (typeof item === 'object' && 'id' in item ? item.id : null) === region.itemId
          );
          if (itemIndex >= 0) {
            setEditingItem({
              type: section.type as 'experience' | 'education' | 'project' | 'skill',
              item: section.items[itemIndex],
              sectionId: section.id,
              itemIndex,
            });
          }
        }
      }
    },
    [editorResume, setSelectedRegion, setEditingItem]
  );

  // Handle save
  const handleSave = useCallback(() => {
    const formData = form.getValues();
    updateResume(formData);
    onSave(formData);
  }, [form, updateResume, onSave]);

  // Auto-save with debouncing
  const autoSave = useMemo(
    () => createAutoSave(() => {
      const formData = form.getValues();
      onSave(formData);
    }, 2000),
    [form, onSave]
  );

  // Auto-save on resume changes
  useEffect(() => {
    autoSave();
  }, [editorResume, autoSave]);

  // Handle add section
  const handleAddSection = useCallback(() => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: 'custom' as SectionType,
      title: 'New Section',
      items: [],
      order: editorResume.sections.length,
    };
    updateResume({
      sections: [...editorResume.sections, newSection],
    });
  }, [editorResume.sections, updateResume]);

  // Handle template change
  const handleTemplateChange = useCallback(
    (templateId: string) => {
      updateResume({ template: templateId });
    },
    [updateResume]
  );

  // Handle property panel update
  const handlePropertyUpdate = useCallback(
    (updates: Partial<Resume>) => {
      if (editingItem) {
        const section = editorResume.sections.find((s) => s.id === editingItem.sectionId);
        if (section) {
          const updatedItems = [...section.items];
          updatedItems[editingItem.itemIndex] = {
            ...(updatedItems[editingItem.itemIndex] as object),
            ...updates,
          };
          const updatedSections = editorResume.sections.map((s) =>
            s.id === editingItem.sectionId ? { ...s, items: updatedItems } : s
          );
          updateResume({ sections: updatedSections });
        }
      }
    },
    [editingItem, editorResume.sections, updateResume]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Cmd/Ctrl + Z to undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Cmd/Ctrl + Shift + Z to redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Escape to close property panel
      if (e.key === 'Escape') {
        setEditingItem(undefined);
        setSelectedRegion(undefined);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, undo, redo, setEditingItem, setSelectedRegion]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* AI Update Indicator */}
      {showAIUpdate && (
        <div className="px-4 pt-4">
          <AIUpdateIndicator show={showAIUpdate} message={aiUpdateMessage} />
        </div>
      )}

      {/* Toolbar */}
      <EditorToolbar
        resume={editorResume}
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        onAddSection={handleAddSection}
        onTemplateChange={handleTemplateChange}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        zoom={zoom}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Preview */}
        <div className="flex-1 relative overflow-auto bg-muted/20">
          <div className="p-4 flex justify-center">
            <div className="relative" style={{ width: '100%', maxWidth: '800px' }}>
              <PDFCanvas
                resume={editorResume}
                template={PDFTemplate}
                zoom={zoom}
                className="shadow-lg"
              />
              <PDFOverlay
                editableRegions={editableRegions}
                onRegionClick={handleRegionClick}
                selectedRegionId={selectedRegionId}
                zoom={zoom}
              />
            </div>
          </div>
        </div>

        {/* Property Panel */}
        {editingItem && (
          <PropertyPanel
            item={editingItem.item as any}
            type={editingItem.type}
            onUpdate={handlePropertyUpdate}
            onClose={() => setEditingItem(undefined)}
          />
        )}
      </div>
    </div>
  );
}

