"use client";

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XIcon, TargetIcon, TrendingUpIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

const WORK_TYPES = [
  { value: 'remote', label: 'Remote', icon: '🏠' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
  { value: 'onsite', label: 'On-site', icon: '🏢' },
  { value: 'flexible', label: 'Flexible', icon: '✨' },
];

const SHORT_TERM_GOALS = [
  'Get promoted to senior level',
  'Lead a major project',
  'Master a new technology',
  'Build a high-performing team',
  'Increase technical expertise',
  'Improve leadership skills',
];

const LONG_TERM_GOALS = [
  'Become a CTO or VP of Engineering',
  'Start my own company',
  'Become an industry thought leader',
  'Build a successful product',
  'Transition to executive leadership',
  'Achieve work-life balance',
];

const COMMON_STRENGTHS = [
  'Leadership', 'Problem Solving', 'Communication', 'Team Collaboration',
  'Project Management', 'Strategic Thinking', 'Adaptability', 'Innovation',
  'Time Management', 'Critical Thinking', 'Mentoring', 'Analytical Skills'
];

interface ProfileContextStepProps {
  form: UseFormReturn<any>;
}

export function ProfileContextStep({ form }: ProfileContextStepProps) {
  const [strengthInput, setStrengthInput] = useState('');
  const strengths = form.watch('keyStrengths') || [];

  const addStrength = (strength: string) => {
    if (strength.trim() && !strengths.includes(strength.trim())) {
      form.setValue('keyStrengths', [...strengths, strength.trim()]);
      setStrengthInput('');
    }
  };

  const removeStrength = (index: number) => {
    form.setValue('keyStrengths', strengths.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <UserIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Profile Context</h2>
        <p className="text-muted-foreground">
          Help AI understand your professional background and aspirations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏢 Work Preference
          </CardTitle>
          <CardDescription>What's your preferred work arrangement?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WORK_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => form.setValue('workType', type.value)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  form.watch('workType') === type.value
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5" />
            Career Goals
          </CardTitle>
          <CardDescription>What are you working towards?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shortTermGoals" className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Short-term Goals (1-2 years)
            </Label>
            <Textarea
              id="shortTermGoals"
              {...form.register('shortTermGoals')}
              placeholder="e.g., Become a senior developer, lead a team project, master cloud architecture..."
              rows={3}
            />
            {!form.watch('shortTermGoals') && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {SHORT_TERM_GOALS.map(goal => (
                    <Badge
                      key={goal}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => form.setValue('shortTermGoals', goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longTermGoals" className="flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              Long-term Goals (5+ years)
            </Label>
            <Textarea
              id="longTermGoals"
              {...form.register('longTermGoals')}
              placeholder="e.g., CTO, start own company, become industry expert, build a successful product..."
              rows={3}
            />
            {!form.watch('longTermGoals') && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {LONG_TERM_GOALS.map(goal => (
                    <Badge
                      key={goal}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => form.setValue('longTermGoals', goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Professional Summary
          </CardTitle>
          <CardDescription>Brief overview of your professional background and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            {...form.register('professionalSummary')}
            placeholder="e.g., Experienced full-stack developer with 5+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Strong background in React, Node.js, and cloud infrastructure..."
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Include your experience level, key technologies, and what drives you professionally
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⭐ Key Strengths
          </CardTitle>
          <CardDescription>What are your core competencies and soft skills?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={strengthInput}
              onChange={(e) => setStrengthInput(e.target.value)}
              placeholder="Type a strength and press Enter..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStrength(strengthInput);
                }
              }}
            />
          </div>

          {strengths.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick add common strengths:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_STRENGTHS.map(strength => (
                  <Badge
                    key={strength}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addStrength(strength)}
                  >
                    + {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="gap-1 text-sm py-1">
                    {strength}
                    <button type="button" onClick={() => removeStrength(idx)}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {strengths.length} strength{strengths.length !== 1 ? 's' : ''} added
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
