"use client";

import { CheckCircle2Icon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CareerProfileContext } from '@/lib/models/career-profile';

interface CompletionStepProps {
  data: CareerProfileContext;
  onFinish: () => void;
}

export function CompletionStep({ data, onFinish }: CompletionStepProps) {
  const getCompletionStats = () => {
    let completed = 0;
    let total = 6;

    if (data.careerGoals?.shortTerm || data.careerGoals?.longTerm) completed++;
    if (data.workPreferences?.workType || data.workPreferences?.employmentType) completed++;
    if (data.professionalSummary) completed++;
    if (data.uniqueValueProposition) completed++;
    if (data.keyStrengths?.length) completed++;
    if (data.additionalContext) completed++;

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircle2Icon className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold">Career Profile Complete!</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your career profile has been created successfully. AI tools can now provide personalized assistance based on your goals and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mx-auto mb-2">
              <SparklesIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Profile Completeness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.percentage}%
            </div>
            <CardDescription>
              {stats.completed} of {stats.total} sections completed
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-2">
              <CheckCircle2Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">AI Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
              ✓ Enabled
            </div>
            <CardDescription>
              Personalized recommendations active
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mx-auto mb-2">
              <ArrowRightIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Ready
            </div>
            <CardDescription>
              Explore career tools and job matching
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary">1</Badge>
            <span className="text-sm">Explore job matches based on your profile</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary">2</Badge>
            <span className="text-sm">Generate personalized cover letters</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary">3</Badge>
            <span className="text-sm">Set up job preferences and auto-apply</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onFinish} size="lg" className="gap-2">
        Go to Career Dashboard
        <ArrowRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
