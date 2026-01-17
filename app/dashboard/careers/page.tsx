"use client";

import { CareerGrid } from "@/components/dashboard/career-grid";
import { Button } from "@/components/ui/button";
import { PlusIcon, Briefcase } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { listResumes, deleteResume, duplicateResume } from "@/lib/storage/resume-store";
import { useHeaderContext } from "@/lib/contexts/header-context";
import type { Resume } from "@/lib/models/resume";

export default function CareersPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const { updateConfig } = useHeaderContext();

  useEffect(() => {
    // Load resumes from localStorage
    const loadedResumes = listResumes();
    setResumes(loadedResumes);
    
    // Configure header with action buttons
    updateConfig({
      actions: (
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/careers/new">
              <PlusIcon className="size-4 mr-2" />
              Create Career Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/jobs">
              <Briefcase className="size-4 mr-2" />
              Find Jobs
            </Link>
          </Button>
        </div>
      ),
    });
  }, [updateConfig]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this career profile?')) {
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
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Resume Grid */}
          <div className="px-4 lg:px-6">
            <CareerGrid
              resumes={resumes}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
