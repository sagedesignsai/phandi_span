import { z } from 'zod';

// Career Profile Schema (Main Entity)
export const careerProfileSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CareerProfile = z.infer<typeof careerProfileSchema>;

// Resume Schema (Belongs to Career Profile)
export const resumeSchema = z.object({
  id: z.string().uuid().optional(),
  career_profile_id: z.string().uuid(),
  title: z.string().min(1),
  content: z.record(z.any()), // Resume JSON structure
  template: z.string().default('default'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Resume = z.infer<typeof resumeSchema>;

// Career Profile Context Schema (Complete career context including job search)
export const careerProfileContextSchema = z.object({
  id: z.string().uuid().optional(),
  career_profile_id: z.string().uuid(),
  context_data: z.object({
    // Job Search Preferences (Essential for matching)
    jobSearch: z.object({
      jobTypes: z.array(z.enum(['full-time', 'part-time', 'contract', 'remote'])).default(['full-time']),
      industries: z.array(z.string()).default([]),
      locations: z.array(z.string()).default([]),
      experienceLevel: z.enum(['Entry Level', 'Mid Level', 'Senior Level', 'Executive']).optional(),
      technicalSkills: z.array(z.string()).default([]),
      salaryRange: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        currency: z.string().default('ZAR'),
      }).optional(),
      preferredSources: z.array(z.string()).default(['indeed', 'linkedin']),
      autoApply: z.object({
        enabled: z.boolean().default(false),
        threshold: z.number().min(50).max(100).default(80),
      }).optional(),
    }).optional(),

    // Career Goals
    careerGoals: z.object({
      shortTerm: z.string().optional(),
      longTerm: z.string().optional(),
      targetRoles: z.array(z.string()).optional(),
      targetIndustries: z.array(z.string()).optional(),
      targetCompanies: z.array(z.string()).optional(),
    }).optional(),

    // Work Preferences (Additional preferences beyond job search)
    workPreferences: z.object({
      workType: z.enum(['remote', 'hybrid', 'onsite', 'flexible']).optional(),
      willingToRelocate: z.boolean().optional(),
    }).optional(),

    // Professional Profile
    professionalSummary: z.string().optional(),
    uniqueValueProposition: z.string().optional(),
    keyStrengths: z.array(z.string()).optional(),
    careerHighlights: z.array(z.string()).optional(),
    softSkills: z.array(z.string()).optional(),
    additionalContext: z.string().optional(),
  }),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CareerProfileContext = z.infer<typeof careerProfileContextSchema>;
