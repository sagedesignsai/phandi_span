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
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="skills">Skills & More</TabsTrigger>
        </TabsList>

        {/* Career Goals Tab */}
        <TabsContent value="goals" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Career Goals</CardTitle>
              <CardDescription>Define your short-term and long-term career objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="short-term" className="text-sm font-medium">Short-term Goals (1-2 years)</Label>
                <Textarea
                  id="short-term"
                  value={formData.careerGoals?.shortTerm || ''}
                  onChange={(e) => updateField('careerGoals.shortTerm', e.target.value)}
                  placeholder="e.g., Become a senior developer, lead a team, master new technologies..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-term" className="text-sm font-medium">Long-term Goals (5+ years)</Label>
                <Textarea
                  id="long-term"
                  value={formData.careerGoals?.longTerm || ''}
                  onChange={(e) => updateField('careerGoals.longTerm', e.target.value)}
                  placeholder="e.g., CTO, start own company, become industry expert..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Target Roles</Label>
                <Input
                  placeholder="Type a role and press Enter to add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('careerGoals.targetRoles', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="mb-3"
                />
                {formData.careerGoals?.targetRoles && formData.careerGoals.targetRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.careerGoals.targetRoles.map((role, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                        {role}
                        <button type="button" onClick={() => removeFromArray('careerGoals.targetRoles', i)} className="ml-2 hover:text-destructive">
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No target roles added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Work Preferences</CardTitle>
              <CardDescription>Specify your ideal work environment and conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="work-type" className="text-sm font-medium">Work Type</Label>
                  <Select
                    value={formData.workPreferences?.workType}
                    onValueChange={(value) => updateField('workPreferences.workType', value)}
                  >
                    <SelectTrigger id="work-type">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">🏠 Remote</SelectItem>
                      <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                      <SelectItem value="onsite">🏢 On-site</SelectItem>
                      <SelectItem value="flexible">✨ Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employment-type" className="text-sm font-medium">Employment Type</Label>
                  <Select
                    value={formData.workPreferences?.employmentType}
                    onValueChange={(value) => updateField('workPreferences.employmentType', value)}
                  >
                    <SelectTrigger id="employment-type">
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
              <div className="space-y-2">
                <Label className="text-sm font-medium">Salary Expectation (USD)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Input
                      type="number"
                      placeholder="Minimum"
                      value={formData.workPreferences?.salaryExpectation?.min || ''}
                      onChange={(e) => updateField('workPreferences.salaryExpectation.min', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="number"
                      placeholder="Maximum"
                      value={formData.workPreferences?.salaryExpectation?.max || ''}
                      onChange={(e) => updateField('workPreferences.salaryExpectation.max', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                {formData.workPreferences?.salaryExpectation?.min && formData.workPreferences?.salaryExpectation?.max && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ${formData.workPreferences.salaryExpectation.min.toLocaleString()} - ${formData.workPreferences.salaryExpectation.max.toLocaleString()} USD
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Professional Profile</CardTitle>
              <CardDescription>Describe your professional identity and unique strengths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-sm font-medium">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.professionalSummary || ''}
                  onChange={(e) => updateField('professionalSummary', e.target.value)}
                  placeholder="Brief overview of your professional background, expertise, and what drives you..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">This helps AI understand your professional identity</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value-prop" className="text-sm font-medium">Unique Value Proposition</Label>
                <Textarea
                  id="value-prop"
                  value={formData.uniqueValueProposition || ''}
                  onChange={(e) => updateField('uniqueValueProposition', e.target.value)}
                  placeholder="What makes you unique? What specific value do you bring to organizations?"
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Key Strengths</Label>
                <Input
                  placeholder="Type a strength and press Enter to add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('keyStrengths', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="mb-3"
                />
                {formData.keyStrengths && formData.keyStrengths.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.keyStrengths.map((strength, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                        {strength}
                        <button type="button" onClick={() => removeFromArray('keyStrengths', i)} className="ml-2 hover:text-destructive">
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No strengths added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Certifications Tab */}
        <TabsContent value="skills" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Skills & Additional Context</CardTitle>
              <CardDescription>Soft skills, languages, and additional context for AI personalization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Soft Skills</Label>
                <Input
                  placeholder="Type a soft skill and press Enter to add (e.g., Leadership, Communication)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('softSkills', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="mb-3"
                />
                {formData.softSkills && formData.softSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.softSkills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm">
                        {skill}
                        <button type="button" onClick={() => removeFromArray('softSkills', i)} className="ml-2 hover:text-destructive">
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No soft skills added yet</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="context" className="text-sm font-medium">Additional Context for AI</Label>
                <Textarea
                  id="context"
                  value={formData.additionalContext || ''}
                  onChange={(e) => updateField('additionalContext', e.target.value)}
                  placeholder="Any additional information that would help AI tools understand your career better (e.g., industry preferences, work style, achievements, aspirations)..."
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">This context will be used by AI to personalize cover letters, job recommendations, and more</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            Cancel
          </Button>
        )}
        <Button type="submit" size="lg" className="min-w-[160px]">
          Save Career Profile
        </Button>
      </div>
    </form>
  );
}
