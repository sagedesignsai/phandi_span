"use client";

import { ResumeCard } from './resume-card';
import type { Resume } from '@/lib/models/resume';
import { Empty } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ResumeGridProps {
  resumes: Resume[];
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  className?: string;
}

export function ResumeGrid({ resumes, onDelete, onDuplicate, className }: ResumeGridProps) {
  if (resumes.length === 0) {
    return (
      <Empty
        title="No resumes yet"
        description="Create your first resume to get started"
        action={
          <Button asChild>
            <Link href="/dashboard/resumes/new">
              <PlusIcon className="size-4 mr-2" />
              Create Resume
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}

