"use client";

import { use, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeader } from '@/lib/contexts/header-context';
import { PlusIcon, FileTextIcon, MailIcon, BriefcaseIcon, ArrowRightIcon, UserIcon, EditIcon, FileIcon, SearchIcon, SettingsIcon, BarChart3Icon } from 'lucide-react';
import Link from 'next/link';
import { Empty } from '@/components/ui/empty';
import { useResumes } from '@/lib/hooks/use-career-profiles';
import type { CareerProfile } from '@/lib/models/career-profile';
import { CareerProfileSkeleton } from '@/components/career/career-profile-skeleton';

export default function CareerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateConfig } = useHeader();
  const { resumes, isLoading: resumesLoading } = useResumes(resolvedParams.id);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Fetch career profile data
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/career-profiles/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setCareerProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching career profile:', error);
      } finally {
        setIsLoading(false);
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

  const latestResume = resumes[0];

  return (
    <div className="flex flex-1 flex-col p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                      {/* Placeholder for actual thumbnail/preview */}
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="font-semibold text-lg">{latestResume.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {/* We could show a summary here if available in the resume object */}
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

            {/* Stats / Quick Actions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <SearchIcon className="size-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium">Job Matches</span>
                    </div>
                    {/* Placeholder count - would need to fetch real count */}
                    <span className="text-2xl font-bold">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <BriefcaseIcon className="size-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">Applications</span>
                    </div>
                    <span className="text-2xl font-bold">-</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Completeness</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]" />
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">
                      Add a cover letter to improve your score.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Career Profile',
                description: 'Set goals and preferences for AI personalization',
                icon: UserIcon,
                href: `/dashboard/careers/${careerProfile.id}/profile`,
                color: 'bg-purple-500/10 text-purple-600',
              },
              {
                title: 'Resumes',
                description: 'Manage different versions of your resume',
                icon: FileTextIcon,
                href: `/dashboard/careers/${careerProfile.id}/resumes`,
                color: 'bg-blue-500/10 text-blue-600',
              },
              {
                title: 'Resume Templates',
                description: 'Browse and apply professional templates',
                icon: FileIcon,
                href: '/dashboard/templates',
                color: 'bg-pink-500/10 text-pink-600',
              },
              {
                title: 'Cover Letters',
                description: 'View and manage your cover letters',
                icon: MailIcon,
                href: `/dashboard/careers/${careerProfile.id}/cover-letters`,
                color: 'bg-cyan-500/10 text-cyan-600',
              },
              {
                title: 'Job Matcher',
                description: 'Discover jobs matching your profile',
                icon: SearchIcon,
                href: `/dashboard/careers/${careerProfile.id}/jobs/matches`,
                color: 'bg-green-500/10 text-green-600',
              },
              {
                title: 'Application Tracker',
                description: 'Monitor your job applications',
                icon: BriefcaseIcon,
                href: `/dashboard/careers/${careerProfile.id}/jobs/applications`,
                color: 'bg-purple-500/10 text-purple-600',
              },
              {
                title: 'Job Preferences',
                description: 'Configure search and auto-apply settings',
                icon: SettingsIcon,
                href: `/dashboard/careers/${careerProfile.id}/jobs/preferences`,
                color: 'bg-orange-500/10 text-orange-600',
              },
              {
                title: 'Career Analytics',
                description: 'Track your career progress and insights',
                icon: BarChart3Icon,
                href: '#',
                color: 'bg-indigo-500/10 text-indigo-600',
                disabled: true,
              },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.title} className={tool.disabled ? 'opacity-50' : 'hover:shadow-md transition-shadow'}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tool.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild={!tool.disabled}
                      variant="outline"
                      className="w-full"
                      disabled={tool.disabled}
                    >
                      {tool.disabled ? (
                        <span>Coming Soon</span>
                      ) : (
                        <Link href={tool.href} className="flex items-center justify-between w-full">
                          <span>Open</span>
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
