"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CareerProfileEditor } from '@/components/career/profile-editor';
import { getResume, saveResume } from '@/lib/storage/resume-store';
import { useCareerProfileContext } from '@/lib/hooks/use-career-profiles';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import type { Resume } from '@/lib/models/resume';
import type { CareerProfileContext } from '@/lib/models/career-profile';
import { useHeader } from '@/lib/contexts/header-context';
import { toast } from 'sonner';
import { Loader } from '@/components/ai-elements/loader';

export default function CareerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const careerId = resolvedParams.id;
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const { updateConfig } = useHeader();
  const { context: profile, updateContext: updateProfile, isLoading } = useCareerProfileContext(careerId);

  useEffect(() => {
    const loadedResume = getResume(careerId);
    setResume(loadedResume);
  }, [careerId]);

  useEffect(() => {
    if (resume) {
      updateConfig({
        title: `Career Profile - ${resume.title}`,
        description: 'Provide context to AI tools for better personalization',
        actions: (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/careers/${careerId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back to Career Tools
            </Link>
          </Button>
        ),
      });
    }
  }, [resume, careerId, updateConfig]);

  const handleSave = async (profileData: CareerProfileContext) => {
    try {
      await updateProfile(profileData);
      
      // Also update local resume storage for backward compatibility
      if (resume) {
        const updatedResume: Resume = {
          ...resume,
          careerProfile: profileData,
          metadata: {
            ...resume.metadata,
            updatedAt: new Date().toISOString(),
          },
        };
        saveResume(updatedResume);
        setResume(updatedResume);
      }
      
      toast.success('Career profile saved successfully');
    } catch (error) {
      toast.error('Failed to save career profile');
    }
  };

  if (!resume) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 max-w-4xl mx-auto">
      <CareerProfileEditor
        profile={profile || resume.careerProfile}
        onSave={handleSave}
        onCancel={() => router.push(`/dashboard/careers/${careerId}`)}
      />
    </div>
  );
}
