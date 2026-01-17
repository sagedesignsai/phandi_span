import { SiteHeader } from "@/components/site-header";
import { ApplicationTracker } from "@/components/jobs/application-tracker";
import { getResume } from "@/lib/storage/resume-store";
import type { Resume } from "@/lib/models/resume";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = getResume(id);
  return {
    title: resume ? `Applications: ${resume.title}` : "Applications",
    description: "Track your job applications and their status",
  };
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: resumeId } = await params;
  const resume = getResume(resumeId);

  return (
    <>
      <SiteHeader
        title={resume ? `Applications: ${resume.title}` : "My Applications"}
        description="Track your job applications and their status for this resume"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/dashboard/resumes/${resumeId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back to Resume
            </Link>
          </Button>
        }
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <ApplicationTracker resumeId={resumeId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
