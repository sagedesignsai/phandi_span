import { artifact } from '@ai-sdk-tools/artifacts';
import { z } from 'zod';
import type { Resume } from '@/lib/models/resume';

/**
 * Resume Artifact Schema
 * Used for real-time streaming of resume updates
 */
export const ResumeArtifact = artifact('resume', z.object({
  resumeId: z.string().optional(),
  title: z.string(),
  personalInfo: z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }),
  sections: z.array(z.object({
    id: z.string(),
    type: z.enum(['experience', 'education', 'skills', 'projects', 'summary', 'certifications', 'languages', 'custom']),
    title: z.string(),
    items: z.array(z.any()),
    order: z.number(),
  })),
  status: z.enum(['loading', 'streaming', 'complete', 'error']).default('loading'),
  progress: z.number().min(0).max(1).default(0),
  message: z.string().optional(),
}));

export type ResumeArtifactData = z.infer<typeof ResumeArtifact.schema>;

/**
 * Convert Resume to Artifact Data
 */
export function resumeToArtifactData(resume: Resume, status: 'loading' | 'streaming' | 'complete' | 'error' = 'complete', progress: number = 1, message?: string): ResumeArtifactData {
  return {
    resumeId: resume.id,
    title: resume.title,
    personalInfo: resume.personalInfo,
    sections: resume.sections,
    status,
    progress,
    message,
  };
}

/**
 * Create initial artifact data
 */
export function createInitialArtifactData(resumeId?: string): ResumeArtifactData {
  return {
    resumeId,
    title: 'New Resume',
    personalInfo: {
      name: '',
    },
    sections: [],
    status: 'loading',
    progress: 0,
  };
}

