"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createCoverLetter } from '@/lib/storage/cover-letter-store';
import { listResumes } from '@/lib/storage/resume-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeftIcon, SparklesIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';
import { TemplateSelector } from '@/components/cover-letter/template-selector';
import type { CoverLetterTemplate } from '@/lib/models/cover-letter';
import { toast } from 'sonner';
import { use } from 'react';

export default function NewCoverLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const careerId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resumeId, setResumeId] = useState(careerId);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [template, setTemplate] = useState<CoverLetterTemplate>('professional');
  const [isCreating, setIsCreating] = useState(false);

  const resumes = listResumes();

  // Pre-select resume from route parameter
  useEffect(() => {
    setResumeId(careerId);
  }, [careerId]);

  const handleCreate = async (withAI: boolean) => {
    if (!resumeId) {
      toast.error('Please select a resume');
      return;
    }

    setIsCreating(true);
    try {
      const newCoverLetter = createCoverLetter({
        resumeId,
        jobTitle: jobTitle || undefined,
        companyName: companyName || undefined,
        recipientName: recipientName || undefined,
        template,
        content: '',
      });

      toast.success('Cover letter created');
      
      if (withAI) {
        router.push(`/dashboard/careers/${resumeId}/cover-letters/${newCoverLetter.id}/edit?generate=true`);
      } else {
        router.push(`/dashboard/careers/${resumeId}/cover-letters/${newCoverLetter.id}/edit`);
      }
    } catch (error) {
      toast.error('Failed to create cover letter');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-full">
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter Details</CardTitle>
              <CardDescription>
                Provide information about the job you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume *</Label>
                <Select value={resumeId} onValueChange={setResumeId}>
                  <SelectTrigger id="resume">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No resumes found. Create one first.
                      </div>
                    ) : (
                      resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {resumes.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    <Link href="/dashboard/careers/new" className="text-primary hover:underline">
                      Create a career profile
                    </Link>{' '}
                    to get started
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name (Optional)</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., John Smith"
                />
                <p className="text-xs text-muted-foreground">
                  If you know the hiring manager's name
                </p>
              </div>

              <TemplateSelector
                value={template}
                onChange={setTemplate}
                coverLetter={{
                  id: '',
                  resumeId,
                  content: '',
                  template,
                  status: 'draft',
                  metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastEdited: new Date().toISOString(),
                    version: 1,
                  },
                }}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SparklesIcon className="size-5 text-primary" />
                  Generate with AI
                </CardTitle>
                <CardDescription>
                  Let AI create a personalized cover letter based on your resume and job details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleCreate(true)}
                  disabled={!resumeId || isCreating}
                  className="w-full gap-2"
                >
                  <SparklesIcon className="size-4" />
                  Generate with AI
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="size-5" />
                  Start from Scratch
                </CardTitle>
                <CardDescription>
                  Create a blank cover letter and write it yourself
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleCreate(false)}
                  disabled={!resumeId || isCreating}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <FileTextIcon className="size-4" />
                  Start from Scratch
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
