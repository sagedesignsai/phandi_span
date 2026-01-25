"use client";

import { use, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeader } from '@/lib/contexts/header-context';
import { PlusIcon, FileTextIcon, MailIcon, BriefcaseIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Empty } from '@/components/ui/empty';
import { useResumes } from '@/lib/hooks/use-career-profiles';
import type { CareerProfile } from '@/lib/models/career-profile';

export default function CareerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  const { updateConfig } = useHeader();
  const { resumes, isLoading: resumesLoading, createResume } = useResumes(resolvedParams.id);

  useEffect(() => {
    // Fetch career profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/career-profiles/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setCareerProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching career profile:', error);
      }
    };

    fetchProfile();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (careerProfile) {
      updateConfig({
        title: careerProfile.name,
        description: careerProfile.description || 'Manage your professional journey',
      });
    }
  }, [careerProfile, updateConfig]);

  if (!careerProfile) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
            <FileTextIcon className="size-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Career profile not found</h2>
            <p className="text-muted-foreground mb-4">
              The career profile you're looking for doesn't exist or has been deleted.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/careers">Back to Careers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <Tabs defaultValue="resumes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="cover-letters">Cover Letters</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="resumes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Resumes</h2>
              <p className="text-muted-foreground">Manage resumes for this career profile</p>
            </div>
            <Button asChild>
              <Link href={`/careers/new?profileId=${careerProfile.id}`}>
                <PlusIcon className="size-4 mr-2" />
                Create Resume
              </Link>
            </Button>
          </div>

          {resumesLoading ? (
            <div className="text-center py-8">Loading resumes...</div>
          ) : resumes.length === 0 ? (
            <Empty
              title="No resumes yet"
              description="Create your first resume for this career profile"
              action={
                <Button asChild>
                  <Link href={`/careers/new?profileId=${careerProfile.id}`}>
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
                      <Link href={`/dashboard/careers/${careerProfile.id}/resumes/${resume.id}`}>
                        Open Resume
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cover-letters" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Cover Letters</h2>
              <p className="text-muted-foreground">Manage cover letters for this career profile</p>
            </div>
            <Button asChild disabled>
              <span>
                <PlusIcon className="size-4 mr-2" />
                Create Cover Letter
              </span>
            </Button>
          </div>

          <Empty
            title="No cover letters yet"
            description="Cover letters will appear here once you create resumes and apply for jobs"
          />
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Job Applications</h2>
              <p className="text-muted-foreground">Track your job applications and their status</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/jobs">
                <BriefcaseIcon className="size-4 mr-2" />
                Find Jobs
              </Link>
            </Button>
          </div>

          <Empty
            title="No applications yet"
            description="Your job applications will appear here once you start applying"
            action={
              <Button asChild>
                <Link href="/dashboard/jobs">
                  <BriefcaseIcon className="size-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            }
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            <p className="text-muted-foreground">Configure your career profile preferences</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Career Context</CardTitle>
                <CardDescription>
                  Set career goals and preferences for AI personalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/careers/${careerProfile.id}/context`}>
                    Configure Career Context
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Preferences</CardTitle>
                <CardDescription>
                  Set job search and auto-apply preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/careers/${careerProfile.id}/jobs/preferences`}>
                    Configure Job Preferences
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
