"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BasicInfoStep } from '@/components/career/wizard-steps/basic-info-step';
import { JobPreferencesStep } from '@/components/career/wizard-steps/job-preferences-step';
import { ProfileContextStep } from '@/components/career/wizard-steps/profile-context-step';

const STEPS = ['Basic Info', 'Job Preferences', 'Profile Context'];

type FormData = {
  name: string;
  description?: string;
  jobTypes: string[];
  industries: string[];
  locations: string[];
  experienceLevel?: string;
  technicalSkills: string[];
  salaryMin?: number;
  salaryMax?: number;
  workType?: string;
  shortTermGoals?: string;
  longTermGoals?: string;
  professionalSummary?: string;
  keyStrengths: string[];
};

export default function CreateCareerProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      jobTypes: ['full-time'],
      industries: [],
      locations: [],
      technicalSkills: [],
      keyStrengths: [],
    }
  });

  const handleNext = () => {
    if (step === 0 && !form.getValues('name')) {
      toast.error('Profile name is required');
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => step > 0 && setStep(step - 1);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const profileRes = await fetch('/api/career-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, description: data.description }),
      });

      if (!profileRes.ok) throw new Error('Failed to create profile');
      const { profile } = await profileRes.json();

      const contextRes = await fetch(`/api/career-profiles/${profile.id}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context_data: {
            jobSearch: {
              jobTypes: data.jobTypes,
              industries: data.industries,
              locations: data.locations,
              experienceLevel: data.experienceLevel,
              technicalSkills: data.technicalSkills,
              salaryRange: data.salaryMin || data.salaryMax ? {
                min: data.salaryMin,
                max: data.salaryMax,
                currency: 'ZAR'
              } : undefined,
              preferredSources: ['indeed', 'linkedin'],
            },
            careerGoals: {
              shortTerm: data.shortTermGoals,
              longTerm: data.longTermGoals,
            },
            workPreferences: {
              workType: data.workType,
            },
            professionalSummary: data.professionalSummary,
            keyStrengths: data.keyStrengths,
          }
        }),
      });

      if (!contextRes.ok) throw new Error('Failed to save context');

      toast.success('Career profile created!');
      router.push(`/dashboard/careers/${profile.id}`);
    } catch (error) {
      toast.error('Failed to create career profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full space-y-6 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/careers">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Cancel
            </Link>
          </Button>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {i < step ? <CheckIcon className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm hidden sm:inline">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <Progress value={((step + 1) / STEPS.length) * 100} />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="min-h-[500px] max-w-7xl mx-auto">
            {step === 0 && <BasicInfoStep form={form} />}
            {step === 1 && <JobPreferencesStep form={form} />}
            {step === 2 && <ProfileContextStep form={form} />}
          </div>

          <div className="flex justify-between pt-4 border-t max-w-7xl mx-auto">
            <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Profile'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
