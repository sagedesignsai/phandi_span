"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { CareerProfileContext } from '@/lib/models/career-profile';
import { SaveIcon } from 'lucide-react';
import { JobPreferencesStep } from './wizard-steps/job-preferences-step';
import { ProfileContextStep } from './wizard-steps/profile-context-step';

interface CareerProfileEditorProps {
  profile?: CareerProfileContext;
  onSave: (profile: CareerProfileContext) => void;
  onCancel?: () => void;
}

type FormData = {
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

export function CareerProfileEditor({ profile, onSave, onCancel }: CareerProfileEditorProps) {
  const form = useForm<FormData>({
    defaultValues: {
      jobTypes: profile?.context_data?.jobSearch?.jobTypes || ['full-time'],
      industries: profile?.context_data?.jobSearch?.industries || [],
      locations: profile?.context_data?.jobSearch?.locations || [],
      experienceLevel: profile?.context_data?.jobSearch?.experienceLevel,
      technicalSkills: profile?.context_data?.jobSearch?.technicalSkills || [],
      salaryMin: profile?.context_data?.jobSearch?.salaryRange?.min,
      salaryMax: profile?.context_data?.jobSearch?.salaryRange?.max,
      workType: profile?.context_data?.workPreferences?.workType,
      shortTermGoals: profile?.context_data?.careerGoals?.shortTerm,
      longTermGoals: profile?.context_data?.careerGoals?.longTerm,
      professionalSummary: profile?.context_data?.professionalSummary,
      keyStrengths: profile?.context_data?.keyStrengths || [],
    }
  });

  const onSubmit = (data: FormData) => {
    const updatedProfile: CareerProfileContext = {
      ...profile,
      context_data: {
        ...profile?.context_data,
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
    } as CareerProfileContext;
    
    onSave(updatedProfile);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <JobPreferencesStep form={form} />
      <ProfileContextStep form={form} />

      <div className="flex justify-end gap-2 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          <SaveIcon className="size-4 mr-2" />
          Save Profile
        </Button>
      </div>
    </form>
  );
}
