"use client";

import { useEffect, useState } from "react";
import { JobList } from "@/components/jobs/job-list";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getResume } from "@/lib/storage/resume-store";
import type { Resume } from "@/lib/models/resume";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useHeader } from "@/lib/contexts/header-context";

export default function JobMatchesPage({
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
        title: `Job Matches: ${resume.title}`,
        description: "Discover jobs that match this resume and preferences",
        actions: (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/resumes/${resumeId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back to Resume
            </Link>
          </Button>
        ),
      });
    }
  }, [resume, resumeId, updateConfig]);

  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              {/* Job List */}
              <JobList
                resumeId={resumeId}
                filters={{}}
              />
            </div>
          </div>
        </div>
      </div>
    );
}
