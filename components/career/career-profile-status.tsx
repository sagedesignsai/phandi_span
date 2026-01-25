"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { useCareerProfile } from '@/lib/hooks/use-career-profile';
import Link from 'next/link';

interface CareerProfileStatusProps {
  resumeId: string;
}

export function CareerProfileStatus({ resumeId }: CareerProfileStatusProps) {
  const { profile, isLoading } = useCareerProfile({ resumeId, autoFetch: true });
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    setHasProfile(!!profile);
  }, [profile]);

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (hasProfile) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
              <UserIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Career Profile Active
            </CardTitle>
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
              ✓ Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-green-700 dark:text-green-300 text-xs mb-3">
            AI tools can now provide personalized assistance based on your career profile.
          </CardDescription>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/dashboard/careers/${resumeId}/profile`}>
              Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <SparklesIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Enhance with Career Profile
          </CardTitle>
          <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            Recommended
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-amber-700 dark:text-amber-300 text-xs mb-3">
          Add career goals and preferences to get personalized job matches and AI assistance.
        </CardDescription>
        <Button asChild size="sm" className="w-full gap-1">
          <Link href={`/dashboard/careers/create?resumeId=${resumeId}`}>
            Create Profile
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
