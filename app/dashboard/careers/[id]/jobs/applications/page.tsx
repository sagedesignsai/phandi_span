"use client";

import { useEffect, useState } from "react";
import { ApplicationTracker } from "@/components/jobs/application-tracker";
import { getResume } from "@/lib/storage/resume-store";
import type { Resume } from "@/lib/models/resume";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useHeader } from "@/lib/contexts/header-context";
import { CareerListSkeleton } from "@/components/career/career-list-skeleton";

export default function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as any;
  const resumeId = resolvedParams.id || "";
  const [resume, setResume] = useState<Resume | null>(null);
  const { updateConfig } = useHeader();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      const loadedResume = getResume(resolved.id);
      setResume(loadedResume);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (resume) {
      updateConfig({
        title: `Applications: ${resume.title}`,
        description: "Track and manage your job applications",
        actions: (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/careers/${resumeId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back to Career Tools
            </Link>
          </Button>
        ),
      });
    }
  }, [resume, resumeId, updateConfig]);

  if (!resume) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <CareerListSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <ApplicationTracker resumeId={resumeId} />
          </div>
        </div>
      </div>
    </div>
  );
}
