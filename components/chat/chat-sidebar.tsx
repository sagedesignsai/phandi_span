"use client";

import { EnhancedResumeChat } from './enhanced-resume-chat';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/models/resume';

interface ChatSidebarProps {
  resumeId?: string;
  className?: string;
  onResumeUpdate?: (resume: Resume) => void;
}

export function ChatSidebar({ resumeId, className, onResumeUpdate }: ChatSidebarProps) {
  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Phandi - Your AI Resume Assistant</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ask me to help edit or improve your resume
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <EnhancedResumeChat resumeId={resumeId} onResumeUpdate={onResumeUpdate} />
      </div>
    </Card>
  );
}

