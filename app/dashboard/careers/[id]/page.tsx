"use client";

import { use, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHeader } from '@/lib/contexts/header-context';
import { PlusIcon, FileTextIcon, ArrowRightIcon, EditIcon, SearchIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { Empty } from '@/components/ui/empty';
import { useResumes, useCareerProfileContext } from '@/lib/hooks/use-career-profiles';
import type { CareerProfile } from '@/lib/models/career-profile';
import { CareerProfileSkeleton } from '@/components/career/career-profile-skeleton';
import { CareerProfileEditor } from '@/components/career/profile-editor';
import { toast } from 'sonner';

export default function CareerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const { updateConfig } = useHeader();
  const { resumes, isLoading: resumesLoading } = useResumes(resolvedParams.id);
  const { context, updateContext, isLoading: contextLoading } = useCareerProfileContext(resolvedParams.id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/career-profiles/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setCareerProfile(data.profile);
          // Show wizard if no context exists
          if (!context && !contextLoading) {
            setShowWizard(true);
          }
        }
      } catch (error) {
        console.error('Error fetching career profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [resolvedParams.id, context, contextLoading]);

  useEffect(() => {
    if (careerProfile) {
      updateConfig({
        title: careerProfile.name,
        description: careerProfile.description || 'Manage your professional journey',
        actions: showWizard ? null : (
          <Button onClick={() => setShowWizard(true)} variant="outline">
            <SettingsIcon className="size-4 mr-2" />
            Configure Profile
          </Button>
        ),
      });
    }
  }, [careerProfile, showWizard, updateConfig]);

  const handleSaveProfile = async (profileData: any) => {
    try {
      await updateContext(profileData.context_data);
      toast.success('Career profile saved successfully');
      setShowWizard(false);
    } catch (error) {
      toast.error('Failed to save career profile');
    }
  };

  if (isLoading) {
    return <CareerProfileSkeleton />;
  }

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

  // Show wizard/editor if triggered or no context exists
  if (showWizard) {
    return (
      <div className="flex flex-1 flex-col p-6 max-w-5xl mx-auto">
        <CareerProfileEditor
          profile={context}
          onSave={handleSaveProfile}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  const latestResume = resumes[0];

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Resume Preview Section */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Current Resume</CardTitle>
                <CardDescription>
                  {latestResume ? `Last updated: ${new Date(latestResume.updated_at!).toLocaleDateString()}` : 'No resume found'}
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/careers/${careerProfile.id}/resumes`}>
                  View All
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {resumesLoading ? (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Loading preview...
                </div>
              ) : latestResume ? (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-[150px] aspect-[1/1.4] bg-muted rounded-lg border flex items-center justify-center shrink-0">
                    <FileTextIcon className="size-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="font-semibold text-lg">{latestResume.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Click to open the editor and make changes to this version.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild>
                        <Link href={`/dashboard/careers/${careerProfile.id}/resumes/${latestResume.id}/edit`}>
                          <EditIcon className="mr-2 size-4" />
                          Edit Resume
                        </Link>
                      </Button>
                      <Button asChild variant="secondary">
                        <Link href={`/dashboard/careers/${careerProfile.id}/jobs/matches`}>
                          <SearchIcon className="mr-2 size-4" />
                          Find Matches
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Empty
                  title="No resume created"
                  description="Get started by creating your first resume."
                  action={
                    <Button asChild>
                      <Link href={`/dashboard/careers/${careerProfile.id}/resumes/new`}>
                        <PlusIcon className="mr-2 size-4" />
                        Create Resume
                      </Link>
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/careers/${careerProfile.id}/resumes/new`}>
                  <PlusIcon className="size-4 mr-2" />
                  Create Resume
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/careers/${careerProfile.id}/jobs/matches`}>
                  <SearchIcon className="size-4 mr-2" />
                  Find Jobs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
