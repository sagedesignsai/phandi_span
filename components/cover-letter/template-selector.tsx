"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CoverLetter, CoverLetterTemplate } from '@/lib/models/cover-letter';
import { FileTextIcon, SparklesIcon, ZapIcon, CodeIcon } from 'lucide-react';

interface TemplateSelectorProps {
  value: CoverLetterTemplate;
  onChange: (template: CoverLetterTemplate) => void;
  coverLetter: CoverLetter;
  className?: string;
}

const templates = [
  {
    id: 'professional' as const,
    name: 'Professional',
    description: 'Traditional, formal tone for corporate roles',
    icon: FileTextIcon,
    color: 'text-blue-600',
  },
  {
    id: 'creative' as const,
    name: 'Creative',
    description: 'Engaging storytelling for creative industries',
    icon: SparklesIcon,
    color: 'text-purple-600',
  },
  {
    id: 'concise' as const,
    name: 'Concise',
    description: 'Brief and direct for busy recruiters',
    icon: ZapIcon,
    color: 'text-orange-600',
  },
  {
    id: 'technical' as const,
    name: 'Technical',
    description: 'Technical terminology for tech roles',
    icon: CodeIcon,
    color: 'text-green-600',
  },
];

export function TemplateSelector({
  value,
  onChange,
  className,
}: TemplateSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-sm font-medium">Template Style</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isActive = value === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onChange(template.id)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all text-left',
                'hover:border-primary/50 hover:bg-accent/50',
                isActive
                  ? 'border-primary bg-accent'
                  : 'border-border bg-card'
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn('size-5', template.color)} />
                  <span className="font-semibold text-sm">{template.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
              {isActive && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 text-xs"
                >
                  Active
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
