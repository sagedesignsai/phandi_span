"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SaveIcon, Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { TemplateSelector } from './template-selector';
import { ExportButton } from './export-button';

interface CoverLetterEditorProps {
  coverLetter: CoverLetter;
  onSave: (coverLetter: CoverLetter) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function CoverLetterEditor({
  coverLetter,
  onSave,
  onCancel,
  className,
  autoSave = true,
}: CoverLetterEditorProps) {
  const [content, setContent] = useState(coverLetter.content);
  const [template, setTemplate] = useState(coverLetter.template);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = content.length;
  const isOptimalLength = wordCount >= 250 && wordCount <= 400;

  useEffect(() => {
    setContent(coverLetter.content);
    setTemplate(coverLetter.template);
  }, [coverLetter.id]);

  useEffect(() => {
    const hasContentChange = content !== coverLetter.content;
    const hasTemplateChange = template !== coverLetter.template;
    setHasChanges(hasContentChange || hasTemplateChange);
  }, [content, template, coverLetter]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const updated: CoverLetter = {
        ...coverLetter,
        content,
        template,
        status: content ? 'edited' : 'draft',
      };
      await onSave(updated);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [coverLetter, content, template, onSave]);

  useEffect(() => {
    if (!autoSave || !hasChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000);

    return () => clearTimeout(timer);
  }, [autoSave, hasChanges, handleSave]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Cover Letter Editor</h2>
          {isSaving && (
            <Badge variant="secondary" className="gap-1.5">
              <Loader2Icon className="size-3 animate-spin" />
              Saving...
            </Badge>
          )}
          {hasChanges && !isSaving && (
            <Badge variant="outline">Unsaved changes</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExportButton coverLetter={{ ...coverLetter, content, template }} />
          {onCancel && (
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="sm"
            className="gap-2"
          >
            <SaveIcon className="size-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <TemplateSelector
            value={template}
            onChange={setTemplate}
            coverLetter={{ ...coverLetter, content, template }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Content</label>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className={cn(
                  'font-medium',
                  isOptimalLength ? 'text-green-600' : wordCount > 400 ? 'text-orange-600' : 'text-muted-foreground'
                )}>
                  {wordCount} words
                </span>
                <span>{characterCount} characters</span>
                {!isOptimalLength && (
                  <span className="text-orange-600">
                    {wordCount < 250 ? 'Too short' : 'Too long'}
                  </span>
                )}
              </div>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your cover letter here..."
              className="min-h-[500px] font-serif text-base leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Optimal length: 250-400 words. Use the AI assistant for suggestions and improvements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
