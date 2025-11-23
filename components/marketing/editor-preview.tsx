"use client";

import React from 'react';
import { ResumeViewer } from '@/components/resume/viewer';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/models/resume';

interface EditorPreviewProps {
  className?: string;
  resume?: Resume;
}

/**
 * Non-interactive preview of the WYSIWYG editor
 * Shows a sample resume in the editor interface
 */
export function EditorPreview({ className, resume }: EditorPreviewProps) {
  // Sample resume data for preview
  const sampleResume: Resume = resume || {
    id: 'preview',
    title: 'Sample Resume',
    personalInfo: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/sarahchen',
      github: 'https://github.com/sarahchen',
    },
    sections: [
      {
        id: 'summary',
        type: 'summary',
        title: 'Professional Summary',
        items: [
          'Experienced Software Engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.',
        ],
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Work Experience',
        items: [
          {
            id: 'exp1',
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2021-01',
            endDate: '2024-12',
            current: false,
            description: 'Led development of scalable web applications serving 1M+ users',
            achievements: [
              'Improved application performance by 40% through optimization',
              'Mentored team of 5 junior developers',
            ],
          },
          {
            id: 'exp2',
            company: 'StartupXYZ',
            position: 'Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2019-06',
            endDate: '2020-12',
            current: false,
            description: 'Developed and maintained React-based frontend applications',
          },
        ],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Education',
        items: [
          {
            id: 'edu1',
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            endDate: '2019',
            gpa: '3.8',
          },
        ],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        items: [
          { id: 'skill1', name: 'React', category: 'Frontend' },
          { id: 'skill2', name: 'TypeScript', category: 'Language' },
          { id: 'skill3', name: 'Node.js', category: 'Backend' },
          { id: 'skill4', name: 'AWS', category: 'Cloud' },
        ],
        order: 3,
      },
    ],
    template: 'default',
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      version: 1,
    },
  };

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden', className)}>
      {/* Toolbar - Disabled */}
      <div className="border-b border-border bg-muted/30 p-2 opacity-60 pointer-events-none">
        <div className="flex items-center gap-2 px-4">
          <div className="h-8 w-8 rounded bg-muted" />
          <div className="h-8 flex-1 rounded bg-muted/50" />
          <div className="h-8 w-8 rounded bg-muted" />
          <div className="h-8 w-8 rounded bg-muted" />
        </div>
      </div>

      {/* PDF Preview */}
      <div className="flex-1 relative overflow-auto bg-muted/20">
        <div className="p-4 flex justify-center">
          <div className="relative" style={{ width: '100%', maxWidth: '800px' }}>
            <div className="shadow-lg">
              <ResumeViewer resume={sampleResume} className="bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

