"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { CareerProfileWizard } from '@/components/career/career-profile-wizard';
import { CareerProfileEditor } from '@/components/career/profile-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, BotIcon, FormInputIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { getResume } from '@/lib/storage/resume-store';
import type { Resume } from '@/lib/models/resume';
import { Loader } from '@/components/ai-elements/loader';

export default function CreateCareerProfileWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!resumeId) {
      router.push('/dashboard/careers/create');
      return;
    }

    const loadedResume = getResume(resumeId);
    if (!loadedResume) {
      router.push('/dashboard/careers/create');
      return;
    }

    setResume(loadedResume);
    setIsLoading(false);
  }, [resumeId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset>
        <SiteHeader
          title="Create Career Profile"
          description={`Building profile for: ${resume.title}`}
          actions={
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/careers/create">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="flex flex-1 flex-col p-6">
          <Tabs defaultValue="wizard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="wizard" className="gap-2">
                <FormInputIcon className="w-4 h-4" />
                Guided Form
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <BotIcon className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wizard">
              <CareerProfileWizard
                resumeId={resumeId}
                onComplete={() => {
                  // Profile created successfully, wizard will handle navigation
                }}
              />
            </TabsContent>

            <TabsContent value="ai">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">AI-Powered Profile Creation</h2>
                  <p className="text-muted-foreground">
                    Chat with AI to build your career profile naturally through conversation
                  </p>
                </div>
                <CareerProfileEditor
                  onSave={() => {
                    router.push(`/dashboard/careers/${resumeId}`);
                  }}
                  onCancel={() => router.push(`/dashboard/careers/${resumeId}`)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
