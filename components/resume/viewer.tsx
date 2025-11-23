"use client";

import type { Resume } from '@/lib/models/resume';
import { DefaultTemplate } from './templates/default-template';
import { ModernTemplate } from './templates/modern-template';
import { ClassicTemplate } from './templates/classic-template';
import { MinimalistTemplate } from './templates/minimalist-template';
import { cn } from '@/lib/utils';

interface ResumeViewerProps {
  resume: Resume;
  className?: string;
}

export function ResumeViewer({ resume, className }: ResumeViewerProps) {
  const templateId = resume.template || 'default';

  switch (templateId) {
    case 'modern':
      return <ModernTemplate resume={resume} className={className} />;
    case 'classic':
      return <ClassicTemplate resume={resume} className={className} />;
    case 'minimalist':
      return <MinimalistTemplate resume={resume} className={className} />;
    case 'default':
    default:
      return <DefaultTemplate resume={resume} className={className} />;
  }
}
