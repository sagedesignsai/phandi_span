"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, FileTextIcon, MailIcon, TrashIcon, EditIcon } from 'lucide-react';
import Link from 'next/link';
import { getResume } from '@/lib/storage/resume-store';
import { listCoverLetters, deleteCoverLetter } from '@/lib/storage/cover-letter-store';
import type { Resume } from '@/lib/models/resume';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { useHeader } from '@/lib/contexts/header-context';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';

export default function CoverLettersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const careerId = resolvedParams.id;
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const { updateConfig } = useHeader();

  useEffect(() => {
    const loadedResume = getResume(careerId);
    setResume(loadedResume);
    
    if (loadedResume) {
      const allLetters = listCoverLetters();
      const filtered = allLetters.filter(letter => letter.resumeId === careerId);
      setCoverLetters(filtered);
    }
  }, [careerId]);

  useEffect(() => {
    if (resume) {
      updateConfig({
        title: `Cover Letters: ${resume.title}`,
        description: `${coverLetters.length} cover letter${coverLetters.length !== 1 ? 's' : ''}`,
        actions: (
          <Button asChild>
            <Link href={`/dashboard/careers/${careerId}/cover-letters/new`}>
              <PlusIcon className="size-4 mr-2" />
              New Cover Letter
            </Link>
          </Button>
        ),
      });
    }
  }, [resume, coverLetters, careerId, updateConfig]);

  const handleDelete = (letterId: string) => {
    if (confirm('Are you sure you want to delete this cover letter?')) {
      deleteCoverLetter(letterId);
      const allLetters = listCoverLetters();
      const filtered = allLetters.filter(letter => letter.resumeId === careerId);
      setCoverLetters(filtered);
      toast.success('Cover letter deleted');
    }
  };

  if (!resume) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Career profile not found</p>
        </div>
      </div>
    );
  }

  if (coverLetters.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-muted w-fit mx-auto">
            <MailIcon className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">No cover letters yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first cover letter for this career profile
            </p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/careers/${careerId}/cover-letters/new`}>
              <PlusIcon className="size-4 mr-2" />
              Create Cover Letter
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coverLetters.map((letter) => (
          <Card 
            key={letter.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/dashboard/careers/${careerId}/cover-letters/${letter.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-1">
                    {letter.jobTitle || 'Untitled Cover Letter'}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {letter.companyName || 'No company specified'}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/careers/${careerId}/cover-letters/${letter.id}`}>
                        <FileTextIcon className="size-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/careers/${careerId}/cover-letters/${letter.id}/edit`}>
                        <EditIcon className="size-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(letter.id);
                      }}
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{letter.template}</Badge>
                  <Badge variant="secondary">{letter.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(letter.metadata.createdAt), { addSuffix: true })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
