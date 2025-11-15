"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon, EditIcon, TrashIcon, CopyIcon, DownloadIcon } from 'lucide-react';
import type { Resume } from '@/lib/models/resume';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const lastEdited = formatDistanceToNow(new Date(resume.metadata.lastEdited), {
    addSuffix: true,
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{resume.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/resumes/${resume.id}`}>
                  <EditIcon className="size-4 mr-2" />
                  Edit
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
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Last edited {lastEdited}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{resume.sections.length} sections</span>
            <span>•</span>
            <span>{resume.personalInfo.name}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/resumes/${resume.id}`}>View</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href={`/resumes/${resume.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

