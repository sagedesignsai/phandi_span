"use client";

import React, { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WysiwygEditor } from '@/components/resume/wysiwyg/editor';
import { ResumeChat } from '@/components/chat/resume-chat';
import { ResumeViewer } from '@/components/resume/viewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  AlertCircleIcon,
  Loader2Icon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { Resume } from '@/lib/models/career-profile';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useHeader } from '@/lib/contexts/header-context';
import { useChatPanel } from '@/lib/contexts/chat-panel-context';
import { useResume } from '@/lib/hooks/use-career-profiles';

type ViewMode = 'editor' | 'preview';

export default function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string; 'resume-id': string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Extract IDs from path params
  const careerProfileId = resolvedParams.id;
  const resumeId = resolvedParams['resume-id'];

  const { resume, isLoading, updateResume: updateResumeAPI } = useResume(careerProfileId, resumeId);
  const [localResume, setLocalResume] = useState<Resume | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const { showChatPanel, setShowChatPanel } = useChatPanel();
  const { updateConfig } = useHeader();

  // Initialize chat panel to hidden on mount
  useEffect(() => {
    setShowChatPanel(false);
  }, [setShowChatPanel]);

  // Update localResume when resume from API changes
  useEffect(() => {
    if (resume) {
      setLocalResume(resume);
    }
  }, [resume]);

  // Update header config when resume loads
  useEffect(() => {
    if (localResume) {
      updateConfig({
        title: `Edit - ${localResume.title || 'Resume'}`,
        description: 'Edit your resume content and customize your template',
        actions: (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/careers/${careerProfileId}`}>
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
        ),
      });
    }
  }, [localResume, updateConfig, careerProfileId]);

  // Auto-save functionality
  const performSave = useCallback(async (resumeToSave: Resume, showToast = true) => {
    try {
      setIsSaving(true);
      await updateResumeAPI({
        title: resumeToSave.title,
        content: resumeToSave.content,
        template: resumeToSave.template,
      });
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
  }, [updateResumeAPI]);

  const handleSave = useCallback((updatedResume: Resume) => {
    setLocalResume(updatedResume);
    performSave(updatedResume, true);
  }, [performSave]);

  // Stabilize the callback to prevent infinite loops
  const handleResumeUpdate = useCallback((updatedResume: Resume) => {
    setLocalResume(updatedResume);
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
        if (localResume && hasUnsavedChanges) {
          performSave(localResume, true);
        }
      }
      // Escape to go back
      if (e.key === 'Escape' && e.target === document.body) {
        router.push(`/dashboard/careers/${careerProfileId}`);
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
  }, [localResume, hasUnsavedChanges, performSave, router, careerProfileId]);

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

  if (!localResume) {
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
            <Link href={`/dashboard/careers/${careerProfileId}`}>Back to Career Profile</Link>
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
                    resumeId={localResume.id!}
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
                    resume={localResume}
                    onSave={handleSave}
                    onCancel={() => router.push(`/dashboard/careers/${careerProfileId}`)}
                    className="h-full"
                    showChatToggle={true}
                    onToggleChat={() => setShowChatPanel(!showChatPanel)}
                  />
                ) : (
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-6">
                      <ResumeViewer resume={localResume} className="shadow-none border-0" />
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
                resume={localResume}
                onSave={handleSave}
                onCancel={() => router.push(`/dashboard/careers/${careerProfileId}`)}
                className="h-full"
                showChatToggle={true}
                onToggleChat={() => setShowChatPanel(!showChatPanel)}
              />
            ) : (
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-6">
                  <ResumeViewer resume={localResume} className="shadow-none border-0" />
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
