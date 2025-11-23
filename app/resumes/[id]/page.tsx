"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { ResumeViewer } from '@/components/resume/viewer';
import { ExportButton } from '@/components/resume/export-button';
import { TemplateSelector } from '@/components/resume/template-selector';
import { Button } from '@/components/ui/button';
import { getResume, deleteResume, saveResume } from '@/lib/storage/resume-store';
import { EditIcon, ArrowLeftIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Resume } from '@/lib/models/resume';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadedResume = getResume(resolvedParams.id);
    setResume(loadedResume);
  }, [resolvedParams.id]);

  const handleDelete = () => {
    if (resume) {
      deleteResume(resume.id);
      router.push('/dashboard');
    }
  };

  const handleTemplateChange = (templateId: string) => {
    if (resume) {
      const updatedResume = { ...resume, template: templateId };
      saveResume(updatedResume);
      setResume(updatedResume);
    }
  };

  if (!resume) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
              <p className="text-muted-foreground mb-4">
                The resume you're looking for doesn't exist.
              </p>
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
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader
            title={resume.title}
            description={`Last edited ${new Date(resume.metadata.lastEdited).toLocaleDateString()}`}
            actions={
              <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                      <ArrowLeftIcon className="size-4" />
                    </Link>
                  </Button>
                <TemplateSelector resume={resume} onTemplateChange={handleTemplateChange} />
                  <ExportButton resume={resume} />
                  <Button variant="outline" asChild>
                    <Link href={`/resumes/${resume.id}/edit`}>
                      <EditIcon className="size-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </Button>
              </>
            }
          />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
              {/* Resume Viewer */}
              <div className="flex-1 overflow-auto">
                <ResumeViewer resume={resume} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resume.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

