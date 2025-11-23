"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaletteIcon, CheckIcon } from 'lucide-react';
import { resumeTemplates } from '@/lib/resume-templates';
import type { Resume } from '@/lib/models/resume';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  resume: Resume;
  onTemplateChange: (templateId: string) => void;
  className?: string;
}

export function TemplateSelector({ resume, onTemplateChange, className }: TemplateSelectorProps) {
  const currentTemplate = resumeTemplates.find((t) => t.id === resume.template) || resumeTemplates[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <PaletteIcon className="size-4" />
          Template: {currentTemplate.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {resumeTemplates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{template.name}</span>
              <span className="text-xs text-muted-foreground">{template.description}</span>
            </div>
            {resume.template === template.id && (
              <CheckIcon className="size-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

