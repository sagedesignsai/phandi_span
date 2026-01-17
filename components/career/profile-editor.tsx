"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { XIcon, PlusIcon } from 'lucide-react';
import type { CareerProfileContext } from '@/lib/models/career-profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CareerProfileEditorProps {
  profile?: CareerProfileContext;
  onSave: (profile: CareerProfileContext) => void;
  onCancel?: () => void;
}

export function CareerProfileEditor({ profile, onSave, onCancel }: CareerProfileEditorProps) {
  const [formData, setFormData] = useState<CareerProfileContext>(profile || {});

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addToArray = (path: string, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) current[keys[keys.length - 1]] = [];
      current[keys[keys.length - 1]] = [...current[keys[keys.length - 1]], value];
      return updated;
    });
  };

  const removeFromArray = (path: string, index: number) => {
    setFormData(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = current[keys[keys.length - 1]].filter((_: any, i: number) => i !== index);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="skills">Skills & Certs</TabsTrigger>
        </TabsList>

        {/* Career Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Goals</CardTitle>
              <CardDescription>Define your short-term and long-term career objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Short-term Goals (1-2 years)</Label>
                <Textarea
                  value={formData.careerGoals?.shortTerm || ''}
                  onChange={(e) => updateField('careerGoals.shortTerm', e.target.value)}
                  placeholder="e.g., Become a senior developer, lead a team..."
                />
              </div>
              <div>
                <Label>Long-term Goals (5+ years)</Label>
                <Textarea
                  value={formData.careerGoals?.longTerm || ''}
                  onChange={(e) => updateField('careerGoals.longTerm', e.target.value)}
                  placeholder="e.g., CTO, start own company..."
                />
              </div>
              <div>
                <Label>Target Roles</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add target role"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('careerGoals.targetRoles', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.careerGoals?.targetRoles?.map((role, i) => (
                    <Badge key={i} variant="secondary">
                      {role}
                      <button type="button" onClick={() => removeFromArray('careerGoals.targetRoles', i)} className="ml-1">
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Preferences</CardTitle>
              <CardDescription>Specify your ideal work environment and conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Work Type</Label>
                  <Select
                    value={formData.workPreferences?.workType}
                    onValueChange={(value) => updateField('workPreferences.workType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Employment Type</Label>
                  <Select
                    value={formData.workPreferences?.employmentType}
                    onValueChange={(value) => updateField('workPreferences.employmentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Salary Expectation (USD)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={formData.workPreferences?.salaryExpectation?.min || ''}
                    onChange={(e) => updateField('workPreferences.salaryExpectation.min', parseInt(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={formData.workPreferences?.salaryExpectation?.max || ''}
                    onChange={(e) => updateField('workPreferences.salaryExpectation.max', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Describe your professional identity and strengths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Professional Summary</Label>
                <Textarea
                  value={formData.professionalSummary || ''}
                  onChange={(e) => updateField('professionalSummary', e.target.value)}
                  placeholder="Brief overview of your professional background..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Unique Value Proposition</Label>
                <Textarea
                  value={formData.uniqueValueProposition || ''}
                  onChange={(e) => updateField('uniqueValueProposition', e.target.value)}
                  placeholder="What makes you unique? What value do you bring?"
                  rows={3}
                />
              </div>
              <div>
                <Label>Key Strengths</Label>
                <Input
                  placeholder="Add strength (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('keyStrengths', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keyStrengths?.map((strength, i) => (
                    <Badge key={i} variant="secondary">
                      {strength}
                      <button type="button" onClick={() => removeFromArray('keyStrengths', i)} className="ml-1">
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Certifications Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Skills & Context</CardTitle>
              <CardDescription>Soft skills, languages, and additional context for AI tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Soft Skills</Label>
                <Input
                  placeholder="Add soft skill (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('softSkills', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.softSkills?.map((skill, i) => (
                    <Badge key={i} variant="outline">
                      {skill}
                      <button type="button" onClick={() => removeFromArray('softSkills', i)} className="ml-1">
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Additional Context for AI</Label>
                <Textarea
                  value={formData.additionalContext || ''}
                  onChange={(e) => updateField('additionalContext', e.target.value)}
                  placeholder="Any additional information that would help AI tools understand your career better..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Career Profile</Button>
      </div>
    </form>
  );
}
