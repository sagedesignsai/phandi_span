"use client";

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BriefcaseIcon, SparklesIcon } from 'lucide-react';

const PROFILE_SUGGESTIONS = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'Marketing Manager',
  'Sales Executive',
  'UX Designer',
];

interface BasicInfoStepProps {
  form: UseFormReturn<any>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <BriefcaseIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground">
          Let's start with the basics about your career profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Name *</CardTitle>
          <CardDescription>Give your career profile a memorable name</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            {...form.register('name', { required: true })}
            placeholder="e.g., Software Engineer Career"
            className="text-lg"
          />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {PROFILE_SUGGESTIONS.map(suggestion => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => form.setValue('name', suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description (Optional)</CardTitle>
          <CardDescription>Add context about your career goals and focus areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            {...form.register('description')}
            placeholder="e.g., Focused on full-stack development with React and Node.js, seeking senior roles in fintech..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
