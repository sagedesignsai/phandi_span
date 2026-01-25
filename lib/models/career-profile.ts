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

// Career Profile Context Schema (AI personalization)
export const careerProfileContextSchema = z.object({
  id: z.string().uuid().optional(),
  career_profile_id: z.string().uuid(),
  context_data: z.object({
    // Career Goals
    careerGoals: z.object({
      shortTerm: z.string().optional(),
      longTerm: z.string().optional(),
      targetRoles: z.array(z.string()).optional(),
      targetIndustries: z.array(z.string()).optional(),
      targetCompanies: z.array(z.string()).optional(),
    }).optional(),

    // Work Preferences
    workPreferences: z.object({
      workType: z.enum(['remote', 'hybrid', 'onsite', 'flexible']).optional(),
      employmentType: z.enum(['full-time', 'part-time', 'contract', 'freelance']).optional(),
      salaryExpectation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        currency: z.string().default('USD'),
      }).optional(),
      willingToRelocate: z.boolean().optional(),
      preferredLocations: z.array(z.string()).optional(),
    }).optional(),

    // Professional Summary
    professionalSummary: z.string().optional(),
    uniqueValueProposition: z.string().optional(),
    keyStrengths: z.array(z.string()).optional(),
    careerHighlights: z.array(z.string()).optional(),
    industryExpertise: z.array(z.string()).optional(),
    softSkills: z.array(z.string()).optional(),
    additionalContext: z.string().optional(),
  }),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CareerProfileContext = z.infer<typeof careerProfileContextSchema>;
