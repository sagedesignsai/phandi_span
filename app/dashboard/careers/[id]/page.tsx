"use client";

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getResume } from '@/lib/storage/resume-store';
import {
  FileTextIcon,
  BriefcaseIcon,
  EditIcon,
  SearchIcon,
  FileIcon,
  SettingsIcon,
  BarChart3Icon,
  ArrowRightIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Resume } from '@/lib/models/resume';
import { useHeader } from '@/lib/contexts/header-context';

export default function CareerDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [resume, setResume] = useState<Resume | null>(null);
  const { updateConfig } = useHeader();

  useEffect(() => {
    const loadedResume = getResume(resolvedParams.id);
    setResume(loadedResume);
  }, [resolvedParams.id]);

  useEffect(() => {
    if (resume) {
      updateConfig({
        title: `${resume.title}`,
        description: 'Your complete career management toolkit',
      });
    }
  }, [resume, updateConfig]);

  if (!resume) {
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
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const tools = [
    {
      title: 'Career Profile',
      description: 'Set goals and preferences for AI personalization',
      icon: UserIcon,
      href: `/dashboard/careers/${resume.id}/profile`,
      color: 'bg-purple-500/10 text-purple-600',
      category: 'Resume',
    },
    {
      title: 'Resume Editor',
      description: 'Edit and customize your resume document',
      icon: EditIcon,
      href: `/dashboard/careers/${resume.id}/resume-editor`,
      color: 'bg-blue-500/10 text-blue-600',
      category: 'Resume',
    },
    {
      title: 'Resume Templates',
      description: 'Browse and apply professional templates',
      icon: FileIcon,
      href: '/dashboard/templates',
      color: 'bg-pink-500/10 text-pink-600',
      category: 'Resume',
    },
    {
      title: 'Cover Letters',
      description: 'View and manage your cover letters',
      icon: MailIcon,
      href: `/dashboard/careers/${resume.id}/cover-letters`,
      color: 'bg-cyan-500/10 text-cyan-600',
      category: 'Tools',
    },
    {
      title: 'Job Matcher',
      description: 'Discover jobs matching your profile',
      icon: SearchIcon,
      href: `/dashboard/careers/${resume.id}/jobs/matches`,
      color: 'bg-green-500/10 text-green-600',
      category: 'Tools',
    },
    {
      title: 'Application Tracker',
      description: 'Monitor your job applications',
      icon: BriefcaseIcon,
      href: `/dashboard/careers/${resume.id}/jobs/applications`,
      color: 'bg-purple-500/10 text-purple-600',
      category: 'Tools',
    },
    {
      title: 'Job Preferences',
      description: 'Configure search and auto-apply settings',
      icon: SettingsIcon,
      href: `/dashboard/careers/${resume.id}/jobs/preferences`,
      color: 'bg-orange-500/10 text-orange-600',
      category: 'Tools',
    },
    {
      title: 'Career Analytics',
      description: 'Track your career progress and insights',
      icon: BarChart3Icon,
      href: `/dashboard/careers/${resume.id}`,
      color: 'bg-indigo-500/10 text-indigo-600',
      category: 'Tools',
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-3">
      {/* Resume Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileTextIcon className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Resume</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.filter(t => t.category === 'Resume').map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.title} className="hover:shadow-md transition-shadow">
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
                  <Button asChild variant="outline" className="w-full">
                    <Link href={tool.href} className="flex items-center justify-between w-full">
                      <span>Open</span>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Career Tools Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BriefcaseIcon className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Career Tools</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.filter(t => t.category === 'Tools').map((tool) => {
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
      </div>
    </div>
  );
}
