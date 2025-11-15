"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ResumeGrid } from "@/components/dashboard/resume-grid";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listResumes, deleteResume, duplicateResume } from "@/lib/storage/resume-store";
import type { Resume } from "@/lib/models/resume";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    // Load resumes from localStorage
    const loadedResumes = listResumes();
    setResumes(loadedResumes);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id);
      setResumes(listResumes());
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateResume(id);
    if (duplicated) {
      setResumes(listResumes());
    }
  };

  return (
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
          title="My Resumes"
          description="Manage and edit your resumes"
          actions={
            <Button asChild>
              <Link href="/resumes/new">
                <PlusIcon className="size-4 mr-2" />
                Create New Resume
              </Link>
            </Button>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              {/* Resume Grid */}
              <div className="px-4 lg:px-6">
                <ResumeGrid
                  resumes={resumes}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
