'use client';

import { CheckCircle2Icon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  completed: string[];
  missing: string[];
  progress: number;
  className?: string;
}

const SECTION_LABELS: Record<string, string> = {
  personal_info: 'Personal Info',
  contact_details: 'Contact Details',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
};

export function ProgressIndicator({ completed, missing, progress, className }: ProgressIndicatorProps) {
  const allSections = [...completed, ...missing];
  
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Resume Progress</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="space-y-2">
        {allSections.map((section) => {
          const isCompleted = completed.includes(section);
          return (
            <div key={section} className="flex items-center gap-2 text-sm">
              {isCompleted ? (
                <CheckCircle2Icon className="size-4 text-primary" />
              ) : (
                <CircleIcon className="size-4 text-muted-foreground" />
              )}
              <span className={cn(
                isCompleted ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {SECTION_LABELS[section] || section}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
