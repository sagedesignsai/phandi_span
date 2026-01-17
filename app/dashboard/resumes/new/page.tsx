"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeChat } from '@/components/chat/resume-chat';
import { ResumeViewer } from '@/components/resume/viewer';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { saveResume, getResume } from '@/lib/storage/resume-store';
import { setCurrentResumeContext } from '@/lib/ai/tools-with-artifacts';
import type { Resume } from '@/lib/models/resume';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useHeader } from '@/lib/contexts/header-context';

export default function NewResumePage() {
  const router = useRouter();
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { updateConfig } = useHeader();

  useEffect(() => {
    updateConfig({
      title: 'Create New Resume',
      description: 'Use AI assistance to build your resume step by step',
      actions: (
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
      ),
    });
  }, [updateConfig]);

  const handleResumeUpdate = (resume: Resume) => {
    setCurrentResume(resume);
    saveResume(resume);
    setCurrentResumeContext(resume.id);
  };

  const handleFinish = async () => {
    if (currentResume) {
      setIsSaving(true);
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push(`/dashboard/resumes/${currentResume.id}`);
    }
  };

  return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 2-Column Layout: Chat and Resume Preview */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={45} minSize={35} maxSize={55}>
            <div className="h-full pr-4 pt-4">
              <div className="h-full rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                <ResumeChat
                  onResumeUpdate={handleResumeUpdate}
                  showPreview={false}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border" />

          {/* Resume Preview Panel */}
          <ResizablePanel defaultSize={55} minSize={45} maxSize={65}>
            <div className="h-full pl-4 pt-4 flex flex-col">
              <div className="h-full rounded-lg border border-border bg-card overflow-hidden shadow-sm flex flex-col">
                {currentResume ? (
                  <div className="flex-1 overflow-auto p-6">
                    <ResumeViewer resume={currentResume} className="shadow-none border-0" />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                        <div className="relative p-6 rounded-full bg-primary/5">
                          <svg
                            className="w-16 h-16 mx-auto text-primary/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No Resume Yet</h3>
                    <p className="text-sm max-w-md mb-4">
                      Start chatting with Phandi to create your resume. Your resume preview will appear here as you build it.
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <p>💡 Try saying:</p>
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-3 py-1 bg-muted rounded-md">"My name is John Doe, I'm a Software Engineer"</span>
                        <span className="px-3 py-1 bg-muted rounded-md">"Add my experience at Google"</span>
                        <span className="px-3 py-1 bg-muted rounded-md">"I have a Computer Science degree from MIT"</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Footer Actions */}
        {currentResume && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-background/95 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2Icon className="size-4 text-green-60" />
              <span>Resume saved automatically</span>
            </div>
            <Button
              onClick={handleFinish}
              size="lg"
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader className="size-4" />
                  Opening...
                </>
              ) : (
                <>
                  Finish & View Resume
                  <ArrowLeftIcon className="size-4 rotate-180" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
