"use client";

import React, { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WysiwygEditor } from '@/components/resume/wysiwyg/editor';
import { ResumeChat } from '@/components/chat/resume-chat';
import { ResumeViewer } from '@/components/resume/viewer';
import { getResume, saveResume } from '@/lib/storage/resume-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  ArrowLeftIcon,
  AlertCircleIcon,
  EyeIcon,
  SaveIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SparklesIcon,
  FileTextIcon,
  EditIcon,
  FileIcon
} from 'lucide-react';
import Link from 'next/link';
import type { Resume } from '@/lib/models/resume';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TemplateSelector } from '@/components/resume/template-selector';
import { ExportButton } from '@/components/resume/export-button';
import { useHeader } from '@/lib/contexts/header-context';
import { useChatPanel } from '@/lib/contexts/chat-panel-context';

type ViewMode = 'editor' | 'preview';

export default function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const { showChatPanel, setShowChatPanel } = useChatPanel();
  const { updateConfig } = useHeader();

  // Update header config when resume loads
  useEffect(() => {
    if (resume) {
      updateConfig({
        title: `Edit - ${resume.title || 'Resume'}`,
        description: 'Edit your resume content and customize your template',
      });
    }
  }, [resume, updateConfig]);

  // Load resume
  useEffect(() => {
    const loadedResume = getResume(resolvedParams.id);
    if (loadedResume) {
      setResume(loadedResume);
      setLastSaved(new Date(loadedResume.metadata.updatedAt ? new Date(loadedResume.metadata.updatedAt) : new Date()));
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  // Auto-save functionality
  const performSave = useCallback(async (resumeToSave: Resume, showToast = true) => {
    try {
      setIsSaving(true);
      saveResume(resumeToSave);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      if (showToast) {
        toast.success('Resume saved successfully', {
          description: 'Your changes have been saved.',
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      if (showToast) {
        toast.error('Failed to save resume', {
          description: 'Please try again.',
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleSave = useCallback((updatedResume: Resume) => {
    setResume(updatedResume);
    performSave(updatedResume, true);
  }, [performSave]);

  // Stabilize the callback to prevent infinite loops
  const handleResumeUpdate = useCallback((updatedResume: Resume) => {
    setResume(updatedResume);
    setHasUnsavedChanges(true);
    // Auto-save when AI updates resume
    performSave(updatedResume, false);
  }, [performSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (resume && hasUnsavedChanges) {
          performSave(resume, true);
        }
      }
      // Escape to go back
      if (e.key === 'Escape' && e.target === document.body) {
        router.push(`/dashboard/resumes/${resume?.id}`);
      }
      // Cmd/Ctrl + E to toggle editor
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        setViewMode('editor');
      }
      // Cmd/Ctrl + P to toggle preview
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setViewMode('preview');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resume, hasUnsavedChanges, performSave, router]);

  // Track form changes
  useEffect(() => {
    if (resume) {
      setHasUnsavedChanges(true);
    }
  }, [resume]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
            <AlertCircleIcon className="size-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
            <p className="text-muted-foreground mb-4">
              The resume you're looking for doesn't exist or has been deleted.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-full">
      {/* Layout: Conditional Chat Panel + Editor/Preview */}
      {showChatPanel ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={35} minSize={35} maxSize={55} className="min-h-0">
            <div className="h-full p-0 flex flex-col min-h-0">
              <div className="h-full rounded-lg border-none bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
                <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
                  <SparklesIcon className="size-4 text-primary" />
                  <span className="text-sm font-medium">AI Assistant</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Ask me anything
                  </Badge>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ResumeChat
                    resumeId={resume.id}
                    onResumeUpdate={handleResumeUpdate}
                    showPreview={false}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border" />

          {/* Editor/Preview Panel */}
          <ResizablePanel defaultSize={65} minSize={45} maxSize={65} className="min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <div className="h-full bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
                {viewMode === 'editor' ? (
                  <WysiwygEditor
                    resume={resume}
                    onSave={handleSave}
                    onCancel={() => router.push(`/dashboard/resumes/${resume.id}`)}
                    className="h-full"
                    showChatToggle={true}
                    onToggleChat={() => setShowChatPanel(!showChatPanel)}
                  />
                ) : (
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-6">
                      <ResumeViewer resume={resume} className="shadow-none border-0" />
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        /* Full-width Editor/Preview when chat is hidden */
        <div className="h-full flex flex-col min-h-0">
          <div className="h-full bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
            {viewMode === 'editor' ? (
              <WysiwygEditor
                resume={resume}
                onSave={handleSave}
                onCancel={() => router.push(`/dashboard/resumes/${resume.id}`)}
                className="h-full"
                showChatToggle={true}
                onToggleChat={() => setShowChatPanel(!showChatPanel)}
              />
            ) : (
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-6">
                  <ResumeViewer resume={resume} className="shadow-none border-0" />
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
