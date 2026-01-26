"use client";

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XIcon, PlusIcon, BriefcaseIcon, MapPinIcon, DollarSignIcon, CodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time', icon: '💼' },
  { value: 'part-time', label: 'Part-time', icon: '⏰' },
  { value: 'contract', label: 'Contract', icon: '📝' },
  { value: 'remote', label: 'Remote', icon: '🏠' },
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 
  'Marketing', 'Sales', 'E-commerce', 'Consulting',
  'Manufacturing', 'Real Estate', 'Media', 'Retail'
];

const LOCATIONS = [
  'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 
  'Port Elizabeth', 'Bloemfontein', 'Remote', 'Hybrid'
];

const EXPERIENCE_LEVELS = [
  { value: 'Entry Level', icon: '🌱' },
  { value: 'Mid Level', icon: '🚀' },
  { value: 'Senior Level', icon: '⭐' },
  { value: 'Executive', icon: '👔' },
];

const COMMON_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL',
  'AWS', 'Docker', 'Git', 'TypeScript', 'Java'
];

interface JobPreferencesStepProps {
  form: UseFormReturn<any>;
}

export function JobPreferencesStep({ form }: JobPreferencesStepProps) {
  const [skillInput, setSkillInput] = useState('');
  const jobTypes = form.watch('jobTypes') || [];
  const industries = form.watch('industries') || [];
  const locations = form.watch('locations') || [];
  const skills = form.watch('technicalSkills') || [];

  const toggleItem = (field: string, item: string) => {
    const current = form.getValues(field) || [];
    form.setValue(field, current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item]);
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      form.setValue('technicalSkills', [...skills, skill.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    form.setValue('technicalSkills', skills.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <BriefcaseIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Job Preferences</h2>
        <p className="text-muted-foreground">
          Tell us what you're looking for in your next role
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💼 Employment Type
          </CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {JOB_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleItem('jobTypes', type.value)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  jobTypes.includes(type.value)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏢 Industries
            </CardTitle>
            <CardDescription>Select your target industries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
              {INDUSTRIES.map(industry => (
                <Badge
                  key={industry}
                  variant={industries.includes(industry) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleItem('industries', industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Locations
            </CardTitle>
            <CardDescription>Where would you like to work?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
              {LOCATIONS.map(location => (
                <Badge
                  key={location}
                  variant={locations.includes(location) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleItem('locations', location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Experience Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => form.setValue('experienceLevel', level.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    form.watch('experienceLevel') === level.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xl mb-1">{level.icon}</div>
                  <div className="text-sm font-medium">{level.value}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSignIcon className="w-5 h-5" />
              Salary Range (ZAR/year)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Minimum</Label>
                <Input
                  type="number"
                  {...form.register('salaryMin', { valueAsNumber: true })}
                  placeholder="50,000"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Maximum</Label>
                <Input
                  type="number"
                  {...form.register('salaryMax', { valueAsNumber: true })}
                  placeholder="100,000"
                />
              </div>
            </div>
            {form.watch('salaryMin') && form.watch('salaryMax') && (
              <p className="text-sm text-muted-foreground text-center">
                R{form.watch('salaryMin')?.toLocaleString()} - R{form.watch('salaryMax')?.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeIcon className="w-5 h-5" />
            Technical Skills
          </CardTitle>
          <CardDescription>Add your key technical skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Type a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addSkill(skillInput)}
              size="icon"
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>

          {skills.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map(skill => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addSkill(skill)}
                  >
                    + {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="gap-1 text-sm py-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(idx)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
