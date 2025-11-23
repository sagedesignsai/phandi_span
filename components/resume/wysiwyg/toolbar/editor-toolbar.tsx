"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  SaveIcon,
  UndoIcon,
  RedoIcon,
  PlusIcon,
  ZoomInIcon,
  ZoomOutIcon,
  DownloadIcon,
  FileTextIcon,
  FileIcon,
} from 'lucide-react';
import { ExportButton } from '@/components/resume/export-button';
import { TemplateSelector } from '@/components/resume/template-selector';
import type { Resume } from '@/lib/models/resume';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  resume: Resume;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddSection?: () => void;
  onTemplateChange?: (templateId: string) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  zoom?: number;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
  className?: string;
}

/**
 * Editor Toolbar Component
 * Main toolbar with essential editing actions
 */
export function EditorToolbar({
  resume,
  onSave,
  onUndo,
  onRedo,
  onAddSection,
  onTemplateChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoom = 1.0,
  canUndo = false,
  canRedo = false,
  isSaving = false,
  className,
}: EditorToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 p-3 border-b bg-background/95 backdrop-blur sticky top-0 z-50',
        className
      )}
    >
      {/* Left Section: Edit Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-2"
        >
          <SaveIcon className="size-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {onUndo && (
          <Button
            variant="outline"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <UndoIcon className="size-4" />
          </Button>
        )}

        {onRedo && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <RedoIcon className="size-4" />
          </Button>
        )}

        <div className="w-px h-6 bg-border mx-1" />

        {onAddSection && (
          <Button variant="outline" size="sm" onClick={onAddSection} className="gap-2">
            <PlusIcon className="size-4" />
            Add Section
          </Button>
        )}
      </div>

      {/* Center Section: Template Selector */}
      <div className="flex items-center gap-2">
        {onTemplateChange && (
          <TemplateSelector
            resume={resume}
            onTemplateChange={onTemplateChange}
          />
        )}
      </div>

      {/* Right Section: View & Export */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        {onZoomOut && onZoomIn && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomOut}
              title="Zoom Out"
            >
              <ZoomOutIcon className="size-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomIn}
              title="Zoom In"
            >
              <ZoomInIcon className="size-4" />
            </Button>
            {onResetZoom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetZoom}
                className="text-xs"
              >
                Reset
              </Button>
            )}
            <div className="w-px h-6 bg-border mx-1" />
          </>
        )}

        {/* Export */}
        <ExportButton resume={resume} />
      </div>
    </div>
  );
}

