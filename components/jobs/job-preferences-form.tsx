"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobPreferencesSchema } from '@/lib/models/job';
import type { JobPreferences } from '@/lib/models/job';
import { useJobPreferences } from '@/lib/hooks/use-job-preferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'remote'] as const;
const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Operations',
  'Human Resources',
] as const;

const SOUTH_AFRICAN_CITIES = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Nelspruit',
  'Polokwane',
  'Kimberley',
] as const;

const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Executive',
] as const;

interface JobPreferencesFormProps {
  resumeId?: string;
}

export function JobPreferencesForm({ resumeId }: JobPreferencesFormProps) {
  const { preferences, isLoading, updatePreferences } = useJobPreferences();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Partial<JobPreferences>>({
    resolver: zodResolver(jobPreferencesSchema.partial()),
    defaultValues: preferences || {
      job_types: ['full-time', 'part-time'],
      preferred_sources: ['indeed', 'linkedin'],
      auto_apply_enabled: false,
      auto_apply_threshold: 80,
    },
  });

  useEffect(() => {
    if (preferences) {
      Object.keys(preferences).forEach((key) => {
        const value = preferences[key as keyof JobPreferences];
        if (value !== undefined) {
          setValue(key as keyof JobPreferences, value as any);
        }
      });
    }
  }, [preferences, setValue]);

  const jobTypes = watch('job_types') || [];
  const preferredSources = watch('preferred_sources') || [];
  const autoApplyEnabled = watch('auto_apply_enabled') || false;
  const autoApplyThreshold = watch('auto_apply_threshold') || 80;
  const salaryMin = watch('salary_min');
  const salaryMax = watch('salary_max');

  const onSubmit = async (data: Partial<JobPreferences>) => {
    try {
      setIsSaving(true);
      await updatePreferences(data);
      toast.success('Job preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading preferences...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Job Types */}
      <Card>
        <CardHeader>
          <CardTitle>Job Types</CardTitle>
          <CardDescription>Select the types of positions you're interested in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {JOB_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`job-type-${type}`}
                checked={jobTypes.includes(type)}
                onCheckedChange={(checked) => {
                  const current = jobTypes;
                  if (checked) {
                    setValue('job_types', [...current, type]);
                  } else {
                    setValue('job_types', current.filter((t) => t !== type));
                  }
                }}
              />
              <Label htmlFor={`job-type-${type}`} className="capitalize cursor-pointer">
                {type.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Industries */}
      <Card>
        <CardHeader>
          <CardTitle>Industries</CardTitle>
          <CardDescription>Select industries you're interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {INDUSTRIES.map((industry) => {
              const industries = watch('industries') || [];
              return (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={industries.includes(industry)}
                    onCheckedChange={(checked) => {
                      const current = industries;
                      if (checked) {
                        setValue('industries', [...current, industry]);
                      } else {
                        setValue('industries', current.filter((i) => i !== industry));
                      }
                    }}
                  />
                  <Label htmlFor={`industry-${industry}`} className="cursor-pointer">
                    {industry}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Select cities in South Africa where you'd like to work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {SOUTH_AFRICAN_CITIES.map((city) => {
              const locations = watch('locations') || [];
              return (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${city}`}
                    checked={locations.includes(city)}
                    onCheckedChange={(checked) => {
                      const current = locations;
                      if (checked) {
                        setValue('locations', [...current, city]);
                      } else {
                        setValue('locations', current.filter((l) => l !== city));
                      }
                    }}
                  />
                  <Label htmlFor={`location-${city}`} className="cursor-pointer">
                    {city}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Salary Range */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Range</CardTitle>
          <CardDescription>Your preferred salary range (in ZAR)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary-min">Minimum (ZAR)</Label>
              <Input
                id="salary-min"
                type="number"
                {...register('salary_min', { valueAsNumber: true })}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="salary-max">Maximum (ZAR)</Label>
              <Input
                id="salary-max"
                type="number"
                {...register('salary_max', { valueAsNumber: true })}
                placeholder="100000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Level</CardTitle>
          <CardDescription>Your current experience level</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            {...register('experience_level')}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select experience level</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Enter your key skills (comma-separated)</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="JavaScript, React, Node.js, Python..."
            onChange={(e) => {
              const skills = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              setValue('skills', skills);
            }}
            defaultValue={watch('skills')?.join(', ') || ''}
          />
        </CardContent>
      </Card>

      {/* Preferred Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Job Sources</CardTitle>
          <CardDescription>Select where to search for jobs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="source-indeed"
              checked={preferredSources.includes('indeed')}
              onCheckedChange={(checked) => {
                const current = preferredSources;
                if (checked) {
                  setValue('preferred_sources', [...current, 'indeed']);
                } else {
                  setValue('preferred_sources', current.filter((s) => s !== 'indeed'));
                }
              }}
            />
            <Label htmlFor="source-indeed" className="cursor-pointer">
              Indeed South Africa
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="source-linkedin"
              checked={preferredSources.includes('linkedin')}
              onCheckedChange={(checked) => {
                const current = preferredSources;
                if (checked) {
                  setValue('preferred_sources', [...current, 'linkedin']);
                } else {
                  setValue('preferred_sources', current.filter((s) => s !== 'linkedin'));
                }
              }}
            />
            <Label htmlFor="source-linkedin" className="cursor-pointer">
              LinkedIn Jobs
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Apply Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Apply Settings</CardTitle>
          <CardDescription>
            Automatically apply to jobs that match your criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-apply" className="cursor-pointer">
              Enable Auto-Apply
            </Label>
            <Switch
              id="auto-apply"
              checked={autoApplyEnabled}
              onCheckedChange={(checked) => setValue('auto_apply_enabled', checked)}
            />
          </div>
          {autoApplyEnabled && (
            <div className="space-y-2">
              <Label>
                Match Score Threshold: {autoApplyThreshold}%
              </Label>
              <Slider
                value={[autoApplyThreshold]}
                onValueChange={([value]) => setValue('auto_apply_threshold', value)}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Only apply to jobs with a match score of {autoApplyThreshold}% or higher
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
}
