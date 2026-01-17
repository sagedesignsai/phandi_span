"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon, EditIcon, TrashIcon, CopyIcon, DownloadIcon, BriefcaseIcon } from 'lucide-react';
import type { Resume } from '@/lib/models/resume';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { ResumeViewer } from '@/components/resume/viewer';
import { useRouter } from 'nextjs-toploader/app';

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const router = useRouter();
  const lastEdited = formatDistanceToNow(new Date(resume.metadata.lastEdited), {
    addSuffix: true,
  });

  const handleCardClick = () => {
    router.push(`/dashboard/resumes/${resume.id}`);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="hover:shadow-md transition-shadow overflow-hidden flex flex-row h-48 cursor-pointer hover:bg-accent/50"
    >
      {/* Resume Preview */}
      <div className="w-1/3 bg-muted/30 relative overflow-hidden border-r">
        <div className="absolute inset-0 p-4">
          <div className="w-[400%] h-[400%] transform scale-[0.25] origin-top-left pointer-events-none select-none bg-background shadow-sm rounded-sm">
            <ResumeViewer resume={resume} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-1">{resume.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/resumes/${resume.id}`}>
                    <EditIcon className="size-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/resumes/${resume.id}/edit`}>
                    <EditIcon className="size-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/resumes/${resume.id}/jobs/matches`}>
                    <BriefcaseIcon className="size-4 mr-2" />
                    Find Jobs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate?.(resume.id)}
                >
                  <CopyIcon className="size-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(resume.id)}
                  className="text-destructive"
                >
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{resume.sections.length} sections</span>
              <span>•</span>
              <span>{resume.personalInfo.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Last edited {lastEdited}
            </p>
            <div className="flex gap-2 mt-auto pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                <Link href={`/dashboard/resumes/${resume.id}/`}>View</Link>
              </Button>
              <Button asChild size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                <Link href={`/dashboard/resumes/${resume.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
