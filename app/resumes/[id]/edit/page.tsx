"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { ResumeEditor } from '@/components/resume/editor';
import { ResumeChat } from '@/components/chat/resume-chat';
import { getResume, saveResume } from '@/lib/storage/resume-store';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import type { Resume } from '@/lib/models/resume';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

/**
 * Auto-collapse sidebar when chat panel is shown
 */
function AutoCollapseSidebar({ children }: { children: React.ReactNode }) {
  const { setOpen, open } = useSidebar();
  const wasOpenRef = React.useRef(open);

  useEffect(() => {
    wasOpenRef.current = open;
    if (open) {
      setOpen(false);
    }
    return () => {
      if (wasOpenRef.current) {
        setOpen(true);
      }
    };
  }, [setOpen]);

  return <>{children}</>;
}

export default function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const loadedResume = getResume(resolvedParams.id);
    setResume(loadedResume);
  }, [resolvedParams.id]);

  const handleSave = (updatedResume: Resume) => {
    saveResume(updatedResume);
    setResume(updatedResume);
  };

  const handleResumeUpdate = (updatedResume: Resume) => {
    setResume(updatedResume);
  };

  if (!resume) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
                <AlertCircleIcon className="size-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
                <p className="text-muted-foreground mb-4">
                  The resume you're looking for doesn't exist.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset>
        <SiteHeader
          title="Edit Resume"
          description={`${resume.title} • Edit manually or use AI assistance`}
          actions={
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/resumes/${resume.id}`}>
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
          }
        />
        <AutoCollapseSidebar>
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* 2-Column Layout: Editor and Chat */}
            <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
              {/* Editor Panel */}
              <ResizablePanel defaultSize={60} minSize={45} maxSize={70}>
                <div className="h-full pr-4 pt-4">
                  <div className="h-full rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                    <ResumeEditor
                      resume={resume}
                      onSave={handleSave}
                      onCancel={() => router.push(`/resumes/${resume.id}`)}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-border" />

              {/* Chat Panel */}
              <ResizablePanel defaultSize={40} minSize={30} maxSize={55}>
                <div className="h-full pl-4 pt-4">
                  <div className="h-full rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                    <ResumeChat
                      resumeId={resume.id}
                      onResumeUpdate={handleResumeUpdate}
                      showPreview={true}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </AutoCollapseSidebar>
      </SidebarInset>
    </SidebarProvider>
  );
}
