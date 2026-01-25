"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WysiwygEditor } from '@/components/resume/wysiwyg/editor';
import { ResumeChat } from '@/components/chat/resume-chat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { Resume } from '@/lib/models/career-profile';
import type { BlockResume } from '@/lib/models/resume';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, CheckCircle2Icon, Loader2Icon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { useResumes } from '@/lib/hooks/use-career-profiles';
import { toast } from 'sonner';
import { useHeader } from '@/lib/contexts/header-context';
import { useChatPanel } from '@/lib/contexts/chat-panel-context';

export default function NewResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { showChatPanel, setShowChatPanel } = useChatPanel();
  const [currentResume, setCurrentResume] = useState<BlockResume>({
    id: `temp-${Date.now()}`,
    title: 'Untitled Resume',
    blocks: [],
    template: 'default',
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      version: 1,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const { createResume } = useResumes(resolvedParams.id);

  useEffect(() => {
    updateConfig({
      title: "Create New Resume",
      description: "Use AI assistance to build your resume step by step",
      actions: (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/careers/${resolvedParams.id}`}>
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
      ),
    });
  }, [updateConfig, resolvedParams.id]);

  // Initialize chat panel to hidden on mount
  useEffect(() => {
    setShowChatPanel(false);
  }, [setShowChatPanel]);

  const handleResumeUpdate = (resume: BlockResume) => {
    setCurrentResume(resume);
  };

  const handleSave = (resume: BlockResume) => {
    setCurrentResume(resume);
  };

  const handleFinish = async () => {
    // Validate that resume has some content
    if (currentResume.blocks.length === 0) {
      toast.error('Please add some content to your resume first');
      return;
    }

    setIsSaving(true);
    try {
      const savedResume = await createResume({
        title: currentResume.title || 'Untitled Resume',
        content: {
          blocks: currentResume.blocks,
          metadata: currentResume.metadata,
        },
        template: currentResume.template || 'default',
      });

      toast.success('Resume created successfully!');
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push(`/dashboard/careers/${resolvedParams.id}/resumes/${savedResume.id}/edit`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-full">
      {/* Layout: Conditional Chat Panel + Editor */}
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
                    onResumeUpdate={handleResumeUpdate}
                    showPreview={false}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border" />

          {/* Editor Panel */}
          <ResizablePanel defaultSize={65} minSize={45} maxSize={65} className="min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <div className="h-full bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
                <WysiwygEditor
                  resume={currentResume}
                  onSave={handleSave}
                  onCancel={() => router.push(`/dashboard/careers/${resolvedParams.id}`)}
                  className="h-full"
                  showChatToggle={true}
                  onToggleChat={() => setShowChatPanel(!showChatPanel)}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        /* Full-width Editor when chat is hidden */
        <div className="h-full flex flex-col min-h-0">
          <div className="h-full bg-card overflow-hidden shadow-sm flex flex-col min-h-0">
            <WysiwygEditor
              resume={currentResume}
              onSave={handleSave}
              onCancel={() => router.push(`/dashboard/careers/${resolvedParams.id}`)}
              className="h-full"
              showChatToggle={true}
              onToggleChat={() => setShowChatPanel(!showChatPanel)}
            />
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {(currentResume.blocks.length > 0) && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2Icon className="size-4 text-green-600" />
            <span>Resume ready to save</span>
          </div>
          <Button
            onClick={handleFinish}
            size="lg"
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Save & Continue Editing
                <ArrowLeftIcon className="size-4 rotate-180" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
