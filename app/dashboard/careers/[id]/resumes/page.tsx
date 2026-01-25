"use client";

import { use, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Empty } from '@/components/ui/empty';
import { useResumes } from '@/lib/hooks/use-career-profiles';
import { useHeader } from '@/lib/contexts/header-context';

export default function ResumesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { resumes, isLoading, createResume } = useResumes(resolvedParams.id);
  const { updateConfig } = useHeader();

  useEffect(() => {
    updateConfig({
      title: 'Resumes',
      description: 'Manage different versions of your resume',
      actions: (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/careers/${resolvedParams.id}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back to Career Tools
          </Link>
        </Button>
      ),
    });
  }, [updateConfig, resolvedParams.id]);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Resumes</h2>
          <p className="text-muted-foreground">Manage resumes for this career profile</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/careers/${resolvedParams.id}/resumes/new`}>
            <PlusIcon className="size-4 mr-2" />
            Create Resume
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <Empty
          title="No resumes yet"
          description="Create your first resume for this career profile"
          action={
            <Button asChild>
              <Link href={`/dashboard/careers/${resolvedParams.id}/resumes/new`}>
                <PlusIcon className="size-4 mr-2" />
                Create Resume
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{resume.title}</CardTitle>
                <CardDescription>
                  Updated {new Date(resume.updated_at!).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full gap-2">
                  <Link href={`/dashboard/careers/${resolvedParams.id}/resumes/${resume.id}/edit`}>
                    Open Editor
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
